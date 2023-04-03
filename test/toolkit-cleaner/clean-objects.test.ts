import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/toolkit-cleaner/clean-objects.lambda';
import { DeleteObjectsCommand, ListObjectVersionsCommand, S3Client } from '@aws-sdk/client-s3';

const s3ClientMock = mockClient(S3Client);

beforeEach(() => {
  s3ClientMock.reset();
  s3ClientMock.on(ListObjectVersionsCommand)
    .resolvesOnce({
      Versions: [
        {
          Key: 'hash1.json',
          LastModified: daysAgo(5),
          Size: 12,
          VersionId: 'hash1-version-id',
        },
        {
          Key: 'hash2.zip',
          LastModified: new Date(),
          Size: 15,
          VersionId: 'hash2-version-id',
        },
      ],
      NextKeyMarker: 'marker',
    })
    .resolvesOnce({
      Versions: [
        {
          Key: 'hash3.zip',
          LastModified: daysAgo(30),
          Size: 9,
          VersionId: 'hash3-version-id',
        },
        {
          Key: 'hash4.zip',
          LastModified: new Date(),
          Size: 11,
          VersionId: 'hash4-version-id',
        },
      ],
    })

  process.env.BUCKET_NAME = 'bucket';
  process.env.RUN = 'true';
});

test('cleans unused objects', async () => {
  const response = await handler(['hash2', 'hash4']);

  expect(s3ClientMock).toHaveReceivedCommandWith(ListObjectVersionsCommand, {
    Bucket: 'bucket',
  });

  expect(s3ClientMock).toHaveReceivedCommandTimes(DeleteObjectsCommand, 2);
  expect(s3ClientMock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
    Bucket: 'bucket',
    Delete: {
      Objects: [{ Key: 'hash1.json', VersionId: 'hash1-version-id' }],
    },
  });
  expect(s3ClientMock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
    Bucket: 'bucket',
    Delete: {
      Objects: [{ Key: 'hash3.zip', VersionId: 'hash3-version-id' }],
    },
  });

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});

test('without RUN', async () => {
  delete process.env.RUN;

  const response = await handler(['hash2', 'hash4']);

  expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectsCommand);

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});

test('with RETAIN_MILLISECONDS', async () => {
  // 10 days
  process.env.RETAIN_MILLISECONDS = (10 * 24 * 3600 * 1000).toString();

  const response = await handler(['hash2', 'hash4']);

  expect(s3ClientMock).toHaveReceivedCommandTimes(DeleteObjectsCommand, 1);
  expect(s3ClientMock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
    Bucket: 'bucket',
    Delete: {
      Objects: [{ Key: 'hash3.zip', VersionId: 'hash3-version-id' }],
    },
  });

  expect(response).toEqual({
    Deleted: 1,
    Reclaimed: 9,
  });

  delete process.env.RETAIN_MILLISECONDS;
});

function daysAgo(days: number): Date {
  const ret = new Date();
  ret.setDate(ret.getDate() - days);
  return ret;
}
