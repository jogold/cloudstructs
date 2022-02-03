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
});

// Add "exports"
const packageExports = {
  '.': './lib/index.js',
  './package.json': './package.json',
  './.jsii': './.jsii',
};
for (const dirent of fs.readdirSync('./src', { withFileTypes: true })) {
  if (dirent.isDirectory()) {
    const construct = dirent.name;
    packageExports[`./${construct}`] = `./lib/${construct}/index.js`;
  }
}
project.tryFindObjectFile('package.json').addOverride('exports', packageExports);

project.synth();
