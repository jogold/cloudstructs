import * as path from 'path';
import { DurableContext, withDurableExecution } from '@aws/durable-execution-sdk-js';
import { CloudFormationClient, DescribeStacksCommand, GetTemplateCommand } from '@aws-sdk/client-cloudformation';
import { BatchDeleteImageCommand, DescribeImagesCommand, ECRClient } from '@aws-sdk/client-ecr';
import { DeleteObjectsCommand, ListObjectVersionsCommand, S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '../utils';

const cloudFormationClient = new CloudFormationClient({});
const s3Client = new S3Client({});
const ecrClient = new ECRClient({});

interface CleanResult {
  Deleted: number;
  Reclaimed: number;
}

export const handler = withDurableExecution(async (_, context: DurableContext) => {
  // Step 1: Get all stack names
  const stackNames = await context.step('get-stack-names', getStackNames);

  context.logger.info(`Found ${stackNames.length} stacks`);

  // Step 2: Extract template hashes from each stack (maxConcurrency: 1 to avoid CloudFormation rate limiting)
  let assetHashes: string[] = [];
  if (stackNames.length > 0) {
    const hashResults = await context.map(
      'extract-hashes',
      stackNames,
      (mapContext, stackName) => mapContext.step(`extract-hash-${stackName}`, () => extractHashes(stackName)),
      { maxConcurrency: 1 },
    );

    // Flatten and deduplicate hashes
    assetHashes = [...new Set(hashResults.getResults().flat())];
  }
  context.logger.info(`Found ${assetHashes.length} unique asset hashes`);

  // Step 3: Clean objects and images in parallel
  const cleanResults = await context.parallel(
    'clean-assets',
    [
      { name: 'clean-objects', func: async (branchContext) => branchContext.step('clean-objects', async () => cleanObjects(assetHashes)) },
      { name: 'clean-images', func: async (branchContext) => branchContext.step('clean-images', async () => cleanImages(assetHashes)) },
    ],
  );

  // Sum results
  const [cleanObjectsResult, cleanImagesResult] = cleanResults.getResults();
  const result = {
    Deleted: cleanObjectsResult.Deleted + cleanImagesResult.Deleted,
    Reclaimed: cleanObjectsResult.Reclaimed + cleanImagesResult.Reclaimed,
  };

  context.logger.info('Cleanup complete', result);
  return result;
});

async function getStackNames(): Promise<string[]> {
  const stacks: string[] = [];

  let nextToken: string | undefined;
  do {
    const response = await cloudFormationClient.send(new DescribeStacksCommand({ NextToken: nextToken }));
    for (const stack of response.Stacks ?? []) {
      if (stack.StackName) {
        stacks.push(stack.StackName);
      }
    }
    nextToken = response.NextToken;
  } while (nextToken);

  return stacks;
}

async function extractHashes(stackName: string): Promise<string[]> {
  const template = await cloudFormationClient.send(new GetTemplateCommand({
    StackName: stackName,
  }));

  if (!template.TemplateBody) {
    return [];
  }

  const dockerTagPrefix = findDockerTagPrefix(getEnv('DOCKER_IMAGE_ASSET_HASH'));
  const regexp = new RegExp(`(${dockerTagPrefix})?[a-f0-9]{64}`, 'g');
  const matches = template.TemplateBody.match(regexp);

  return [...new Set(matches)];
}

function findDockerTagPrefix(hash: string): string {
  if (hash.length === 64) {
    return '';
  }
  return hash.substring(0, hash.length - 64);
}

async function cleanObjects(assetHashes: string[]): Promise<CleanResult> {
  const bucketName = getEnv('BUCKET_NAME');

  let deleted = 0;
  let reclaimed = 0;

  let nextKeyMarker: string | undefined;
  do {
    const response = await s3Client.send(new ListObjectVersionsCommand({
      Bucket: bucketName,
      KeyMarker: nextKeyMarker,
    }));

    const toDelete = response.Versions?.filter(v => {
      if (!v.Key) {
        return false;
      }

      const hash = path.basename(v.Key, path.extname(v.Key));
      let pred = !assetHashes.includes(hash);

      if (process.env.RETAIN_MILLISECONDS) {
        if (!v.LastModified) {
          return false;
        }

        const limitDate = new Date(Date.now() - parseInt(process.env.RETAIN_MILLISECONDS));
        pred = pred && v.LastModified < limitDate;
      }

      return pred;
    });

    if (toDelete && toDelete.length !== 0) {
      if (process.env.RUN) {
        await s3Client.send(new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: toDelete.map(v => ({ Key: v.Key!, VersionId: v.VersionId })),
          },
        }));
      }
      deleted += toDelete.length;
      reclaimed += toDelete.reduce((acc, x) => acc + (x.Size ?? 0), 0);
    }

    nextKeyMarker = response.NextKeyMarker;
  } while (nextKeyMarker);

  return { Deleted: deleted, Reclaimed: reclaimed };
}

async function cleanImages(assetHashes: string[]): Promise<CleanResult> {
  const repositoryName = getEnv('REPOSITORY_NAME');

  let deleted = 0;
  let reclaimed = 0;

  let nextToken: string | undefined;
  do {
    const response = await ecrClient.send(new DescribeImagesCommand({
      repositoryName,
      nextToken,
    }));

    const toDelete = response.imageDetails?.filter(x => {
      if (!x.imageTags) {
        return false;
      }

      let pred = !assetHashes.includes(x.imageTags[0]);

      if (process.env.RETAIN_MILLISECONDS) {
        if (!x.imagePushedAt) {
          return false;
        }

        const limitDate = new Date(Date.now() - parseInt(process.env.RETAIN_MILLISECONDS));
        pred = pred && x.imagePushedAt && x.imagePushedAt < limitDate;
      }

      return pred;
    });

    if (toDelete && toDelete.length !== 0) {
      if (process.env.RUN) {
        await ecrClient.send(new BatchDeleteImageCommand({
          repositoryName,
          imageIds: toDelete.map(x => ({ imageTag: x.imageTags![0] })),
        }));
      }
      deleted += toDelete.length;
      reclaimed += toDelete.reduce((acc, x) => acc + (x.imageSizeInBytes ?? 0), 0);
    }

    nextToken = response.nextToken;
  } while (nextToken);

  return { Deleted: deleted, Reclaimed: reclaimed };
}
