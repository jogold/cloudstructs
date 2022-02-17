const ServiceMock = {
  listObjectsV2: jest.fn().mockImplementationOnce(() => ({
    promise: jest.fn().mockResolvedValue({
      Contents: [
        {
          Key: 'hash1.json',
          LastModified: new Date('2022-01-01'),
          Size: 12,
        },
        {
          Key: 'hash2.zip',
          LastModified: new Date('2022-01-02'),
          Size: 15,
        },
      ],
      NextContinuationToken: 'token',
    }),
  })).mockImplementationOnce(() => ({
    promise: jest.fn().mockResolvedValue({
      Contents: [
        {
          Key: 'hash3.zip',
          LastModified: new Date('2022-01-03'),
          Size: 9,
        },
      ],
    }),
  })),
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

process.env.BUCKET_NAME = 'bucket';
process.env.RUN = 'true';

test('cleans objects', async () => {

  const response = await handler(['hash2']);

  expect(ServiceMock.listObjectsV2).toHaveBeenCalledWith(expect.objectContaining({
    Bucket: 'bucket',
  }));

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});
