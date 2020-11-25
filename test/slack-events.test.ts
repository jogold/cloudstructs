import * as assert from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { SlackEvents } from '../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('SlackEvents', () => {
  new SlackEvents(stack, 'SlackEvents', {
    signingSecret: cdk.SecretValue.plainText('super-secret'),
  });

  expect(assert.SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
