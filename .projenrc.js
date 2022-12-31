const fs = require('fs');
const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  authorAddress: 'jonathan.goldwasser@gmail.com',
  authorName: 'Jonathan Goldwasser',
  description: 'High-level constructs for AWS CDK',
  cdkVersion: '2.1.0',
  name: 'cloudstructs',
  repository: 'https://github.com/jogold/cloudstructs.git',
  peerDeps: [
    '@aws-cdk/aws-apigatewayv2-alpha@^2.1.0-alpha.0',
    '@aws-cdk/aws-apigatewayv2-integrations-alpha@^2.1.0-alpha.0',
  ],
  bundledDeps: [
    'got',
    '@slack/web-api',
  ],
  devDeps: [
    '@types/aws-lambda',
    '@types/tsscmp',
    'aws-sdk',
    'aws-sdk-mock',
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
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
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
