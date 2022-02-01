// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for CleanImagesFunction
 */
export interface CleanImagesFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/toolkit-cleaner/clean-images.
 */
export class CleanImagesFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: CleanImagesFunctionProps) {
    super(scope, id, {
      description: 'src/toolkit-cleaner/clean-images.lambda.ts',
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/toolkit-cleaner/clean-images.lambda')),
    });
  }
}