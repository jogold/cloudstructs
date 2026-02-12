import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Schedule, ScheduleExpression } from 'aws-cdk-lib/aws-scheduler';
import { LambdaInvoke } from 'aws-cdk-lib/aws-scheduler-targets';
import { Construct } from 'constructs';
import { CleanFunction } from './clean-function';

/**
 * Properties for a ToolkitCleaner
 */
export interface ToolkitCleanerProps {
  /**
   * The schedule for the cleaner.
   *
   * @default - every day
   */
  readonly scheduleExpression?: ScheduleExpression;

  /**
   * Whether to clean on schedule. If you'd like to run the cleanup manually
   * via the console, set to `false`.
   *
   * @default true
   */
  readonly scheduleEnabled?: boolean;

  /**
   * Only output number of assets and total size that would be deleted
   * but without actually deleting assets.
   */
  readonly dryRun?: boolean;

  /**
   * Retain unused assets that were created recently
   *
   * @default - all unused assets are removed
   */
  readonly retainAssetsNewerThan?: Duration;

  /**
   * The timeout for the clean function
   *
   * @default Duration.minutes(30)
   */
  readonly cleanAssetsTimeout?: Duration;
}

/**
 * Clean unused S3 and ECR assets from your CDK Toolkit.
 */
export class ToolkitCleaner extends Construct {
  constructor(scope: Construct, id: string, props: ToolkitCleanerProps = {}) {
    super(scope, id);

    // Dummy assets to reference S3 bucket and ECR repository
    const fileAsset = new Asset(this, 'FileAsset', {
      path: path.join(__dirname, '..', '..', 'assets', 'toolkit-cleaner', 'docker', 'dummy.txt'),
    });
    const dockerImageAsset = new DockerImageAsset(this, 'DockerImageAsset', {
      directory: path.join(__dirname, '..', '..', 'assets', 'toolkit-cleaner', 'docker'),
    });

    const cleanFunction = new CleanFunction(this, 'CleanFunction', {
      timeout: Duration.seconds(30),
      durableConfig: {
        executionTimeout: props.cleanAssetsTimeout ?? Duration.minutes(30),
      },
      environment: {
        BUCKET_NAME: fileAsset.bucket.bucketName,
        REPOSITORY_NAME: dockerImageAsset.repository.repositoryName,
        DOCKER_IMAGE_ASSET_HASH: dockerImageAsset.assetHash,
        ...(props.dryRun ? {} : { RUN: 'true' }),
        ...(props.retainAssetsNewerThan
          ? { RETAIN_MILLISECONDS: props.retainAssetsNewerThan.toMilliseconds().toString() }
          : {}),
      },
    });

    cleanFunction.addToRolePolicy(new PolicyStatement({
      actions: ['cloudformation:DescribeStacks', 'cloudformation:ListStacks', 'cloudformation:GetTemplate'],
      resources: ['*'],
    }));
    fileAsset.bucket.grantRead(cleanFunction);
    fileAsset.bucket.grantDelete(cleanFunction);
    dockerImageAsset.repository.grant(cleanFunction, 'ecr:DescribeImages', 'ecr:BatchDeleteImage');

    new Schedule(this, 'Schedule', {
      enabled: props.scheduleEnabled ?? true,
      schedule: props.scheduleExpression ?? ScheduleExpression.rate(Duration.days(1)),
      target: new LambdaInvoke(cleanFunction.latestVersion, {}),
    });
  }
}
