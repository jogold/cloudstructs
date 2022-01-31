// import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Duration } from 'aws-cdk-lib';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { SfnStateMachine } from 'aws-cdk-lib/aws-events-targets';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

/**
 * Properties for a ToolkitCleaner
 */
interface ToolkitCleanerProps {
  /**
   * The schedule for the cleaner
   *
   * @default - every day
   */
  readonly schedule?: Schedule;
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

    const getStackNamesHandler = new NodejsFunction(this, 'get-stack-names');
    getStackNamesHandler.addToRolePolicy(new PolicyStatement({
      actions: ['cloudformation:DescribeStacks'],
      resources: ['*'],
    }));
    const getStackNames = new tasks.LambdaInvoke(this, 'GetStackNames', {
      lambdaFunction: getStackNamesHandler,
      payloadResponseOnly: true,
    });

    const stacksMap = new sfn.Map(this, 'StacksMap', {
      maxConcurrency: 1,
      resultSelector: {
        AssetHashes: sfn.JsonPath.stringAt('$'),
      },
    });
    const getTemplate = new tasks.CallAwsService(this, 'GetTemplate', {
      service: 'cloudformation',
      action: 'getTemplate',
      parameters: {
        StackName: sfn.JsonPath.stringAt('$'),
      },
      iamResources: ['*'],
    }).addRetry({
      errors: ['CloudFormation.CloudFormationException'],
    });
    const extractHashes = new tasks.EvaluateExpression(this, 'ExtractHashes', {
      expression: '[...new Set(($.TemplateBody).match(/[a-z0-9]{64}/g))]',
    });
    const flattenHashes = new tasks.EvaluateExpression(this, 'FlattenHashes', {
      expression: '[...new Set(($.AssetHashes).flat())]',
    });

    const cleanObjectsHandler = new NodejsFunction(this, 'clean-objects', {
      timeout: Duration.minutes(5),
    });
    cleanObjectsHandler.addEnvironment('BUCKET_NAME', fileAsset.bucket.bucketName);
    fileAsset.bucket.grantRead(cleanObjectsHandler);
    const cleanObjects = new tasks.LambdaInvoke(this, 'CleanObjects', {
      lambdaFunction: cleanObjectsHandler,
    });

    const cleanImagesHandler = new NodejsFunction(this, 'clean-images', {
      timeout: Duration.minutes(5),
    });
    cleanImagesHandler.addEnvironment('REPOSITORY_NAME', dockerImageAsset.repository.repositoryName);
    dockerImageAsset.repository.grant(cleanImagesHandler, 'ecr:ListImages');
    const cleanImages = new tasks.LambdaInvoke(this, 'CleanImages', {
      lambdaFunction: cleanImagesHandler,
    });

    const stateMachine = new sfn.StateMachine(this, 'Resource', {
      definition: getStackNames
        .next(stacksMap.iterator(getTemplate.next(extractHashes)))
        .next(flattenHashes)
        .next(new sfn.Parallel(this, 'Clean')
          .branch(cleanObjects)
          .branch(cleanImages)),
    });

    const rule = new Rule(this, 'Rule', {
      schedule: props.schedule ?? Schedule.rate(Duration.days(1)),
    });
    rule.addTarget(new SfnStateMachine(stateMachine));
  }
}
