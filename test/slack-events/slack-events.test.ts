import { SecretValue, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SlackEvents } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('SlackEvents', () => {
  new SlackEvents(stack, 'SlackEvents', {
    signingSecret: SecretValue.secretsManager('my-slack-app'),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
