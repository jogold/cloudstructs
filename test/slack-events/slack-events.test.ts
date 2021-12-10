import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { SlackEvents } from '../../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('SlackEvents', () => {
  new SlackEvents(stack, 'SlackEvents', {
    signingSecret: cdk.SecretValue.secretsManager('my-slack-app'),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
