import * as path from 'path';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as route53 from '@aws-cdk/aws-route53';
import * as patterns from '@aws-cdk/aws-route53-patterns';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';

/**
 * Properties for a StaticWebsite
 */
export interface StaticWebsiteProps {
  /**
   * The domain name for this static website
   *
   * @example www.my-static-website.com
   */
  readonly domainName: string;

  /**
   * The hosted zone where records should be added
   */
  readonly hostedZone: route53.IHostedZone;

  /**
   * A backend configuration that will be saved as `config.json`
   * in the S3 bucket of the static website.
   *
   * The frontend can query this config by doing `fetch('/config.json')`.
   *
   * @example { userPoolId: '1234', apiEndoint: 'https://www.my-api.com/api' }
   */
  readonly backendConfiguration?: any;

  /**
   * A list of domain names that should redirect to `domainName`
   *
   * @default - the domain name of the hosted zone
   */
  readonly redirects?: string[];
}

/**
 * A CloudFront static website hosted on S3
 */
export class StaticWebsite extends cdk.Construct {
  /**
   * The CloudFront distribution of this static website
   */
  public readonly distribution: cloudfront.Distribution;

  /**
   * The S3 bucket of this static website
   */
  public readonly bucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: StaticWebsiteProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      region: 'us-east-1',
    });

    const originRequest = new cloudfront.experimental.EdgeFunction(this, 'OriginRequest', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'origin-request-handler')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: originRequest,
          },
        ],
      },
      defaultRootObject: 'index.html',
      domainNames: [props.domainName],
      certificate,
    });

    new route53.ARecord(this, 'ARecord', {
      recordName: props.domainName,
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this.distribution)),
    });

    new route53.AaaaRecord(this, 'AaaaRecord', {
      recordName: props.domainName,
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this.distribution)),
    });

    if (props.backendConfiguration) {
    // Save backend config to bucket, can be queried by the frontend
      new cr.AwsCustomResource(this, 'PutConfig', {
        policy: cr.AwsCustomResourcePolicy.fromStatements([
          new iam.PolicyStatement({
            actions: ['s3:PutObject'],
            resources: [this.bucket.arnForObjects('config.json')],
          }),
        ]),
        onUpdate: {
          service: 'S3',
          action: 'putObject',
          parameters: {
            Bucket: this.bucket.bucketName,
            Key: 'config.json',
            Body: cdk.Stack.of(this).toJsonString(props.backendConfiguration),
            ContentType: 'application/json',
            CacheControl: 'max-age=0, no-cache, no-store, must-revalidate',
          },
          physicalResourceId: cr.PhysicalResourceId.of('config'),
        },
      });
    }

    if (!props.redirects || props.redirects.length !== 0) {
      new patterns.HttpsRedirect(this, 'HttpsRedirect', {
        targetDomain: props.domainName,
        zone: props.hostedZone,
        recordNames: props.redirects,
      });
    }
  }
}
