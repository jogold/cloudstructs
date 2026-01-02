import * as path from 'path';
import { DurableContext, withDurableExecution } from '@aws/durable-execution-sdk-js';
import { CloudFormationClient, DescribeStacksCommand, GetTemplateCommand } from '@aws-sdk/client-cloudformation';
import { BatchDeleteImageCommand, DescribeImagesCommand, DescribeImagesCommandOutput, ECRClient, ImageDetail } from '@aws-sdk/client-ecr';
import { DeleteObjectsCommand, ListObjectVersionsCommand, ListObjectVersionsCommandOutput, ObjectVersion, S3Client } from '@aws-sdk/client-s3';
import { getEnv } from '../utils';

const cloudFormationClient = new CloudFormationClient({});
const s3Client = new S3Client({});
const ecrClient = new ECRClient({});

interface CleanResult {
  Deleted: number;
  Reclaimed: number;
}

export const handler = withDurableExecution(async (_, context: DurableContext): Promise<CleanResult> => {
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
  const cleanResults = await context.parallel<CleanResult>(
    'clean-assets',
    [
      async (branchContext) => branchContext.runInChildContext('clean-objects', (childContext) => cleanObjects(childContext, assetHashes)),
      async (branchContext) => branchContext.runInChildContext('clean-images', (childContext) => cleanImages(childContext, assetHashes)),
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

async function cleanObjects(context: DurableContext, assetHashes: string[]): Promise<CleanResult> {
  const strategy: AssetStrategy<ObjectVersion, ListObjectVersionsCommandOutput> = {
    list: async (token?: string) => s3Client.send(new ListObjectVersionsCommand({
      Bucket: getEnv('BUCKET_NAME'),
      KeyMarker: token,
    })),
    getItems: (result) => result.Versions,
    getNextToken: (result) => result.NextKeyMarker,
    extractHash: (item) => item.Key ? path.basename(item.Key, path.extname(item.Key)) : undefined,
    getDate: (item) => item.LastModified,
    getSize: (item) => item.Size ?? 0,
    delete: async (items) => {
      await s3Client.send(new DeleteObjectsCommand({
        Bucket: getEnv('BUCKET_NAME'),
        Delete: {
          Objects: items.map(v => ({ Key: v.Key!, VersionId: v.VersionId })),
        },
      }));
    },
  };
  return cleanAssets({
    stepNamePrefix: 'list-and-delete-objects',
    strategy,
    context,
    assetHashes,
  });
}

async function cleanImages(context: DurableContext, assetHashes: string[]): Promise<CleanResult> {
  const strategy: AssetStrategy<ImageDetail, DescribeImagesCommandOutput> = {
    list: async (token?: string) => ecrClient.send(new DescribeImagesCommand({
      repositoryName: getEnv('REPOSITORY_NAME'),
      nextToken: token,
    })),
    getItems: (result) => result.imageDetails,
    getNextToken: (result) => result.nextToken,
    extractHash: (item) => item.imageTags?.[0],
    getDate: (item) => item.imagePushedAt,
    getSize: (item) => item.imageSizeInBytes ?? 0,
    delete: async (items) => {
      await ecrClient.send(new BatchDeleteImageCommand({
        repositoryName: getEnv('REPOSITORY_NAME'),
        imageIds: items.map(x => ({ imageTag: x.imageTags![0] })),
      }));
    },
  };
  return cleanAssets({
    stepNamePrefix: 'list-and-delete-images',
    strategy,
    context,
    assetHashes,
  });
}

interface CleanAssetsOptions<TItem, TListResult> {
  stepNamePrefix: string;
  strategy: AssetStrategy<TItem, TListResult>;
  context: DurableContext;
  assetHashes: string[];
}

async function cleanAssets<TItem, TListResult>(options: CleanAssetsOptions<TItem, TListResult>): Promise<CleanResult> {
  const { context, assetHashes, strategy, stepNamePrefix } = options;
  let deleted = 0;
  let reclaimed = 0;

  let pageIndex = 0;
  let paginationToken: string | undefined;
  do {
    const response = await context.step(`${stepNamePrefix}-${pageIndex}`, (stepContext) => listAndDeleteAssets({
      strategy,
      assetHashes,
      logger: stepContext.logger,
      paginationToken,
    }));
    deleted += response.Deleted;
    reclaimed += response.Reclaimed;
    paginationToken = response.nextToken;
    pageIndex++;
  } while (paginationToken);

  return { Deleted: deleted, Reclaimed: reclaimed };
}

interface ListAndDeleteAssetsOptions<TItem, TListResult> {
  strategy: AssetStrategy<TItem, TListResult>;
  assetHashes: string[];
  logger: Logger;
  paginationToken?: string;
}

interface AssetStrategy<TItem, TListResult> {
  list(paginationToken?: string): Promise<TListResult>;
  getItems(result: TListResult): TItem[] | undefined;
  getNextToken(result: TListResult): string | undefined;
  extractHash(item: TItem): string | undefined;
  getDate(item: TItem): Date | undefined;
  getSize(item: TItem): number;
  delete(items: TItem[]): Promise<void>;
}

interface Logger {
  info(message: string, data?: object): void;
}

interface ListAndDeleteAssetsResult extends CleanResult {
  nextToken?: string;
}

async function listAndDeleteAssets<TItem, TListResult>(options: ListAndDeleteAssetsOptions<TItem, TListResult>): Promise<ListAndDeleteAssetsResult> {
  const { strategy, assetHashes, logger, paginationToken } = options;
  const response = await strategy.list(paginationToken);
  const items = strategy.getItems(response) ?? [];

  const toDelete = items.filter(item => {
    const hash = strategy.extractHash(item);
    if (!hash) {
      return false;
    }

    let pred = !assetHashes.includes(hash);

    if (process.env.RETAIN_MILLISECONDS) {
      const date = strategy.getDate(item);
      if (!date) {
        return false;
      }

      const limitDate = new Date(Date.now() - parseInt(process.env.RETAIN_MILLISECONDS));
      pred = pred && date < limitDate;
    }

    return pred;
  });

  if (toDelete.length === 0) {
    return { Deleted: 0, Reclaimed: 0, nextToken: strategy.getNextToken(response) };
  }

  if (!process.env.RUN) {
    logger.info('Dry run mode, skipping delete', { count: toDelete.length });
    return { Deleted: 0, Reclaimed: 0, nextToken: strategy.getNextToken(response) };
  }

  await strategy.delete(toDelete);
  return {
    Deleted: toDelete.length,
    Reclaimed: toDelete.reduce((acc, item) => acc + strategy.getSize(item), 0),
    nextToken: strategy.getNextToken(response),
  };
}
