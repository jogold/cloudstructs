import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SslServerTest } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new SslServerTest(this, 'SslServerTestCdkDev', {
      host: 'cdk.dev',
    });

    new SslServerTest(this, 'SslServerTestWwwCdkDev', {
      host: 'www.cdk.dev',
    });
  }
}

const app = new App();
new TestStack(app, 'ssl-server-test-integ');
app.synth();
