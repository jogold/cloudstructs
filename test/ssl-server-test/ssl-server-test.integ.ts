import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { SslServerTest } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const alarmTopic = new Topic(this, 'Topic');

    new SslServerTest(this, 'SslServerTest', {
      host: 'cdk.dev',
      alarmTopic,
    });
  }
}

const app = new App();
new TestStack(app, 'ssl-server-test-integ');
app.synth();
