import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';

/**
 * Properties for a SlackEvents
 */
export interface SlackEventsProps {
  /**
   * The signing secret of the Slack app
   */
  readonly signingSecret: cdk.SecretValue;

  /**
   * A name for the API Gateway resource
   *
   * @default SlackEventsApi
   */
  readonly apiName?: string;

  /**
   * Whether to use a custom event bus
   *
   * @default false
   */
  readonly customEventBus?: boolean;
}

/**
 * Send Slack events to Amazon EventBridge
 */
export class SlackEvents extends cdk.Construct {
  /**
   * The custom event bus where Slack events are sent
   */
  public readonly eventBus?: events.EventBus;

  constructor(scope: cdk.Construct, id: string, props: SlackEventsProps) {
    super(scope, id);

    if (props.customEventBus) {
      this.eventBus = new events.EventBus(this, 'EventBus');
    }

    // Send event to the event bus
    const handler = new nodejs.NodejsFunction(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      logRetention: logs.RetentionDays.ONE_MONTH,
      environment: {
        SLACK_SIGNING_SECRET: props.signingSecret.toString(),
      },
    });

    if (this.eventBus) {
      handler.addEnvironment('EVENT_BUS_NAME', this.eventBus.eventBusName);
    }

    events.EventBus.grantPutEvents(handler);

    // HTTP API
    const httpApi = new apigatewayv2.HttpApi(this, 'SlackEventsApi', {
      defaultIntegration: new integrations.LambdaProxyIntegration({
        handler,
      }),
      apiName: props.apiName,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.apiEndpoint,
    });
  }
}
