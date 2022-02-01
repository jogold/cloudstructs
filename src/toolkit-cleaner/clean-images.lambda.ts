import { ECR } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const ecr = new ECR();

export async function handler(assetHashes: string[]) {
  if (!process.env.REPOSITORY_NAME) {
    throw new Error('Missing REPOSITORY_NAME');
  }

  let deleted = 0;
  let reclaimed = 0;

  let nextToken: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await ecr.describeImages({
      repositoryName: process.env.REPOSITORY_NAME,
      nextToken,
    }).promise();

    const toDelete = response.imageDetails?.filter(x => {
      let pred = x.imageTags && !assetHashes.includes(x.imageTags[0]);
      if (process.env.RETAIN_MILLISECONDS) {
        const limitDate = new Date(Date.now() - parseInt(process.env.RETAIN_MILLISECONDS));
        pred = pred && x.imagePushedAt && x.imagePushedAt < limitDate;
      }
      return pred;
    });

    if (toDelete && toDelete.length !== 0) {
      if (process.env.RUN) {
        await ecr.batchDeleteImage({
          repositoryName: process.env.REPOSITORY_NAME,
          imageIds: toDelete.map(x => ({ imageTag: x.imageTags![0] })),
        }).promise();
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
