# MjmlTemplate

SES email template from [MJML](https://mjml.io/)

## Usage

Define a `MjmlTemplate`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const mjml = `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text>Hello {{name}}</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;

    new cloudstructs.MjmlTemplate(this, 'Template', {
      subject: 'Welcome!',
      mjml,
    });
  }
}
```

The deployed template can then be used to [send personalized email](https://docs.aws.amazon.com/ses/latest/dg/send-personalized-email-api.html) with the Amazon SES API.