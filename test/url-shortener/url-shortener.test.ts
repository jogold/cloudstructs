import { Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { UrlShortener } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('UrlShortener', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    expiration: Duration.days(60),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});


test('UrlShortener with API gateway endpoint', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  const vpc = new ec2.Vpc(stack, 'Vpc');
  const apiGatewayEndpoint = new ec2.InterfaceVpcEndpoint(stack, 'ApiGatewayEndpoint', {
    service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
    vpc,
  });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    apiGatewayEndpoint,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with record name', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    recordName: 'short',
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with authorizer', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    apiGatewayAuthorizer: new apigateway.CognitoUserPoolsAuthorizer(stack, 'Cognito', {
      cognitoUserPools: [new cognito.UserPool(stack, 'UserPool')],
    }),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
