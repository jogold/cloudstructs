import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ToolkitCleaner } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ToolkitCleaner(this, 'ToolkitCleaner');
  }
}

const app = new App();
new TestStack(app, 'toolkit-cleaner-integ');
app.synth();
