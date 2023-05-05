# DmarcReporter

This construct allows you to configure a Route 53 DMARC record and set up an email receiver for DMARC reports. It helps you to monitor and enforce your DMARC policy, ensuring that your domain is protected against email spoofing and phishing attacks.

## Usage

Define a `DmarcReporter`:

```ts
import { Stack, StackProps } from "aws-cdk-lib";
import {
  DmarcReporter,
  DmarcReporterProps,
  DmarcPolicy,
  DmarcAlignment,
} from "cloudstructs";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dmarcReporterProps: DmarcReporterProps = {
      hostedZone: myHostedZone,

      // optional, defaults to dmarc-reports@<hostedZone.zoneName>
      emailAddress: "dmarc-reports@example.com",

      // optional, other email addresses that receive dmarc reports
      additionalEmailAddresses: ["additional@example.com"],

      // you could use DmarcPolicy.None to just receive dmarc reports
      dmarcPolicy: DmarcPolicy.Quarantine,

      // optional, inherited from dmarcPolicy
      dmarcSubdomainPolicy: DmarcPolicy.None,

      // optional, defaults to 100
      dmarcPercentage: 100,

      // optional, defaults to DmarcAlignment.Relaxed
      dmarcDkimAlignment: DmarcAlignment.Relaxed,

      // optional, defaults to DmarcAlignment.Relaxed
      dmarcSpfAlignment: DmarcAlignment.Strict,

      // lambda function that processes dmarc reports
      // receives a [`AWSLambda.SESMessage`](https://www.npmjs.com/package/@types/aws-lambda)
      function: myFn,
      
      receiptRuleSet: myRuleSet,
    };

    new DmarcReporter(this, "DmarcReporter", dmarcReporterProps);
  }
}
```

Your Lambda function conveniently receives a [`AWSLambda.SESMessage`](https://www.npmjs.com/package/@types/aws-lambda)
event:

```ts
import { S3 } from "aws-sdk";
import { SESMessage } from "cloudstructs";

const s3 = new S3({ apiVersion: "2006-03-01" });

export async function handler(event: AWSLambda.SESMessage): Promise<void> {
  // Download email
  const rawEmail = await s3
    .getObject({
      Bucket: event.receipt.action.bucketName,
      Key: event.receipt.action.objectKey,
    })
    .promise();

  // ... do something with email ...
}
```
