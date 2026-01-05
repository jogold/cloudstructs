import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { StaticWebsite } from '../../src';

let stack: Stack;
let app: App;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { region: 'eu-west-1' },
  });
});

test('StaticWebsite', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'my-site.com' });
  const api = new apigatewayv2.HttpApi(stack, 'Api', {
    defaultIntegration: new integrations.HttpLambdaIntegration('Integration', new lambda.Function(stack, 'Fn', {
      code: lambda.Code.fromInline('inline'),
      handler: 'index.handler',
      runtime: new lambda.Runtime('nodejs24.x', lambda.RuntimeFamily.NODEJS, { supportsInlineCode: true }),
    })),
  });

  new StaticWebsite(stack, 'StaticWebsite', {
    domainName: 'www.my-site.com',
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    backendConfiguration: {
      key1: 'value1',
      key2: 'value2',
      apiUrl: api.url,
    },
  });

  // The EdgeFunction construct creates multiple stacks
  const assembly = app.synth();
  for (const stackArtifact of assembly.stacks) {
    expect(stackArtifact.template).toMatchSnapshot();
  }
});

test('no default redirect if domainName is zoneName', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'test.zone.com' });

  new StaticWebsite(stack, 'StaticWebsite', {
    domainName: 'test.zone.com',
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
  });

  Template.fromStack(stack).resourceCountIs('AWS::CloudFront::Distribution', 1);
});
