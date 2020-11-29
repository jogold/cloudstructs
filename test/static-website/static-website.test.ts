import * as assert from '@aws-cdk/assert';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { StaticWebsite } from '../../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('StaticWebsite', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'my-site.com' });
  const api = new apigateway.LambdaRestApi(stack, 'Api', {
    handler: new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('inline'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    }),
  });

  new StaticWebsite(stack, 'StaticWebsite', {
    domainName: 'www.my-site.com',
    hostedZone,
    backendConfiguration: {
      key1: 'value1',
      key2: 'value2',
      apiUrl: api.url,
    },
  });

  expect(assert.SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
