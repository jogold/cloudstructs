import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2-alpha';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

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
export class SlackEvents extends Construct {
  /**
   * The custom event bus where Slack events are sent
   */
  public readonly eventBus?: events.EventBus;

  constructor(scope: Construct, id: string, props: SlackEventsProps) {
    super(scope, id);

    if (props.customEventBus) {
      this.eventBus = new events.EventBus(this, 'EventBus');
    }

    // Send event to the event bus
    const handler = new nodejs.NodejsFunction(this, 'handler', {
      logRetention: logs.RetentionDays.ONE_MONTH,
      environment: {
        SLACK_SIGNING_SECRET: props.signingSecret.toString(),
      },
    });

    if (this.eventBus) {
      handler.addEnvironment('EVENT_BUS_NAME', this.eventBus.eventBusName);
    }

    events.EventBus.grantAllPutEvents(handler);

    // HTTP API
    const httpApi = new apigatewayv2.HttpApi(this, 'SlackEventsApi', {
      defaultIntegration: new integrations.HttpLambdaIntegration('Integration', handler),
      apiName: props.apiName,
    });

    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: httpApi.apiEndpoint,
    });
  }
}
