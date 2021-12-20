import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import { SlackApp } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SlackApp', () => {
  new SlackApp(stack, 'MyApp', {
    configurationTokenSecret: secrets.Secret.fromSecretNameV2(stack, 'SlackSecret', 'slack-secret'),
    manifest: JSON.stringify({
      display_information: {
        name: 'My App',
      },
    }),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
