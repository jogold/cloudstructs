// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Props for GetStackNamesFunction
 */
export interface GetStackNamesFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/toolkit-cleaner/get-stack-names.
 */
export class GetStackNamesFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: GetStackNamesFunctionProps) {
    super(scope, id, {
      description: 'src/toolkit-cleaner/get-stack-names.lambda.ts',
      ...props,
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/toolkit-cleaner/get-stack-names.lambda')),
    });
    this.addEnvironment('AWS_NODEJS_CONNECTION_REUSE_ENABLED', '1', { removeInEdge: true });
  }
}