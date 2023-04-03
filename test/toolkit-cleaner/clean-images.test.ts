import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/toolkit-cleaner/clean-images.lambda';
import { BatchDeleteImageCommand, DescribeImagesCommand, ECRClient } from '@aws-sdk/client-ecr';

const ecrClientMock = mockClient(ECRClient);

beforeEach(() => {
  ecrClientMock.reset();
  ecrClientMock.on(DescribeImagesCommand).resolves({
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
  }).resolves({
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
  })

  process.env.REPOSITORY_NAME = 'repository';
  process.env.RUN = 'true';
});

test('cleans unused images', async () => {
  const response = await handler(['hash2', 'hash4']);

  expect(ecrClientMock).toHaveReceivedCommandWith(DescribeImagesCommand, {
    repositoryName: 'repository',
  });

  expect(ecrClientMock).toHaveReceivedCommandTimes(BatchDeleteImageCommand, 2);
  expect(ecrClientMock).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
    repositoryName: 'repository',
    imageIds: [{ imageTag: 'hash1' }],
  })
  expect(ecrClientMock).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
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

  expect(ecrClientMock).not.toHaveReceivedCommand(BatchDeleteImageCommand);

  expect(response).toEqual({
    Deleted: 2,
    Reclaimed: 21,
  });
});

test('with RETAIN_MILLISECONDS', async () => {
  // 10 days
  process.env.RETAIN_MILLISECONDS = (10 * 24 * 3600 * 1000).toString();

  const response = await handler(['hash2', 'hash4']);

  expect(ecrClientMock).toHaveReceivedCommandTimes(BatchDeleteImageCommand, 1);
  expect(ecrClientMock).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
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
