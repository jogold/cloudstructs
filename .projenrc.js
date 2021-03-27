const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  authorAddress: 'jonathan.goldwasser@gmail.com',
  authorName: 'Jonathan Goldwasser',
  description: 'High-level constructs for AWS CDK',
  cdkVersion: '1.80.0',
  name: 'cloudstructs',
  repository: 'https://github.com/jogold/cloudstructs.git',
  cdkDependencies: [
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-cloudfront',
    '@aws-cdk/aws-cloudfront-origins',
    '@aws-cdk/aws-codecommit',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-events',
    '@aws-cdk/aws-events-targets',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-destinations',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-logs',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-route53-patterns',
    '@aws-cdk/aws-route53-targets',
    '@aws-cdk/aws-s3',
    '@aws-cdk/aws-ses',
    '@aws-cdk/aws-ses-actions',
    '@aws-cdk/aws-sns',
    '@aws-cdk/aws-sns-subscriptions',
    '@aws-cdk/core',
    '@aws-cdk/custom-resources',
  ],
  bundledDeps: [
    'got',
    '@slack/web-api',
  ],
  devDeps: [
    '@aws-cdk/aws-secretsmanager',
    '@types/aws-lambda',
    '@types/tsscmp',
    'aws-sdk',
    'aws-sdk-mock',
    'esbuild',
    'nock',
  ],
  dependabot: false,
  defaultReleaseBranch: 'master',
});

project.synth();
