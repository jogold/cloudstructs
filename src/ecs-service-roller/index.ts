import { UpdateServiceCommandInput } from '@aws-sdk/client-ecs'; // eslint-disable-line import/no-extraneous-dependencies
import { Stack } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * Properties for a EcsServiceRoller
 */
export interface EcsServiceRollerProps {
  /**
   * The ECS cluster where the services run
   */
  readonly cluster: ecs.ICluster;

  /**
   * The ECS service for which tasks should be rolled
   */
  readonly service: ecs.IService;

  /**
   * The rule or schedule that should trigger a roll
   *
   * @default - roll everyday at midnight
   */
  readonly trigger?: RollTrigger;
}

/**
 * The rule or schedule that should trigger a roll
 */
export abstract class RollTrigger {
  /**
   * Schedule that should trigger a roll
   */
  public static fromSchedule(schedule: events.Schedule): RollTrigger {
    return { schedule };
  }

  /**
   * Rule that should trigger a roll
   */
  public static fromRule(rule: events.Rule): RollTrigger {
    return { rule };
  }

  /**
   * Roll schedule
   *
   * @default - roll everyday at midnight
   */
  public abstract readonly schedule?: events.Schedule;

  /**
   * Roll rule
   *
   * @default - roll everyday at midnight
   */
  public abstract readonly rule?: events.Rule;
}

/**
 * Roll your ECS service tasks on schedule or with a rule
 */
export class EcsServiceRoller extends Construct {
  constructor(scope: Construct, id: string, props: EcsServiceRollerProps) {
    super(scope, id);

    const rule = props.trigger?.rule ?? new events.Rule(this, 'Rule', {
      schedule: props.trigger?.schedule ?? events.Schedule.cron({
        minute: '0',
        hour: '0',
      }),
    });


    const parameters: UpdateServiceCommandInput = {
      service: props.service.serviceName,
      cluster: props.cluster.clusterName,
      forceNewDeployment: true,
    };
    rule.addTarget(new targets.AwsApi({
      service: 'ECS',
      action: 'updateService',
      parameters,
      // https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-supported-iam-actions-resources.html
      // arn:aws:ecs:<region>:<account>:service/<cluster-name>/<service-name>
      policyStatement: new iam.PolicyStatement({
        actions: ['ecs:UpdateService'],
        resources: [Stack.of(this).formatArn({
          service: 'ecs',
          resource: 'service',
          resourceName: `${props.cluster.clusterName}/${props.service.serviceName}`,
        })],
      }),
    }));
  }
}
