import { BatchDeleteImageCommand, DescribeImagesCommand, ECRClient } from '@aws-sdk/client-ecr';

const ecrClient = new ECRClient({});

export async function handler(assetHashes: string[]) {
  if (!process.env.REPOSITORY_NAME) {
    throw new Error('Missing REPOSITORY_NAME');
  }

  let deleted = 0;
  let reclaimed = 0;

  let nextToken: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await ecrClient.send(new DescribeImagesCommand({
      repositoryName: process.env.REPOSITORY_NAME,
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
          repositoryName: process.env.REPOSITORY_NAME,
          imageIds: toDelete.map(x => ({ imageTag: x.imageTags![0] })),
        }));
      }
      deleted += toDelete.length;
      reclaimed += toDelete.reduce((acc, x) => acc + (x.imageSizeInBytes ?? 0), 0);
    }

    nextToken = response.nextToken;
    if (nextToken === undefined) {
      finished = true;
    }
  }

  return {
    Deleted: deleted,
    Reclaimed: reclaimed,
  };
}
