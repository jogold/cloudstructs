import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ses from 'aws-cdk-lib/aws-ses';
import { EmailReceiver } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('EmailReceiver', () => {
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.fromInline('export.handler=() => void;'),
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
  });
  const ruleSet = ses.ReceiptRuleSet.fromReceiptRuleSetName(stack, 'RuleSet', 'rule-set');
  new EmailReceiver(stack, 'EmailReceiver', {
    recipients: ['support@cloudstructs.com'],
    sourceWhitelist: '@amazon.com$',
    function: fn,
    receiptRuleSet: ruleSet,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
