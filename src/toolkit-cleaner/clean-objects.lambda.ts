import * as path from 'path';
import { S3 } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const s3 = new S3();

export async function handler(assetHashes: string[]) {
  if (!process.env.BUCKET_NAME) {
    throw new Error('Missing BUCKET_NAME');
  }

  let deleted = 0;
  let reclaimed = 0;

  let nextKeyMarker: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await s3.listObjectVersions({
      Bucket: process.env.BUCKET_NAME,
      KeyMarker: nextKeyMarker,
    }).promise();

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
        await s3.deleteObjects({
          Bucket: process.env.BUCKET_NAME,
          Delete: {
            Objects: toDelete.map(v => ({ Key: v.Key!, VersionId: v.VersionId })),
          },
        }).promise();
      }
      deleted += toDelete.length;
      reclaimed += toDelete.reduce((acc, x) => acc + (x.Size ?? 0), 0);
    }

    nextKeyMarker = response.NextKeyMarker;
    if (nextKeyMarker === undefined) {
      finished = true;
    }
  }

  return {
    Deleted: deleted,
    Reclaimed: reclaimed,
  };
}
