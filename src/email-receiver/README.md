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

Your Lambda function conveniently receives a [`AWSLambda.SESMessage`](https://www.npmjs.com/package/@types/aws-lambda)
event:

```ts
import { S3 } from 'aws-sdk';
import { SESMessage } from 'cloudstructs';

const s3 = new S3({ apiVersion: '2006-03-01' });

export async function handler(event: AWSLambda.SESMessage): Promise<void> {
  // Download email
  const rawEmail = await s3.getObject({
    Bucket: event.receipt.action.bucketName,
    Key: event.receipt.action.objectKey,
  }).promise();

  // ... do something with email ...
}
```
