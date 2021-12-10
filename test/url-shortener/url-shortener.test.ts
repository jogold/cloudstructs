import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { UrlShortener } from '../../src';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('UrlShortener', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    expiration: cdk.Duration.days(60),
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
