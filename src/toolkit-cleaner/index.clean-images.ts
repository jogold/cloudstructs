import { ECR } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const ecr = new ECR();

export async function handler(assetHashes: string[]) {
  if (!process.env.REPOSITORY_NAME) {
    throw new Error('Missing REPOSITORY_NAME');
  }

  let nextToken: string | undefined;
  let finished = false;

  while (!finished) {
    const response = await ecr.listImages({
      repositoryName: process.env.REPOSITORY_NAME,
      nextToken,
    }).promise();

    const unused = response.imageIds?.filter(x => x.imageTag && !assetHashes.includes(x.imageTag));

    if (unused) {
      await ecr.batchDeleteImage({
        repositoryName: process.env.REPOSITORY_NAME,
        imageIds: unused.map(x => ({ imageTag: x.imageTag })),
      }).promise();
    }

    nextToken = response.nextToken;
    if (nextToken === undefined) {
      finished = true;
    }
  }
}
