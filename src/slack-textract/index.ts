import { Duration, SecretValue } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { SlackEvents } from '../slack-events';

/**
 * Properties for a SlackTextract
 */
export interface SlackTextractProps {
  /**
   * The signing secret of the Slack app
   */
  readonly signingSecret: SecretValue;

  /**
   * The **bot** token of the Slack app.
   *
   * The following scopes are required: `chat:write` and `files:read`
   */
  readonly botToken: SecretValue;

  /**
   * The application id of the Slack app.
   */
  readonly appId: string;
}

/**
 * Extract text from images posted to Slack using Amazon Textract
 */
export class SlackTextract extends Construct {
  constructor(scope: Construct, id: string, props: SlackTextractProps) {
    super(scope, id);

    const handler = new nodejs.NodejsFunction(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(30),
      logRetention: logs.RetentionDays.ONE_MONTH,
      environment: {
        SLACK_TOKEN: props.botToken.toString(),
      },
    });

    handler.addToRolePolicy(new iam.PolicyStatement({
      actions: ['textract:DetectDocumentText'],
      resources: ['*'],
    }));

    new SlackEvents(this, 'SlackEvents', {
      signingSecret: props.signingSecret,
    });

    const fileSharedRule = new events.Rule(this, 'SlackEventsRule', {
      eventPattern: {
        detail: {
          event: {
            type: ['file_shared'],
          },
        },
        resources: [props.appId],
        source: ['slack'],
      },
    });

    fileSharedRule.addTarget(new targets.LambdaFunction(handler, {
      event: events.RuleTargetInput.fromEventPath('$.detail.event'),
    }));
  }
}
