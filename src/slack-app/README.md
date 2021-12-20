# SlackApp

Custom resource to create a Slack App

## Usage

Define a `SlackApp`:

```ts
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudstructs from 'cloudstructs';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new cloudstructs.SlackApp(this, 'MyApp', {
      configurationTokenSecret: secretsmanager.Secret.fromSecretNameV2(this, 'Secret', 'slack-app-config-token'),
      manifest: JSON.stringify({
        display_information: {
          name: 'My App',
          description: 'A very cool Slack App deployed with CDK',
        },
      }),
    });
  }
}
```

The secret `slack-app-config-token` is of the following form:

```json
{
  "refreshToken": "xoxe-1-..."
}
```

Go to [App configuration tokens](https://api.slack.com/authentication/config-tokens) to create
a refresh token.
