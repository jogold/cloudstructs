import * as path from 'path';
import { ArnFormat, CfnResource, Duration, Stack } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * A State Machine
 */
export interface IStateMachine {
  /**
   * The ARN of the state machine
   */
  readonly stateMachineArn: string;
}

/**
 * Properties for a StateMachineCustomResourceProvider
 */
export interface StateMachineCustomResourceProviderProps {
  /**
   * The state machine
   */
  readonly stateMachine: IStateMachine;

  /**
   * Timeout
   *
   * @default Duration.minutes(30)
   */
  readonly timeout?: Duration;
}

/**
 * A state machine custom resource provider
 */
export class StateMachineCustomResourceProvider extends Construct {
  /**
   * The service token
   */
  public readonly serviceToken: string;

  constructor(scope: Construct, id: string, props: StateMachineCustomResourceProviderProps) {
    super(scope, id);

    const cfnResponseSuccessFn = this.createCfnResponseFn('Success');
    const cfnResponseFailedFn = this.createCfnResponseFn('Failed');

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
    });
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [cfnResponseSuccessFn.functionArn, cfnResponseFailedFn.functionArn],
    }));
    // https://docs.aws.amazon.com/step-functions/latest/dg/stepfunctions-iam.html
    // https://docs.aws.amazon.com/step-functions/latest/dg/concept-create-iam-advanced.html#concept-create-iam-advanced-execution
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['states:StartExecution'],
      resources: [props.stateMachine.stateMachineArn],
    }));
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['states:DescribeExecution', 'states:StopExecution'],
      resources: [Stack.of(this).formatArn({
        service: 'states',
        resource: 'execution',
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        resourceName: `${Stack.of(this).splitArn(props.stateMachine.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName}*`,
      })],
    }));
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
      resources: [Stack.of(this).formatArn({
        service: 'events',
        resource: 'rule',
        resourceName: 'StepFunctionsGetEventsForStepFunctionsExecutionRule',
      })],
    }));

    const definition = Stack.of(this).toJsonString({
      StartAt: 'StartExecution',
      States: {
        StartExecution: {
          Type: 'Task',
          Resource: 'arn:aws:states:::states:startExecution.sync:2', // with sync:2 the Output is JSON parsed
          Parameters: {
            'Input.$': '$',
            'StateMachineArn': props.stateMachine.stateMachineArn,
          },
          TimeoutSeconds: (props.timeout ?? Duration.minutes(30)).toSeconds(),
          Next: 'CfnResponseSuccess',
          Catch: [{
            ErrorEquals: ['States.ALL'],
            Next: 'CfnResponseFailed',
          }],
        },
        CfnResponseSuccess: {
          Type: 'Task',
          Resource: cfnResponseSuccessFn.functionArn,
          End: true,
        },
        CfnResponseFailed: {
          Type: 'Task',
          Resource: cfnResponseFailedFn.functionArn,
          End: true,
        },
      },
    });

    const stateMachine = new CfnResource(this, 'StateMachine', {
      type: 'AWS::StepFunctions::StateMachine',
      properties: {
        DefinitionString: definition,
        RoleArn: role.roleArn,
      },
    });
    stateMachine.node.addDependency(role);

    const startExecution = new lambda.Function(this, 'StartExecution', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'runtime')),
      handler: 'index.startExecution',
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
    });
    startExecution.addToRolePolicy(new iam.PolicyStatement({
      actions: ['states:StartExecution'],
      resources: [stateMachine.ref],
    }));
    startExecution.addEnvironment('STATE_MACHINE_ARN', stateMachine.ref);

    this.serviceToken = startExecution.functionArn;
  }

  private createCfnResponseFn(status: string) {
    return new lambda.Function(this, `CfnResponse${status}`, {
      code: lambda.Code.fromAsset(path.join(__dirname, 'runtime')),
      handler: `index.cfnResponse${status}`,
      runtime: new lambda.Runtime('nodejs18.x', lambda.RuntimeFamily.NODEJS),
    });
  }
}
