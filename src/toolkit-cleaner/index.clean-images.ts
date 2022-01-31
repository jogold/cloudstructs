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

    const unused = response.imageDetails?.filter(x => x.imageTags && !assetHashes.includes(x.imageTags[0]));

    if (unused) {
      await ecr.batchDeleteImage({
        repositoryName: process.env.REPOSITORY_NAME,
        imageIds: unused.map(x => ({ imageTag: x.imageTags![0] })),
      }).promise();
      deleted += unused.length;
      reclaimed += unused.reduce((acc, x) => acc + (x.imageSizeInBytes ?? 0), 0);
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
