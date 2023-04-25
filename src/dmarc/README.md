# DmarcReporter

This construct allows you to configure a Route 53 DMARC record and set up an email receiver for DMARC reports. It helps you to monitor and enforce your DMARC policy, ensuring that your domain is protected against email spoofing and phishing attacks.

## Usage

Define a `DmarcReporter`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import { DmarcReporter, DmarcReporterProps } from './dmarc-reporter';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dmarcReporterProps: DmarcReporterProps = {
      hostedZone: myHostedZone,
      emailAddress: 'dmarc-reports@example.com',
      additionalEmailAddresses: ['additional@example.com'],
      dmarcPolicy: 'quarantine',
      dmarcSubdomainPolicy: 'none',
      dmarcPercentage: 100,
      dmarcDkimAlignment: 'relaxed',
      dmarcSpfAlignment: 'strict',
      emailReceiverProps: myEmailReceiverProps,
    };

    new DmarcReporter(this, 'DmarcReporter', dmarcReporterProps);
  }
}
```
