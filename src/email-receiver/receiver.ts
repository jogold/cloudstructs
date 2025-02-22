import { Duration } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as actions from 'aws-cdk-lib/aws-ses-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import { WhitelistFunction } from './whitelist-function';

/**
 * Properties for an EmailReceiver
 */
export interface EmailReceiverProps {
  /**
   * The SES receipt rule set where a receipt rule will be added
   */
  readonly receiptRuleSet: ses.IReceiptRuleSet;

  /**
   * The recipients for which emails should be received
   */
  readonly recipients: string[];

  /**
   * A Lambda function to invoke after the message is saved to S3. The Lambda
   * function will be invoked with a SESMessage as event.
   */
  readonly function?: lambda.IFunction;

  /**
   * A regular expression to whitelist source email addresses
   *
   * @default - no whitelisting of source email addresses
   */
  readonly sourceWhitelist?: string;

  /**
   * An existing rule after which the new rule will be placed in the rule set.
   *
   * @default - The new rule is inserted at the beginning of the rule list.
   */
  readonly afterRule?: ses.IReceiptRule;

  /**
   * Whether the receiver is active.
   *
   * @default true
   */
  readonly enabled?: boolean;
}

/**
 * Receive emails through SES, save them to S3 and invokes a
 * Lambda function
 */
export class EmailReceiver extends Construct {
  /**
   * The S3 bucket where emails are delivered
   */
  public readonly bucket: s3.Bucket;

  /**
   * The SNS topic that is notified when emails are delivered to S3
   */
  public readonly topic: sns.ITopic;

  constructor(scope: Construct, id: string, props: EmailReceiverProps) {
    super(scope, id);

    const receiptRule = new ses.ReceiptRule(this, 'ReceiptRule', {
      ruleSet: props.receiptRuleSet,
      recipients: props.recipients,
      after: props.afterRule,
      enabled: props.enabled,
    });

    this.bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [{ expiration: Duration.days(1) }],
    });
    if (props.function) {
      this.bucket.grantRead(props.function); // Download email
    }

    this.topic = new sns.Topic(this, 'Topic');

    // Actions
    if (props.sourceWhitelist) {
      const whitelistHandler = new WhitelistFunction(this, 'whitelist', {
        environment: {
          SOURCE_WHITELIST: props.sourceWhitelist,
        },
        logRetention: logs.RetentionDays.ONE_MONTH,
      });

      receiptRule.addAction(new actions.Lambda({
        function: whitelistHandler,
        invocationType: actions.LambdaInvocationType.REQUEST_RESPONSE,
      }));
    }

    receiptRule.addAction(new actions.S3({
      bucket: this.bucket,
      topic: this.topic,
    }));

    if (props.function) {
      this.topic.addSubscription(new subscriptions.LambdaSubscription(props.function)); // Notify
    }
  }
}
