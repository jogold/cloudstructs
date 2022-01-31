import * as path from 'path';
import { S3 } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const s3 = new S3();

export async function handler(assetHashes: string[]) {
  if (!process.env.BUCKET_NAME) {
    throw new Error('Missing BUCKET_NAME');
  }

  let nextToken: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      ContinuationToken: nextToken,
    }).promise();

    const unused = response.Contents?.filter(x => x.Key && !assetHashes.includes(path.basename(x.Key)));

    if (unused) {
      await s3.deleteObjects({
        Bucket: process.env.BUCKET_NAME,
        Delete: {
          Objects: unused.map(x => ({ Key: x.Key! })),
          Quiet: true,
        },
      }).promise();
    }

    nextToken = response.NextContinuationToken;
    if (nextToken === undefined) {
      finished = true;
    }
  }
}
