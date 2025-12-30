import { Duration, Stack, Token } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as patterns from 'aws-cdk-lib/aws-route53-patterns';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { OriginRequestFunction } from './origin-request-function';

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

  /**
   * Response headers policy for the default behavior
   *
   * @default - a new policy is created with best practice security headers
   */
  readonly responseHeadersPolicy?: cloudfront.ResponseHeadersPolicy;

  /**
   * Cache policy for the default behavior
   *
   * @default CachePolicy.CACHING_OPTIMIZED
   */
  readonly cachePolicy?: cloudfront.ICachePolicy;

  /**
   * The Lambda@Edge functions to invoke before serving the contents.
   *
   * @default - an origin request function that redirects all requests for a path to /index.html
   */
  readonly edgeLambdas?: cloudfront.EdgeLambda[];
}

/**
 * A CloudFront static website hosted on S3
 */
export class StaticWebsite extends Construct {
  /**
  * Best practice security headers used as default
  */
  public static defaultSecurityHeadersBehavior: cloudfront.ResponseSecurityHeadersBehavior = {
    contentTypeOptions: {
      override: true,
    },
    frameOptions: {
      frameOption: cloudfront.HeadersFrameOption.DENY,
      override: true,
    },
    referrerPolicy: {
      referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
      override: true,
    },
    strictTransportSecurity: {
      accessControlMaxAge: Duration.seconds(31536000),
      includeSubdomains: true,
      preload: true,
      override: true,
    },
    xssProtection: {
      protection: true,
      modeBlock: true,
      override: true,
    },
  };

  /**
   * The CloudFront distribution of this static website
   */
  public readonly distribution: cloudfront.Distribution;

  /**
   * The S3 bucket of this static website
   */
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: StaticWebsiteProps) {
    super(scope, id);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const certificate = new acm.DnsValidatedCertificate(this, 'Certificate', {
      domainName: props.domainName,
      hostedZone: props.hostedZone,
      region: 'us-east-1',
    });

    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: props.edgeLambdas ?? [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: new OriginRequestFunction(this, 'OriginRequest'),
          },
        ],
        responseHeadersPolicy: props.responseHeadersPolicy ?? new cloudfront.ResponseHeadersPolicy(this, 'ResponseHeadersPolicy', {
          securityHeadersBehavior: StaticWebsite.defaultSecurityHeadersBehavior,
        }),
        cachePolicy: props.cachePolicy,
      },
      defaultRootObject: 'index.html',
      domainNames: [props.domainName],
      certificate: acm.Certificate.fromCertificateArn(this, 'Cert', certificate.certificateArn),
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: 'http2and3' as cloudfront.HttpVersion,
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

    new route53.RecordSet(this, 'HttpsRecord', {
      recordType: 'HTTPS' as route53.RecordType,
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
            Body: Stack.of(this).toJsonString(props.backendConfiguration),
            ContentType: 'application/json',
            CacheControl: 'max-age=0, no-cache, no-store, must-revalidate',
          },
          physicalResourceId: cr.PhysicalResourceId.of('config'),
        },
      });
    }

    if (shouldAddRedirect(props)) {
      const httpsRedirect = new patterns.HttpsRedirect(this, 'HttpsRedirect', {
        targetDomain: props.domainName,
        zone: props.hostedZone,
        recordNames: props.redirects,
      });
      // Force minimum protocol version
      const redirectDistribution = httpsRedirect.node.tryFindChild('RedirectDistribution') as cloudfront.CloudFrontWebDistribution;
      const cfnDistribution = redirectDistribution.node.tryFindChild('CFDistribution') as cloudfront.CfnDistribution;
      cfnDistribution.addPropertyOverride('DistributionConfig.ViewerCertificate.MinimumProtocolVersion', 'TLSv1.2_2021');
      cfnDistribution.addPropertyOverride('DistributionConfig.HttpVersion', 'http2and3');
    }
  }
}

function shouldAddRedirect(props: StaticWebsiteProps): boolean {
  if (props.redirects && props.redirects.length === 0) {
    return false;
  }

  if (!props.redirects && !Token.isUnresolved(props.domainName)
      && !Token.isUnresolved(props.hostedZone.zoneName)
      && props.domainName === props.hostedZone.zoneName) {
    return false;
  }

  return true;
}
