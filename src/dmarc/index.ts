import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { EmailReceiver, EmailReceiverProps } from '../email-receiver/receiver';

export interface DmarcReporterProps {
  /**
   * The Route 53 hosted zone to create the DMARC record in.
   */
  hostedZone: route53.IHostedZone;
  /**
   * The email address to send DMARC reports to.
   * This email address must be verified in SES.
   */
  emailAddress: string;

  /**
   * Additional email addresses to send DMARC reports to.
   */
  additionalEmailAddresses?: string[];

  /**
   * The DMARC policy to apply to messages that fail DMARC compliance.
   * This can be one of the following values:
   * - none: Do not apply any special handling to messages that fail DMARC compliance.
   * - quarantine: Quarantine messages that fail DMARC compliance.
   * - reject: Reject messages that fail DMARC compliance.
   */
  dmarcPolicy: 'none' | 'quarantine' | 'reject';

  /**
   * The DMARC policy to apply to messages that fail DMARC compliance for subdomains.
   * This can be one of the following values:
   * - none: Do not apply any special handling to messages that fail DMARC compliance.
   * - quarantine: Quarantine messages that fail DMARC compliance.
   * - reject: Reject messages that fail DMARC compliance.
   * @default inherited from dmarcPolicy
   */
  dmarcSubdomainPolicy?: 'none' | 'quarantine' | 'reject';

  /**
   * The percentage of messages that should be checked for DMARC compliance.
   * This is a value between 0 and 100.
   * @default 100
   */
  dmarcPercentage?: number;

  /**
   * The alignment mode to use for DKIM signatures.
   * This can be one of the following values:
   * - relaxed: Use relaxed alignment mode.
   * - strict: Use strict alignment mode.
   */
  dmarcDkimAlignment?: 'relaxed' | 'strict';

  /**
   * The alignment mode to use for SPF signatures.
   * This can be one of the following values:
   * - relaxed: Use relaxed alignment mode.
   * - strict: Use strict alignment mode.
   */
  dmarcSpfAlignment?: 'relaxed' | 'strict';

  /**
   * The properties to pass to the EmailReceiver construct.
   * The `recipients` property will be ignored.
   */
  emailReceiverProps: Omit<EmailReceiverProps, 'recipients'>;
}

export class DmarcReporter extends Construct {
  constructor(scope: Construct, id: string, props: DmarcReporterProps) {
    super(scope, id);

    const emailReceiver = new EmailReceiver(this, 'EmailReceiver', {
      recipients: [props.emailAddress],
      ...props.emailReceiverProps,
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
    const dmarcRecord = new route53.TxtRecord(this, 'DmarcRecord', {
      zone: props.hostedZone,
      recordName: `_dmarc.${props.hostedZone.zoneName}`,
      values: [dmarcRecordValue.join('; ')],
    });
  }
}
