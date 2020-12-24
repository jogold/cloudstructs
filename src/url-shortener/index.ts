import * as apigateway from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as nodejs from '@aws-cdk/aws-lambda-nodejs';
import * as logs from '@aws-cdk/aws-logs';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';

/**
 * Properties for a UrlShortener
 */
export interface UrlShortenerProps {
  /**
   * The hosted zone for the short URLs domain
   */
  readonly hostedZone: route53.IHostedZone;

  /**
   * Expiration for short urls
   *
   * @default cdk.Duration.days(365)
   */
  readonly expiration?: cdk.Duration;

  /**
   * An interface VPC endpoint for API gateway. Specifying this property will
   * make the API private.
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html
   *
   * @default - API is public
   */
  readonly apiGatewayEndpoint?: ec2.IInterfaceVpcEndpoint;
}

/**
 * URL shortener
 */
export class UrlShortener extends cdk.Construct {
  /**
   * The endpoint of the URL shortener API
   */
  public readonly apiEndpoint: string;

  /**
   * The underlying API Gateway REST API
   */
  public readonly api: apigateway.LambdaRestApi;

  constructor(scope: cdk.Construct, id: string, props: UrlShortenerProps) {
    super(scope, id);

    // Table to save a counter
    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Bucket to save redirects
    const bucket = new s3.Bucket(this, 'Bucket', {
      lifecycleRules: [{
        expiration: props.expiration ?? cdk.Duration.days(365),
      }],
      websiteIndexDocument: 'index.html',
    });

    // CloudFront distribution
    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName: props.hostedZone.zoneName,
      hostedZone: props.hostedZone,
    });
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
      },
      certificate,
      domainNames: [props.hostedZone.zoneName],
    });

    // Route53 records
    new route53.ARecord(this, 'ARecord', {
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });
    new route53.AaaaRecord(this, 'AaaaRecord', {
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Lambda function to increment counter and write redirect in bucket
    const handler = new nodejs.NodejsFunction(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      logRetention: logs.RetentionDays.ONE_MONTH,
      environment: {
        DOMAIN_NAME: props.hostedZone.zoneName,
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
    });
    bucket.grantPut(handler);
    table.grant(handler, 'dynamodb:UpdateItem');

    // API
    this.api = new apigateway.LambdaRestApi(this, `UrlShortener${props.hostedZone.zoneName}`, {
      handler,
      endpointTypes: props.apiGatewayEndpoint ? [apigateway.EndpointType.PRIVATE] : undefined,
      policy: props.apiGatewayEndpoint
        ? new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['execute-api:Invoke'],
              principals: [new iam.AnyPrincipal()],
              resources: [cdk.Fn.join('', ['execute-api:/', '*'])],
              conditions: {
                StringEquals: { 'aws:SourceVpce': props.apiGatewayEndpoint.vpcEndpointId },
              },
            }),
          ],
        })
        : undefined,
    });

    this.apiEndpoint = this.api.url;
  }
}
