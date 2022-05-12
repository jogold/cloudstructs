import { App, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { UrlShortener } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'UserPool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const urlShortener = new UrlShortener(this, 'UrlShortener', {
      hostedZone: route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
        hostedZoneId: 'ZKEU89CLZS8GH',
        zoneName: 'goldex.be',
      }),
      recordName: 'short',
      apiGatewayAuthorizer: new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
        cognitoUserPools: [userPool],
      }),
      corsAllowOrigins: ['*'],
    });

    const bucket = urlShortener.node.tryFindChild('Bucket') as s3.Bucket;
    bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
    const table = urlShortener.node.tryFindChild('Table') as dynamodb.Table;
    table.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new CfnOutput(this, 'ApiEndpoint', { value: urlShortener.apiEndpoint });
  }
}

const app = new App();
new TestStack(app, 'url-shortener-integ', {
  env: {
    region: 'eu-west-1',
  },
});
app.synth();
