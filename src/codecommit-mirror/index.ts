import * as path from 'path';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';

/**
 * Properties for a CodeCommitMirror
 */
export interface CodeCommitMirrorProps {
  /**
   * The source repository
   */
  readonly repository: CodeCommitMirrorSourceRepository;

  /**
   * The ECS cluster where to run the mirror operation
   */
  readonly cluster: ecs.ICluster;

  /**
   * The schedule for the mirroring operation
   *
   * @default - everyday at midnight
   */
  readonly schedule?: events.Schedule;
}

/**
 * A git repository
 */
export abstract class CodeCommitMirrorSourceRepository {
  /**
   * Public GitHub repository
   */
  public static gitHub(owner: string, name: string): CodeCommitMirrorSourceRepository {
    return {
      name,
      plainTextUrl: `https://github.com/${owner}/${name}`,
    };
  }

  /**
   * Private repository
   */
  public static private(name: string, url: ecs.Secret): CodeCommitMirrorSourceRepository {
    return {
      name,
      secretUrl: url,
    };
  }

  /**
   * The name of the repository
   */
  public abstract readonly name: string;

  /** The HTTPS clone URL in plain text, used for a public repository */
  public abstract readonly plainTextUrl?: string;

  /**
   * The HTTPS clone URL if the repository is private.
   *
   * The secret should contain the username and/or token.
   */
  public abstract readonly secretUrl?: ecs.Secret;
}

/**
 * Mirror a repository to AWS CodeCommit on schedule
 */
export class CodeCommitMirror extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: CodeCommitMirrorProps) {
    super(scope, id);

    const destination = new codecommit.Repository(this, 'Repository', {
      repositoryName: props.repository.name,
      description: `Mirror of ${props.repository.name}`,
    });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDefinition');

    taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, 'docker')),
      logging: new ecs.AwsLogDriver({
        streamPrefix: props.repository.name,
        logRetention: logs.RetentionDays.TWO_MONTHS,
      }),
      environment: {
        DESTINATION: `codecommit::${cdk.Stack.of(destination).region}://${destination.repositoryName}`,
        ...props.repository.plainTextUrl
          ? { SOURCE: props.repository.plainTextUrl }
          : {},
      },
      secrets: props.repository.secretUrl
        ? { TOKEN: props.repository.secretUrl }
        : undefined,
    });

    taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
      actions: ['codecommit:GitPush'],
      resources: [destination.repositoryArn],
    }));

    const rule = new events.Rule(this, 'Rule', {
      schedule: props.schedule ?? events.Schedule.cron({
        minute: '0',
        hour: '0',
      }),
    });

    rule.addTarget(new targets.EcsTask({
      cluster: props.cluster,
      taskDefinition,
    }));
  }
}
