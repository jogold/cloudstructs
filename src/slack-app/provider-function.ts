// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for ProviderFunction
 */
export interface ProviderFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/slack-app/provider.
 */
export class ProviderFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: ProviderFunctionProps) {
    super(scope, id, {
      description: 'src/slack-app/provider.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs16.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/slack-app/provider.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}