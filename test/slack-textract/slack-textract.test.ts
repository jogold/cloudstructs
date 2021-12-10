import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { SlackTextract } from '../../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('SlackEvents', () => {
  new SlackTextract(stack, 'SlackTextract', {
    signingSecret: cdk.SecretValue.secretsManager('my-slack-app', { jsonField: 'signingSecret' }),
    appId: cdk.SecretValue.secretsManager('my-slack-app', { jsonField: 'appId' }).toString(),
    botToken: cdk.SecretValue.secretsManager('my-slack-app', { jsonField: 'botToken' }),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
