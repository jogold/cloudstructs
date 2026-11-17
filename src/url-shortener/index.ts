import { Duration, Fn, Stack, Token } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
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
   * The ACM certificate to use for the CloudFront distribution.
   * Must be in us-east-1.
   */
  readonly certificate: acm.ICertificate;

  /**
   * The record name to use in the hosted zone
   *
   * @default - zone root
   */
  readonly recordName?: string;

  /**
   * Expiration for short urls
   *
   * This is the lifecycle of the objects holding the redirects, in whole days.
   * To stop a link at a precise time, use `linkTtl`.
   *
   * @default - one day more than `linkTtl` rounded up to days when `linkTtl` is set, cdk.Duration.days(365) otherwise
   */
  readonly expiration?: Duration;

  /**
   * Regular expressions a URL must match to be shortened
   *
   * Each pattern is tested against the whole URL, and a URL matching none of them
   * is refused with a 400. Anchor each pattern up to the `/` after the host
   * (`^https://www\.example\.com/`), or a URL on another host can match it.
   *
   * @default - any valid URL can be shortened
   */
  readonly allowedUrlPatterns?: string[];

  /**
   * How long a short link redirects after it was created
   *
   * Once set, links answer a 302 with `Cache-Control: no-store`, CloudFront does not
   * cache them, so that no cache keeps a redirect past this duration, and a 404 after
   * it. Links created before this is set expire as well once older than it.
   *
   * @default - links redirect with a 301 until their object expires (see `expiration`)
   */
  readonly linkTtl?: Duration;

  /**
   * Query parameter to redirect expired links with
   *
   * Instead of a 404, a link past its `linkTtl` redirects to its target URL without
   * the query string and hash, with this parameter set to `1`. The target page can
   * then explain that the link expired, without receiving what the query carried.
   * Requires `linkTtl`, and an `expiration` at least a day longer, so that the object
   * is still there to redirect from.
   *
   * @default - expired links answer a 404
   */
  readonly expiredRedirectQueryParameter?: string;

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
   * Whether to use IAM authorization
   *
   * @default - do not use IAM authorization
   */
  readonly iamAuthorization?: boolean;

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
  public readonly api: apigateway.RestApi;

  private readonly iamAuthorization?: boolean;

  constructor(scope: Construct, id: string, props: UrlShortenerProps) {
    super(scope, id);

    const domainName = props.recordName ? `${props.recordName}.${props.hostedZone.zoneName}` : props.hostedZone.zoneName;

    if (props.expiredRedirectQueryParameter && !props.linkTtl) {
      throw new Error('`expiredRedirectQueryParameter` requires `linkTtl`');
    }

    if (props.linkTtl && props.expiration && props.expiration.toSeconds() < props.linkTtl.toSeconds()) {
      throw new Error('`expiration` cannot be shorter than `linkTtl`');
    }

    if (props.expiredRedirectQueryParameter && props.linkTtl && props.expiration
      && props.expiration.toSeconds() < props.linkTtl.toSeconds() + Duration.days(1).toSeconds()) {
      throw new Error('`expiration` must be at least a day longer than `linkTtl` with `expiredRedirectQueryParameter`');
    }

    if (props.allowedUrlPatterns && props.allowedUrlPatterns.length === 0) {
      throw new Error('`allowedUrlPatterns` cannot be empty, leave it out to allow any URL');
    }

    for (const pattern of props.allowedUrlPatterns ?? []) {
      if (!Token.isUnresolved(pattern)) {
        new RegExp(pattern); // throws at synth on an invalid pattern
      }
    }

    // Bucket to save redirects
    const bucket = new s3.Bucket(this, 'Bucket', {
      lifecycleRules: [{
        expiration: props.expiration ?? (props.linkTtl
          ? Duration.days(Math.ceil(props.linkTtl.toSeconds() / 86400) + 1)
          : Duration.days(365)),
      }],
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: props.bucketName ?? `cloudstructs-url-shortener-${domainName}`,
    });

    // Redirect function
    const redirectFunction = new RedirectFunction(this, 'Redirect', {
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });
    if (props.linkTtl) {
      redirectFunction.addEnvironment('LINK_TTL_SECONDS', props.linkTtl.toSeconds().toString());
    }
    if (props.expiredRedirectQueryParameter) {
      redirectFunction.addEnvironment('EXPIRED_REDIRECT_QUERY_PARAMETER', props.expiredRedirectQueryParameter);
    }
    bucket.grantRead(redirectFunction);

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.FunctionUrlOrigin.withOriginAccessControl(redirectFunction.addFunctionUrl()),
        // A cached redirect would outlive its link
        cachePolicy: props.linkTtl ? cloudfront.CachePolicy.CACHING_DISABLED : undefined,
      },
      certificate: props.certificate,
      domainNames: [domainName],
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
    });

    // Route53 records
    const aliasProps = {
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      recordName: props.recordName,
    };
    new route53.ARecord(this, 'ARecord', aliasProps);
    new route53.AaaaRecord(this, 'AaaaRecord', aliasProps);
    new route53.HttpsRecord(this, 'HttpsRecord', aliasProps);

    // Lambda function to write redirect in bucket under a random key
    const shortenerFunction = new ShortenerFunction(this, 'Shortener', {
      logGroup: new logs.LogGroup(this, 'ShortenerLogGroup', {
        retention: logs.RetentionDays.ONE_MONTH,
      }),
      environment: {
        DOMAIN_NAME: domainName,
        BUCKET_NAME: bucket.bucketName,
      },
    });
    if (props.allowedUrlPatterns) {
      shortenerFunction.addEnvironment('ALLOWED_URL_PATTERNS', Stack.of(this).toJsonString(props.allowedUrlPatterns));
    }
    if (props.corsAllowOrigins) {
      shortenerFunction.addEnvironment('CORS_ALLOW_ORIGINS', props.corsAllowOrigins.join(' '));
    }
    bucket.grantPut(shortenerFunction);

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

    if (props.iamAuthorization && props.apiGatewayAuthorizer) {
      throw new Error('Cannot use both IAM authorization and an authorizer');
    }

    this.iamAuthorization = props.iamAuthorization;

    this.api.root.addMethod('POST', new apigateway.LambdaIntegration(shortenerFunction), {
      authorizer: props.apiGatewayAuthorizer,
      authorizationType: props.iamAuthorization ? apigateway.AuthorizationType.IAM : undefined,
    });
    this.api.root
      .addResource('{proxy+}')
      .addMethod('POST', new apigateway.LambdaIntegration(shortenerFunction), {
        authorizer: props.apiGatewayAuthorizer,
        authorizationType: this.iamAuthorization ? apigateway.AuthorizationType.IAM : undefined,
      });

    this.apiEndpoint = this.api.url;
  }

  /**
   * Grant access to invoke the URL shortener if protected by IAM authorization
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    if (this.iamAuthorization === false) {
      throw new Error('The URL shortener is not protected by IAM authorization');
    }

    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['execute-api:Invoke'],
      resourceArns: [`arn:aws:execute-api:${this.api.env.region}:${this.api.env.account}:${this.api.restApiId}/${this.api.deploymentStage.stageName}/POST/*`],
    });
  }
}
