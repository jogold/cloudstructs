# SlackApp

Custom resource to create a Slack App from a [manifest](https://api.slack.com/reference/manifests).

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
      manifest: SlackAppManifestDefinition.fromManifest({
        name: 'My App',
        description: 'A very cool Slack App deployed with CDK',
        interactivity: {
          requestUrl: myApi.url, // reference other construct's properties
        },
      }),
    });
  }
}
```

The secret `slack-app-config-token` is expected to be of the following form:

```json
{
  "refreshToken": "xoxe-1-..."
}
```

Go to [App configuration tokens](https://api.slack.com/authentication/config-tokens) to create
a refresh token. The construct will automatically use the refresh token to retrieve a new access
token when needed.

By default, the construct creates an AWS Secrets Manager secret and stores the app credentials in
it. You can use your own secret by specifying the `credentialsSecret` prop.

## Consuming app credentials

The `credentials` property of the `SlackApp` exposes a `secretsmanager.Secret` with the app
credentials. The secret has the following form:

```json
{
  "appId": "...",
  "clientId": "...",
  "clientSecret": "...",
  "verificationToken": "...",
  "signingSecret": "..."
}
```

The credentials are also exposed as individual properties that create CloudFormation
[dynamic references](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html):

```ts
const myApp = new cloudstructs.SlackApp(this, 'MyApp', { ... });

myLambda.addEnvironment('CLIENT_ID', myApp.clientId);
```
