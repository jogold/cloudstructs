import { Template } from '@aws-cdk/assertions';
import { CustomResource, Stack } from '@aws-cdk/core';
import { StateMachineCustomResourceProvider } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('StateMachineCustomResourceProvider', () => {
  // WHEN
  const provider = new StateMachineCustomResourceProvider(stack, 'Provider', {
    stateMachine: {
      stateMachineArn: 'arn:aws:states:us-east-1:123456789012:stateMachine:my-machine',
    },
  });

  new CustomResource(stack, 'CustomResource', {
    serviceToken: provider.serviceToken,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
