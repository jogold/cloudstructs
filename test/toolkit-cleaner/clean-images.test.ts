const ServiceMock = {
  describeImages: jest.fn(),
  batchDeleteImage: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({}),
  })),
};

jest.mock('aws-sdk', () => {
  return {
    ECR: jest.fn(() => ServiceMock),
  };
});

import { handler } from '../../src/toolkit-cleaner/clean-images.lambda';

beforeEach(() => {
  ServiceMock.describeImages.mockImplementationOnce(() => ({
    promise: jest.fn().mockResolvedValue({
      imageDetails: [
        {
          imageTags: ['hash1'],
          imagePushedAt: daysAgo(5),
          imageSizeInBytes: 12,
        },
        {
          imageTags: ['hash2'],
          imagePushedAt: new Date(),
          imageSizeInBytes: 15,
        },
      ],
      nextToken: 'token',
    }),
  })).mockImplementationOnce(() => ({
    promise: jest.fn().mockResolvedValue({
      imageDetails: [
        {
          imageTags: ['hash3'],
          imagePushedAt: daysAgo(30),
          imageSizeInBytes: 9,
        },
        {
          imageTags: ['hash4'],
          imagePushedAt: new Date(),
          imageSizeInBytes: 11,
        },
      ],
    }),
  }));

  process.env.REPOSITORY_NAME = 'repository';
  process.env.RUN = 'true';
});

test('cleans unused images', async () => {
  const response = await handler(['hash2', 'hash4']);

  expect(ServiceMock.describeImages).toHaveBeenCalledWith(expect.objectContaining({
    repositoryName: 'repository',
  }));

  expect(ServiceMock.batchDeleteImage).toHaveBeenCalledTimes(2);
  expect(ServiceMock.batchDeleteImage).toHaveBeenCalledWith({
    repositoryName: 'repository',
    imageIds: [{ imageTag: 'hash1' }],
  });
  expect(ServiceMock.batchDeleteImage).toHaveBeenCalledWith({
    repositoryName: 'repository',
    imageIds: [{ imageTag: 'hash3' }],
  });

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});

test('without RUN', async () => {
  delete process.env.RUN;

  const response = await handler(['hash2', 'hash4']);

  expect(ServiceMock.batchDeleteImage).not.toHaveBeenCalled();

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});

test('with RETAIN_MILLISECONDS', async () => {
  // 10 days
  process.env.RETAIN_MILLISECONDS = (10 * 24 * 3600 * 1000).toString();

  const response = await handler(['hash2', 'hash4']);

  expect(ServiceMock.batchDeleteImage).toHaveBeenCalledTimes(1);
  expect(ServiceMock.batchDeleteImage).toHaveBeenCalledWith({
    repositoryName: 'repository',
    imageIds: [{ imageTag: 'hash3' }],
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
