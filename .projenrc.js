const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  authorAddress: 'jonathan.goldwasser@gmail.com',
  authorName: 'Jonathan Goldwasser',
  description: 'High-level constructs for AWS CDK',
  cdkVersion: '2.1.0',
  name: 'cloudstructs',
  repository: 'https://github.com/jogold/cloudstructs.git',
  workflowNodeVersion: '14.17.0',
  peerDeps: [
    '@aws-cdk/aws-apigatewayv2-alpha',
    '@aws-cdk/aws-apigatewayv2-integrations-alpha',
  ],
  bundledDeps: [
    'got',
    '@slack/web-api',
  ],
  devDeps: [
    '@types/aws-lambda',
    '@types/tsscmp',
    'aws-cdk',
    'aws-sdk',
    'aws-sdk-mock',
    'esbuild',
    'nock',
  ],
  defaultReleaseBranch: 'master',
});

project.synth();
