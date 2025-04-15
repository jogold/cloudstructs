import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ses from 'aws-cdk-lib/aws-ses';
import { DmarcAlignment, DmarcPolicy, DmarcReporter } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('DmarcReporter', () => {
  const fn = new lambda.Function(stack, 'Fn', {
    code: lambda.Code.fromInline('export.handler = () => void;'),
    runtime: new lambda.Runtime('nodejs22.x', lambda.RuntimeFamily.NODEJS, {
      supportsInlineCode: true,
    }),
    handler: 'index.handler',
  });
  const ruleSet = ses.ReceiptRuleSet.fromReceiptRuleSetName(
    stack,
    'RuleSet',
    'rule-set',
  );
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', {
    zoneName: 'example.com',
  });
  new DmarcReporter(stack, 'DmarcReporter', {
    hostedZone,
    dmarcPolicy: DmarcPolicy.REJECT,
    dmarcDkimAlignment: DmarcAlignment.RELAXED,
    dmarcSpfAlignment: DmarcAlignment.STRICT,
    dmarcPercentage: 55,
    dmarcSubdomainPolicy: DmarcPolicy.QUARANTINE,
    additionalEmailAddresses: ['someaddress@dmarc-service.com', 'otheraddress@other-service.com'],
    function: fn,
    receiptRuleSet: ruleSet,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
