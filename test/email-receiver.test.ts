import * as assert from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ses from '@aws-cdk/aws-ses';
import * as cdk from '@aws-cdk/core';
import { EmailReceiver } from '../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('EmailReceiver', () => {
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.fromInline('export.handler=() => void;'),
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: 'index.handler',
  });
  const ruleSet = ses.ReceiptRuleSet.fromReceiptRuleSetName(stack, 'RuleSet', 'rule-set');
  new EmailReceiver(stack, 'EmailReceiver', {
    recipients: ['support@cloudstructs.com'],
    sourceWhitelist: '@amazon.com$',
    function: fn,
    receiptRuleSet: ruleSet,
  });

  expect(assert.SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
