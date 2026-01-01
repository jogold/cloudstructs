// Environment variables must be set before any imports that use getEnv
process.env.BUCKET_NAME = 'test-bucket';
process.env.REPOSITORY_NAME = 'test-repo';
process.env.DOCKER_IMAGE_ASSET_HASH = '5a7abf30ce10141adcb73c9b836ec68479c65fb4d1693df160563e36ece0d55e';
process.env.RUN = 'true';

import 'aws-sdk-client-mock-jest';
import { LocalDurableTestRunner } from '@aws/durable-execution-sdk-js-testing';
import { CloudFormationClient, DescribeStacksCommand, GetTemplateCommand } from '@aws-sdk/client-cloudformation';
import { BatchDeleteImageCommand, DescribeImagesCommand, ECRClient } from '@aws-sdk/client-ecr';
import { DeleteObjectsCommand, ListObjectVersionsCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/toolkit-cleaner/clean.lambda';

const cloudFormationClientMock = mockClient(CloudFormationClient);
const s3ClientMock = mockClient(S3Client);
const ecrClientMock = mockClient(ECRClient);

function daysAgo(days: number): Date {
  const ret = new Date();
  ret.setDate(ret.getDate() - days);
  return ret;
}

describe('ToolkitCleaner Lambda', () => {
  let runner: LocalDurableTestRunner;

  beforeAll(async () => {
    await LocalDurableTestRunner.setupTestEnvironment({ skipTime: true });
  });

  afterAll(async () => {
    await LocalDurableTestRunner.teardownTestEnvironment();
  });

  beforeEach(() => {
    cloudFormationClientMock.reset();
    s3ClientMock.reset();
    ecrClientMock.reset();
    process.env.RUN = 'true';
    delete process.env.RETAIN_MILLISECONDS;
    runner = new LocalDurableTestRunner({ handlerFunction: handler });
  });

  test('cleans unused assets from S3 and ECR', async () => {
    // Mock CloudFormation - 2 stacks
    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [
        { StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' },
        { StackName: 'stack2', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' },
      ],
    });

    // Mock templates - stack1 has hash1, stack2 has hash2
    cloudFormationClientMock.on(GetTemplateCommand, { StackName: 'stack1' }).resolves({
      TemplateBody: 'contains 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    });
    cloudFormationClientMock.on(GetTemplateCommand, { StackName: 'stack2' }).resolves({
      TemplateBody: 'contains 486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
    });

    // Mock S3 - hash1 is used, hash3 is unused
    s3ClientMock.on(ListObjectVersionsCommand).resolves({
      Versions: [
        {
          Key: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824.zip',
          LastModified: daysAgo(5),
          Size: 100,
          VersionId: 'v1',
        },
        {
          Key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.zip',
          LastModified: daysAgo(5),
          Size: 200,
          VersionId: 'v3',
        },
      ],
    });
    s3ClientMock.on(DeleteObjectsCommand).resolves({});

    // Mock ECR - hash2 is used, hash4 is unused
    ecrClientMock.on(DescribeImagesCommand).resolves({
      imageDetails: [
        {
          imageTags: ['486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7'],
          imagePushedAt: daysAgo(5),
          imageSizeInBytes: 1000,
        },
        {
          imageTags: ['bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'],
          imagePushedAt: daysAgo(5),
          imageSizeInBytes: 2000,
        },
      ],
    });
    ecrClientMock.on(BatchDeleteImageCommand).resolves({});

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');

    // Should delete unused S3 object
    expect(s3ClientMock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
      Bucket: 'test-bucket',
      Delete: {
        Objects: [{ Key: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.zip', VersionId: 'v3' }],
      },
    });

    // Should delete unused ECR image
    expect(ecrClientMock).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
      repositoryName: 'test-repo',
      imageIds: [{ imageTag: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' }],
    });
  });

  test('does not delete when dryRun is enabled (RUN not set)', async () => {
    delete process.env.RUN;

    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
    });
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: '',
    });
    s3ClientMock.on(ListObjectVersionsCommand).resolves({
      Versions: [
        {
          Key: 'unused.zip',
          LastModified: daysAgo(5),
          Size: 100,
          VersionId: 'v1',
        },
      ],
    });
    ecrClientMock.on(DescribeImagesCommand).resolves({
      imageDetails: [
        {
          imageTags: ['unused'],
          imagePushedAt: daysAgo(5),
          imageSizeInBytes: 1000,
        },
      ],
    });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectsCommand);
    expect(ecrClientMock).not.toHaveReceivedCommand(BatchDeleteImageCommand);
  });

  test('respects RETAIN_MILLISECONDS for recently created assets', async () => {
    // 10 days retention
    process.env.RETAIN_MILLISECONDS = (10 * 24 * 3600 * 1000).toString();

    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
    });
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: '',
    });

    // Recent object should be retained, old one should be deleted
    s3ClientMock.on(ListObjectVersionsCommand).resolves({
      Versions: [
        {
          Key: 'recent.zip',
          LastModified: daysAgo(5), // Within retention period
          Size: 100,
          VersionId: 'v1',
        },
        {
          Key: 'old.zip',
          LastModified: daysAgo(30), // Outside retention period
          Size: 200,
          VersionId: 'v2',
        },
      ],
    });
    s3ClientMock.on(DeleteObjectsCommand).resolves({});

    // Same for ECR
    ecrClientMock.on(DescribeImagesCommand).resolves({
      imageDetails: [
        {
          imageTags: ['recent'],
          imagePushedAt: daysAgo(5),
          imageSizeInBytes: 1000,
        },
        {
          imageTags: ['old'],
          imagePushedAt: daysAgo(30),
          imageSizeInBytes: 2000,
        },
      ],
    });
    ecrClientMock.on(BatchDeleteImageCommand).resolves({});

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');

    // Only old objects should be deleted
    expect(s3ClientMock).toHaveReceivedCommandWith(DeleteObjectsCommand, {
      Delete: {
        Objects: [{ Key: 'old.zip', VersionId: 'v2' }],
      },
    });
    expect(ecrClientMock).toHaveReceivedCommandWith(BatchDeleteImageCommand, {
      imageIds: [{ imageTag: 'old' }],
    });
  });

  test('handles pagination for stacks', async () => {
    cloudFormationClientMock.on(DescribeStacksCommand)
      .resolvesOnce({
        Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
        NextToken: 'token',
      })
      .resolvesOnce({
        Stacks: [{ StackName: 'stack2', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
      });

    cloudFormationClientMock.on(GetTemplateCommand, { StackName: 'stack1' }).resolves({
      TemplateBody: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    });
    cloudFormationClientMock.on(GetTemplateCommand, { StackName: 'stack2' }).resolves({
      TemplateBody: '486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
    });

    s3ClientMock.on(ListObjectVersionsCommand).resolves({ Versions: [] });
    ecrClientMock.on(DescribeImagesCommand).resolves({ imageDetails: [] });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    expect(cloudFormationClientMock).toHaveReceivedCommandTimes(DescribeStacksCommand, 2);
    expect(cloudFormationClientMock).toHaveReceivedCommandTimes(GetTemplateCommand, 2);
  });

  test('handles pagination for S3 objects', async () => {
    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
    });
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: '',
    });

    s3ClientMock.on(ListObjectVersionsCommand)
      .resolvesOnce({
        Versions: [{ Key: 'obj1.zip', LastModified: daysAgo(5), Size: 100, VersionId: 'v1' }],
        NextKeyMarker: 'marker',
      })
      .resolvesOnce({
        Versions: [{ Key: 'obj2.zip', LastModified: daysAgo(5), Size: 200, VersionId: 'v2' }],
      });
    s3ClientMock.on(DeleteObjectsCommand).resolves({});

    ecrClientMock.on(DescribeImagesCommand).resolves({ imageDetails: [] });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    expect(s3ClientMock).toHaveReceivedCommandTimes(ListObjectVersionsCommand, 2);
  });

  test('handles pagination for ECR images', async () => {
    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
    });
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: '',
    });

    s3ClientMock.on(ListObjectVersionsCommand).resolves({ Versions: [] });

    ecrClientMock.on(DescribeImagesCommand)
      .resolvesOnce({
        imageDetails: [{ imageTags: ['img1'], imagePushedAt: daysAgo(5), imageSizeInBytes: 1000 }],
        nextToken: 'token',
      })
      .resolvesOnce({
        imageDetails: [{ imageTags: ['img2'], imagePushedAt: daysAgo(5), imageSizeInBytes: 2000 }],
      });
    ecrClientMock.on(BatchDeleteImageCommand).resolves({});

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    expect(ecrClientMock).toHaveReceivedCommandTimes(DescribeImagesCommand, 2);
  });

  test('extracts hashes with docker tag prefix', async () => {
    process.env.DOCKER_IMAGE_ASSET_HASH = 'prefix5a7abf30ce10141adcb73c9b836ec68479c65fb4d1693df160563e36ece0d55e';

    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
    });
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: 'prefix2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824 486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
    });

    // Asset with prefix should be recognized as used
    s3ClientMock.on(ListObjectVersionsCommand).resolves({
      Versions: [
        {
          Key: 'prefix2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824.zip',
          LastModified: daysAgo(5),
          Size: 100,
          VersionId: 'v1',
        },
      ],
    });

    ecrClientMock.on(DescribeImagesCommand).resolves({ imageDetails: [] });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    // The asset with prefix should NOT be deleted since it's in use
    expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectsCommand);

    // Reset env var
    process.env.DOCKER_IMAGE_ASSET_HASH = '5a7abf30ce10141adcb73c9b836ec68479c65fb4d1693df160563e36ece0d55e';
  });

  test('deduplicates hashes across stacks', async () => {
    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [
        { StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' },
        { StackName: 'stack2', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' },
      ],
    });

    // Both stacks contain the same hash
    const sameHash = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: sameHash,
    });

    s3ClientMock.on(ListObjectVersionsCommand).resolves({
      Versions: [
        {
          Key: `${sameHash}.zip`,
          LastModified: daysAgo(5),
          Size: 100,
          VersionId: 'v1',
        },
      ],
    });

    ecrClientMock.on(DescribeImagesCommand).resolves({ imageDetails: [] });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
    // The asset should NOT be deleted since it's in use
    expect(s3ClientMock).not.toHaveReceivedCommand(DeleteObjectsCommand);
  });

  test('handles empty template body', async () => {
    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [{ StackName: 'stack1', CreationTime: new Date(), StackStatus: 'CREATE_COMPLETE' }],
    });
    cloudFormationClientMock.on(GetTemplateCommand).resolves({
      TemplateBody: undefined,
    });

    s3ClientMock.on(ListObjectVersionsCommand).resolves({ Versions: [] });
    ecrClientMock.on(DescribeImagesCommand).resolves({ imageDetails: [] });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
  });

  test('handles no stacks', async () => {
    cloudFormationClientMock.on(DescribeStacksCommand).resolves({
      Stacks: [],
    });

    s3ClientMock.on(ListObjectVersionsCommand).resolves({ Versions: [] });
    ecrClientMock.on(DescribeImagesCommand).resolves({ imageDetails: [] });

    const execution = await runner.run({ payload: {} });

    expect(execution.getStatus()).toBe('SUCCEEDED');
  });
});
