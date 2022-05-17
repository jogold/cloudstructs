import { Duration, Fn, RemovalPolicy } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { RedirectFunction } from './redirect-function';
import { ShortenerFunction } from './shortener-function';

/**
 * Properties for a UrlShortener
 */
export interface UrlShortenerProps {
  /**
   * The hosted zone for the short URLs domain
   */
  readonly hostedZone: route53.IHostedZone;

  /**
   * The record name to use in the hosted zone
   *
   * @default - zone root
   */
  readonly recordName?: string;

  /**
   * Expiration for short urls
   *
   * @default cdk.Duration.days(365)
   */
  readonly expiration?: Duration;

  /**
   * An interface VPC endpoint for API gateway. Specifying this property will
   * make the API private.
   *
   * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html
   *
   * @default - API is public
   */
  readonly apiGatewayEndpoint?: ec2.IInterfaceVpcEndpoint;

  /**
   * Authorizer for API gateway.
   *
   * @default - do not use an authorizer for the API
   */
  readonly apiGatewayAuthorizer?: apigateway.IAuthorizer;

  /**
   * Allowed origins for CORS
   *
   * @default - CORS is not enabled
   */
  readonly corsAllowOrigins?: string[];

  /**
   * A name for the bucket saving the redirects
   *
   * @default - derived from short link domain name
   */
  readonly bucketName?: string;
}

/**
 * URL shortener
 */
export class UrlShortener extends Construct {
  /**
   * The endpoint of the URL shortener API
   */
  public readonly apiEndpoint: string;

  /**
   * The underlying API Gateway REST API
   */
  public readonly api: apigateway.LambdaRestApi;

  constructor(scope: Construct, id: string, props: UrlShortenerProps) {
    super(scope, id);

    const domainName = props.recordName ? `${props.recordName}.${props.hostedZone.zoneName}` : props.hostedZone.zoneName;

    // Table to save a counter
    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Bucket to save redirects
    const bucket = new s3.Bucket(this, 'Bucket', {
      lifecycleRules: [{
        expiration: props.expiration ?? Duration.days(365),
      }],
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: props.bucketName ?? `cloudstructs-url-shortener-${domainName}`,
    });

    // Redirect function
    const redirectFunction = new RedirectFunction(this, 'Redirect');
    bucket.grantRead(redirectFunction);

    // const redirectRole = new iam.Role(this, 'RedirectRole', {
    //   assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    // });
    // bucket.grantRead(redirectRole);
    // const redirectApi = new apigateway.RestApi(this, 'RedirectApi', { endpointTypes: [apigateway.EndpointType.REGIONAL] });
    // const linkResource = redirectApi.root.addResource('{link}');
    // linkResource.addMethod('GET', new apigateway.AwsIntegration({
    //   service: 's3',
    //   integrationHttpMethod: 'GET',
    //   path: `${bucket.bucketName}/{link}`,
    //   options: {
    //     credentialsRole: redirectRole,
    //     integrationResponses: [
    //       {
    //         statusCode: '200',
    //         responseTemplates: {
    //           'application/json': [
    //             "#set($url = $input.path('$.url'))",
    //             "#if($url != '')",
    //             '#set($context.responseOverride.header.Location = $url)',
    //             '#set($context.responseOverride.status = 301)',
    //             '#else',
    //             '#set($context.responseOverride.status = 400)',
    //             'Bad Request',
    //             '#end',
    //           ].join('\n'),
    //         },
    //       },
    //       {
    //         statusCode: '404',
    //         selectionPattern: '404',
    //         responseTemplates: {
    //           'application/xml': [
    //             "#set($context.responseOverride.header.Content-Type='text/plain')",
    //             'Not Found',
    //           ].join('\n'),
    //         },
    //       },
    //     ],
    //     requestParameters: {
    //       'integration.request.path.link': 'method.request.path.link',
    //     },
    //   },
    // }), {
    //   requestParameters: {
    //     'method.request.path.link': true,
    //   },
    //   methodResponses: [
    //     { statusCode: '200' },
    //     { statusCode: '404' },
    //   ],
    // });

    // CloudFront distribution
    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName,
      hostedZone: props.hostedZone,
      region: 'us-east-1',
    });
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: redirectFunction,
          },
        ],
      },
      certificate,
      domainNames: [domainName],
    });

    // Route53 records
    new route53.ARecord(this, 'ARecord', {
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: props.recordName,
    });
    new route53.AaaaRecord(this, 'AaaaRecord', {
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: props.recordName,
    });

    // Lambda function to increment counter and write redirect in bucket
    const shortenerFunction = new ShortenerFunction(this, 'Shortener', {
      logRetention: logs.RetentionDays.ONE_MONTH,
      environment: {
        DOMAIN_NAME: domainName,
        BUCKET_NAME: bucket.bucketName,
        TABLE_NAME: table.tableName,
      },
    });
    if (props.corsAllowOrigins) {
      shortenerFunction.addEnvironment('CORS_ALLOW_ORIGINS', props.corsAllowOrigins.join(' '));
    }
    bucket.grantPut(shortenerFunction);
    table.grant(shortenerFunction, 'dynamodb:UpdateItem');

    // API
    this.api = new apigateway.RestApi(this, `UrlShortener${props.hostedZone.zoneName}`, {
      endpointTypes: props.apiGatewayEndpoint ? [apigateway.EndpointType.PRIVATE] : undefined,
      policy: props.apiGatewayEndpoint
        ? new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['execute-api:Invoke'],
              principals: [new iam.AnyPrincipal()],
              resources: [Fn.join('', ['execute-api:/', '*'])],
              conditions: {
                StringEquals: { 'aws:SourceVpce': props.apiGatewayEndpoint.vpcEndpointId },
              },
            }),
          ],
        })
        : undefined,
      defaultCorsPreflightOptions: props.corsAllowOrigins
        ? { allowOrigins: props.corsAllowOrigins }
        : undefined,
    });

    this.api.root.addMethod('ANY', new apigateway.LambdaIntegration(shortenerFunction), {
      authorizer: props.apiGatewayAuthorizer,
    });
    this.api.root
      .addResource('{proxy+}')
      .addMethod('ANY', new apigateway.LambdaIntegration(shortenerFunction), {
        authorizer: props.apiGatewayAuthorizer,
      });

    this.apiEndpoint = this.api.url;
  }
}
