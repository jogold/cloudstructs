import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { SlackApp, SlackAppManifestDefinition } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const app = new SlackApp(this, 'MyApp', {
      configurationTokenSecret: secretsmanager.Secret.fromSecretNameV2(this, 'Secret', 'slack-app-config-token'),
      manifest: SlackAppManifestDefinition.fromManifest({
        displayInformation: {
          name: 'My App',
          description: 'A very cool Slack App deployed with CDK',
        },
      }),
    });

    new CfnOutput(this, 'AppId', {
      value: app.appId,
    });
  }
}

const app = new App();
new TestStack(app, 'slack-app-integ');
app.synth();
