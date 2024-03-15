# EmailReceiver

Receive emails through SES, save them to S3 and invoke a Lambda function

## Usage

Define a `EmailReceiver`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // code that defines or imports a Lambda function and receipt rule set

    new EmailReceiver(this, 'EmailReceiver', {
      recipients: ['support@cloudstructs.com'], // Process emails sent to this address
      sourceWhitelist: '@amazon.com$', // Reject emails that are not from @amazon.com
      function: myFn,
      receiptRuleSet: myRuleSet,
    });
  }
}
```

Your Lambda function receives a [`AWSLambda.SNSMessage`](https://www.npmjs.com/package/@types/aws-lambda)
event:

```ts
import { S3 } from 'aws-sdk';
import { SESMessage } from 'cloudstructs';

const s3 = new S3({ apiVersion: '2006-03-01' });

export async function handler(event: AWSLambda.SNSEvent): Promise<void> {
  const ses = JSON.parse(event.Records[0].Sns.Message) as AWSLambda.SESMessage;

  // Download email
  const rawEmail = await s3.getObject({
    Bucket: ses.receipt.action.bucketName,
    Key: ses.receipt.action.objectKey,
  }).promise();

  // ... do something with email ...
}
```
