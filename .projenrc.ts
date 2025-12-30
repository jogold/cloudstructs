import * as fs from 'fs';
import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Jonathan Goldwasser',
  repositoryUrl: 'https://github.com/jogold/cloudstructs.git',
  authorAddress: 'jonathan.goldwasser@gmail.com',
  description: 'High-level constructs for AWS CDK',
  jsiiVersion: '5.x',
  cdkVersion: '2.232.0',
  name: 'cloudstructs',
  projenrcTs: true,
  tsJestOptions: { transformOptions: { isolatedModules: true } },
  peerDeps: [],
  bundledDeps: [
    '@aws/durable-execution-sdk-js',
    '@slack/web-api',
    'got',
    'mjml',
  ],
  devDeps: [
    '@aws-sdk/client-cloudformation',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/client-ecr',
    '@aws-sdk/client-ecs',
    '@aws-sdk/client-eventbridge',
    '@aws-sdk/client-iam',
    '@aws-sdk/client-s3',
    '@aws-sdk/client-secrets-manager',
    '@aws-sdk/client-sfn',
    '@aws-sdk/client-sns',
    '@aws-sdk/client-textract',
    '@aws-sdk/lib-dynamodb',
    '@aws/durable-execution-sdk-js-testing',
    '@types/aws-lambda',
    '@types/mjml',
    '@types/tsscmp',
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
    'nock',
  ],
  defaultReleaseBranch: 'master',
  releaseToNpm: true,
  npmTrustedPublishing: true,
  publishToPypi: {
    distName: 'cloudstructs',
    module: 'cloudstructs',
    trustedPublishing: true,
  },
  publishToGo: {
    moduleName: 'github.com/jogold/cloudstructs-go',
  },
  publishToMaven: {
    mavenGroupId: 'io.github.jogold',
    javaPackage: 'io.github.jogold.cloudstructs',
    mavenArtifactId: 'cloudstructs',
    mavenServerId: 'central-ossrh',
  },
  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_24_X,
  },
});

// Update integ test snapshots after upgrade
if (project.upgradeWorkflow) {
  const bundleTask = project.tasks.tryFind('bundle');
  if (bundleTask) {
    project.upgradeWorkflow.postUpgradeTask.spawn(bundleTask);
  }

  const snapshotAllTask = project.tasks.tryFind('integ:snapshot-all');
  if (snapshotAllTask) {
    project.upgradeWorkflow.postUpgradeTask.spawn(snapshotAllTask);
  }
}

// Add "exports"
const packageExports: Record<string, string> = {
  '.': './lib/index.js',
  './package.json': './package.json',
  './.jsii': './.jsii',
};
for (const dirent of fs.readdirSync('./src', { withFileTypes: true })) {
  if (dirent.isDirectory()) {
    const construct = dirent.name;
    // TODO: remove "lib" when TypeScript supports "exports"
    packageExports[`./lib/${construct}`] = `./lib/${construct}/index.js`;
  }
}
project.package.addField('exports', packageExports);

project.synth();
