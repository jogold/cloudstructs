import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { UrlShortener } from '../../src';

let stack: Stack;
let app: App;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { region: 'eu-west-1' },
  });
});

test('UrlShortener', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
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
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    apiGatewayEndpoint,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with record name', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    recordName: 'short',
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with authorizer', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    apiGatewayAuthorizer: new apigateway.CognitoUserPoolsAuthorizer(stack, 'Cognito', {
      cognitoUserPools: [new cognito.UserPool(stack, 'UserPool')],
    }),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with CORS', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    corsAllowOrigins: ['https://www.example.com'],
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with IAM authorization', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  const urlShortener = new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    iamAuthorization: true,
  });

  const role = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  urlShortener.grantInvoke(role);

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('UrlShortener with allowed url patterns, link time to live and expired redirect', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    allowedUrlPatterns: ['^https://www\\.cstructs\\.com/'],
    linkTtl: Duration.minutes(15),
    expiredRedirectQueryParameter: 'expired',
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::S3::Bucket', {
    LifecycleConfiguration: {
      Rules: [{ ExpirationInDays: 2, Status: 'Enabled' }],
    },
  });
  template.resourceCountIs('AWS::DynamoDB::Table', 0);
  template.hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad', // CachingDisabled
      },
    },
  });
  expect(template.toJSON()).toMatchSnapshot();
});

test('UrlShortener derives the expiration from the link time to live', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    linkTtl: Duration.hours(36),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
    LifecycleConfiguration: {
      Rules: [{ ExpirationInDays: 3, Status: 'Enabled' }],
    },
  });
});

test('UrlShortener throws with an expiration shorter than the link time to live', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  expect(() => new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    linkTtl: Duration.days(2),
    expiration: Duration.days(1),
  })).toThrow(/`expiration` cannot be shorter than `linkTtl`/);
});

test('UrlShortener throws with an expiration too short for the expired redirect', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  expect(() => new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    linkTtl: Duration.days(1),
    expiration: Duration.days(1),
    expiredRedirectQueryParameter: 'expired',
  })).toThrow(/`expiration` must be at least a day longer than `linkTtl`/);
});

test('UrlShortener throws with empty allowed url patterns', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  expect(() => new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    allowedUrlPatterns: [],
  })).toThrow(/`allowedUrlPatterns` cannot be empty/);
});

test('UrlShortener throws with an expired redirect but no link time to live', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  expect(() => new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    expiredRedirectQueryParameter: 'expired',
  })).toThrow(/`expiredRedirectQueryParameter` requires `linkTtl`/);
});

test('UrlShortener throws with an invalid allowed url pattern', () => {
  const hostedZone = new route53.HostedZone(stack, 'HostedZone', { zoneName: 'cstructs.com' });

  expect(() => new UrlShortener(stack, 'UrlShortener', {
    hostedZone,
    certificate: acm.Certificate.fromCertificateArn(stack, 'Cert', 'arn:aws:acm:us-east-1:123456789012:certificate/abcd-efgh-ijkl-mnop'),
    allowedUrlPatterns: ['^https://('],
  })).toThrow(/Invalid regular expression/);
});
