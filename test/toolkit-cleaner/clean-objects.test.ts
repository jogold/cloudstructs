const ServiceMock = {
  listObjectVersions: jest.fn(),
  deleteObjects: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({}),
  })),
};

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ServiceMock),
  };
});

import { handler } from '../../src/toolkit-cleaner/clean-objects.lambda';

beforeEach(() => {
  ServiceMock.listObjectVersions.mockImplementationOnce(() => ({
    promise: jest.fn().mockResolvedValue({
      Contents: [
        {
          Key: 'hash1.json',
          LastModified: daysAgo(5),
          Size: 12,
          VersionId: 'hash1-versionid',
        },
        {
          Key: 'hash2.zip',
          LastModified: new Date(),
          Size: 15,
          VersionId: 'hash2-versionid',
        },
      ],
      NextKeyMarker: 'marker',
    }),
  })).mockImplementationOnce(() => ({
    promise: jest.fn().mockResolvedValue({
      Contents: [
        {
          Key: 'hash3.zip',
          LastModified: daysAgo(30),
          Size: 9,
          VersionId: 'hash3-versionid',
        },
        {
          Key: 'hash4.zip',
          LastModified: new Date(),
          Size: 11,
          VersionId: 'hash4-versionid',
        },
      ],
    }),
  }));

  process.env.BUCKET_NAME = 'bucket';
  process.env.RUN = 'true';
});

test('cleans unused objects', async () => {
  const response = await handler(['hash2', 'hash4']);

  expect(ServiceMock.listObjectVersions).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'bucket',
  }));

  expect(ServiceMock.deleteObjects).toHaveBeenCalledTimes(2);
  expect(ServiceMock.deleteObjects).toHaveBeenCalledWith({
    Bucket: 'bucket',
    Delete: {
      Objects: [{ Key: 'hash1.json', VersionId: 'hash1-versionid' }],
    },
  });
  expect(ServiceMock.deleteObjects).toHaveBeenCalledWith({
    Bucket: 'bucket',
    Delete: {
      Objects: [{ Key: 'hash3.zip', VersionId: 'hash3-versionid' }],
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

  expect(ServiceMock.deleteObjects).not.toHaveBeenCalled();

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});

test('with RETAIN_MILLISECONDS', async () => {
  // 10 days
  process.env.RETAIN_MILLISECONDS = (10 * 24 * 3600 * 1000).toString();

  const response = await handler(['hash2', 'hash4']);

  expect(ServiceMock.deleteObjects).toHaveBeenCalledTimes(1);
  expect(ServiceMock.deleteObjects).toHaveBeenCalledWith({
    Bucket: 'bucket',
    Delete: {
      Objects: [{ Key: 'hash3.zip' }],
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
