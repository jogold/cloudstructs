import * as path from 'path';
import { S3 } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const s3 = new S3();

export async function handler(assetHashes: string[]) {
  if (!process.env.BUCKET_NAME) {
    throw new Error('Missing BUCKET_NAME');
  }

  let deleted = 0;
  let reclaimed = 0;

  let nextToken: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      ContinuationToken: nextToken,
    }).promise();

    const toDelete = response.Contents?.filter(x => {
      let pred = x.Key && !assetHashes.includes(path.basename(x.Key));
      if (process.env.RETAIN_MILLISECONDS) {
        const limitDate = new Date(Date.now() - parseInt(process.env.RETAIN_MILLISECONDS));
        pred = pred && x.LastModified && x.LastModified < limitDate;
      }
      return pred;
    });

    if (toDelete) {
      if (process.env.RUN) {
        await s3.deleteObjects({
          Bucket: process.env.BUCKET_NAME,
          Delete: {
            Objects: toDelete.map(x => ({ Key: x.Key! })),
          },
        }).promise();
      }
      deleted += toDelete.length;
      reclaimed += toDelete.reduce((acc, x) => acc + (x.Size ?? 0), 0);
    }

    nextToken = response.NextContinuationToken;
    if (nextToken === undefined) {
      finished = true;
    }
  }

  return {
    Deleted: deleted,
    Reclaimed: reclaimed,
  };
}
