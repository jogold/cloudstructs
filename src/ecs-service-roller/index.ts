import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

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
export class EcsServiceRoller extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EcsServiceRollerProps) {
    super(scope, id);

    const rule = props.trigger?.rule ?? new events.Rule(this, 'Rule', {
      schedule: props.trigger?.schedule ?? events.Schedule.cron({
        minute: '0',
        hour: '0',
      }),
    });


    rule.addTarget(new targets.AwsApi({
      service: 'ECS',
      action: 'updateService',
      parameters: {
        service: props.service.serviceName,
        cluster: props.cluster.clusterName,
        forceNewDeployment: true,
      } as AWS.ECS.UpdateServiceRequest,
      // https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-supported-iam-actions-resources.html
      // arn:aws:ecs:<region>:<account>:service/<cluster-name>/<service-name>
      policyStatement: new iam.PolicyStatement({
        actions: ['ecs:UpdateService'],
        resources: [cdk.Stack.of(this).formatArn({
          service: 'ecs',
          resource: 'service',
          resourceName: `${props.cluster.clusterName}/${props.service.serviceName}`,
        })],
      }),
    }));
  }
}
