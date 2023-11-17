// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for ShortenerFunction
 */
export interface ShortenerFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/url-shortener/shortener.
 */
export class ShortenerFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: ShortenerFunctionProps) {
    super(scope, id, {
      description: 'src/url-shortener/shortener.lambda.ts',
      ...props,
      runtime: new lambda.Runtime('nodejs20.x', lambda.RuntimeFamily.NODEJS),
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/url-shortener/shortener.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}