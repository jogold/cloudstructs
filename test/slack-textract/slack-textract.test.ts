import { SecretValue, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SlackTextract } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SlackEvents', () => {
  new SlackTextract(stack, 'SlackTextract', {
    signingSecret: SecretValue.secretsManager('my-slack-app', { jsonField: 'signingSecret' }),
    appId: SecretValue.secretsManager('my-slack-app', { jsonField: 'appId' }).toString(),
    botToken: SecretValue.secretsManager('my-slack-app', { jsonField: 'botToken' }),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
