import { Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export class SlackAppProvider extends Construct {
  /**
   * Creates a stack-singleton resource provider
   */
  public static getOrCreate(scope: Construct): SlackAppProvider {
    const stack = Stack.of(scope);
    const uid = 'SlackAppProvider';
    return stack.node.tryFindChild(uid) as SlackAppProvider ?? new SlackAppProvider(stack, uid);
  }

  public readonly serviceToken: string;

  public readonly handler: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.handler = new nodejs.NodejsFunction(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      logRetention: logs.RetentionDays.ONE_MONTH,
    });

    const provider = new cr.Provider(this, 'Resource', {
      onEventHandler: this.handler,
    });

    this.serviceToken = provider.serviceToken;
  }
}
