import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ses from 'aws-cdk-lib/aws-ses';

import { Construct } from 'constructs';
import { EmailReceiver } from '../email-receiver/receiver';

export enum DmarcPolicy {
  None = 'none',
  Quarantine = 'quarantine',
  Reject = 'reject',
}

export enum DmarcAlignment {
  Relaxed = 'relaxed',
  Strict = 'strict',
}

export interface DmarcReporterProps {
  /**
   * The Route 53 hosted zone to create the DMARC record in.
   */
  readonly hostedZone: route53.IHostedZone;
  /**
   * The email address to send DMARC reports to.
   * This email address must be verified in SES.
   * @default dmarc-reports@<hostedZone.zoneName>
   */
  readonly emailAddress?: string;

  /**
   * Additional email addresses to send DMARC reports to.
   */
  readonly additionalEmailAddresses?: string[];

  /**
   * The DMARC policy to apply to messages that fail DMARC compliance.
   * This can be one of the following values:
   * - none: Do not apply any special handling to messages that fail DMARC compliance.
   * - quarantine: Quarantine messages that fail DMARC compliance.
   * - reject: Reject messages that fail DMARC compliance.
   */
  readonly dmarcPolicy: DmarcPolicy;

  /**
   * The DMARC policy to apply to messages that fail DMARC compliance for subdomains.
   * This can be one of the following values:
   * - none: Do not apply any special handling to messages that fail DMARC compliance.
   * - quarantine: Quarantine messages that fail DMARC compliance.
   * - reject: Reject messages that fail DMARC compliance.
   * @default inherited from dmarcPolicy
   */
  readonly dmarcSubdomainPolicy?: DmarcPolicy;

  /**
   * The percentage of messages that should be checked for DMARC compliance.
   * This is a value between 0 and 100.
   * @default 100
   */
  readonly dmarcPercentage?: number;

  /**
   * The alignment mode to use for DKIM signatures.
   * This can be one of the following values:
   * - relaxed: Use relaxed alignment mode.
   * - strict: Use strict alignment mode.
   */
  readonly dmarcDkimAlignment?: DmarcAlignment;

  /**
   * The alignment mode to use for SPF signatures.
   * This can be one of the following values:
   * - relaxed: Use relaxed alignment mode.
   * - strict: Use strict alignment mode.
   */
  readonly dmarcSpfAlignment?: DmarcAlignment;

  /**
   * A Lambda function to invoke after the message is saved to S3. The Lambda
   * function will be invoked with a SESMessage as event.
   */
  readonly function: lambda.IFunction;

  /**
   * An existing rule after which the new rule will be placed in the rule set.
   *
   * @default - The new rule is inserted at the beginning of the rule list.
   */
  readonly afterRule?: ses.IReceiptRule;

  /**
   * The SES receipt rule set where a receipt rule will be added
   */
  readonly receiptRuleSet: ses.IReceiptRuleSet;
}

export class DmarcReporter extends Construct {
  constructor(scope: Construct, id: string, props: DmarcReporterProps) {
    super(scope, id);

    new EmailReceiver(this, 'EmailReceiver', {
      recipients: [
        props.emailAddress ?? `dmarc-reports@${props.hostedZone.zoneName}`,
      ],
      function: props.function,
      afterRule: props.afterRule,
      receiptRuleSet: props.receiptRuleSet,
    });

    const dmarcRecordValue = [
      'v=DMARC1',
      `p=${props.dmarcPolicy}`,
      `rua=mailto:${[
        props.emailAddress,
        ...(props.additionalEmailAddresses ?? []),
      ].join(',')}`,
    ];

    if (props.dmarcSubdomainPolicy) {
      dmarcRecordValue.push(`sp=${props.dmarcSubdomainPolicy}`);
    }
    if (props.dmarcPercentage) {
      dmarcRecordValue.push(`pct=${props.dmarcPercentage}`);
    }
    if (props.dmarcDkimAlignment) {
      dmarcRecordValue.push(
        `adkim=${props.dmarcDkimAlignment === 'relaxed' ? 'r' : 's'}`,
      );
    }
    if (props.dmarcSpfAlignment) {
      dmarcRecordValue.push(
        `aspf=${props.dmarcSpfAlignment === 'relaxed' ? 'r' : 's'}`,
      );
    }

    // Create Route 53 DMARC Record
    new route53.TxtRecord(this, 'DmarcRecord', {
      zone: props.hostedZone,
      recordName: `_dmarc.${props.hostedZone.zoneName}`,
      values: [dmarcRecordValue.join('; ')],
    });
  }
}
