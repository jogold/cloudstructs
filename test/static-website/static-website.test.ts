import * as apigatewayv2 from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { StaticWebsite } from '../../src';

let stack: cdk.Stack;
let app: cdk.App;
beforeEach(() => {
  app = new cdk.App();
  stack = new cdk.Stack(app, 'Stack', {
    env: { region: 'eu-west-1' },
  });
});

test('StaticWebsite', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'my-site.com' });
  const api = new apigatewayv2.HttpApi(stack, 'Api', {
    defaultIntegration: new integrations.LambdaProxyIntegration({
      handler: new lambda.Function(stack, 'Fn', {
        code: lambda.Code.fromInline('inline'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
      }),
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

  // The EdgeFunction construct creates multiple stacks
  const assembly = app.synth();
  for (const stackArtifact of assembly.stacks) {
    expect(stackArtifact.template).toMatchSnapshot();
  }
});
