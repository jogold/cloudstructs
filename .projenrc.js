const fs = require('fs');
const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  authorAddress: 'jonathan.goldwasser@gmail.com',
  authorName: 'Jonathan Goldwasser',
  description: 'High-level constructs for AWS CDK',
  jsiiVersion: '5.x',
  cdkVersion: '2.133.0',
  name: 'cloudstructs',
  repository: 'https://github.com/jogold/cloudstructs.git',
  peerDeps: [],
  bundledDeps: [
    'got',
    '@slack/web-api',
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
    '@aws-sdk/client-textract',
    '@aws-sdk/lib-dynamodb',
    '@types/aws-lambda',
    '@types/mjml',
    '@types/tsscmp',
    'aws-sdk-client-mock',
    'aws-sdk-client-mock-jest',
    'nock',
  ],
  defaultReleaseBranch: 'master',
  releaseToNpm: true,
  publishToPypi: {
    distName: 'cloudstructs',
    module: 'cloudstructs',
  },
  publishToGo: {
    moduleName: 'github.com/jogold/cloudstructs-go',
  },
  publishToMaven: {
    mavenGroupId: 'io.github.jogold',
    javaPackage: 'io.github.jogold.cloudstructs',
    mavenArtifactId: 'cloudstructs',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  lambdaOptions: {
    runtime: awscdk.LambdaRuntime.NODEJS_20_X,
  },
});

// Update integ test snapshots after upgrade
project.upgradeWorkflow?.postUpgradeTask.spawn(project.tasks.tryFind('bundle'));
project.upgradeWorkflow?.postUpgradeTask.spawn(project.tasks.tryFind('integ:snapshot-all'));

// Add "exports"
const packageExports = {
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
project.tryFindObjectFile('package.json').addOverride('exports', packageExports);

project.synth();
