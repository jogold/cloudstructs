import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { SlackApp } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const app = new SlackApp(this, 'MyApp', {
      configurationTokenSecret: secretsmanager.Secret.fromSecretNameV2(this, 'Secret', 'slack-app-config-token'),
      manifest: JSON.stringify({
        display_information: {
          name: 'My App',
          description: 'A very cool Slack App deploy with CDK',
        },
      }),
    });

    new CfnOutput(this, 'ClientId', {
      value: app.appId,
    });
  }
}

const app = new App();
new TestStack(app, 'slack-app-integ');
app.synth();
