# API Reference

**Classes**

Name|Description
----|-----------
[CodeCommitMirror](#cloudstructs-codecommitmirror)|Mirror a repository to AWS CodeCommit on schedule.
[CodeCommitMirrorSourceRepository](#cloudstructs-codecommitmirrorsourcerepository)|A source repository for AWS CodeCommit mirroring.
[EcsServiceRoller](#cloudstructs-ecsserviceroller)|Roll your ECS service tasks on schedule or with a rule.
[EmailReceiver](#cloudstructs-emailreceiver)|Receive emails through SES, save them to S3 and invokes a Lambda function.
[RollTrigger](#cloudstructs-rolltrigger)|The rule or schedule that should trigger a roll.
[SamlFederatedPrincipal](#cloudstructs-samlfederatedprincipal)|Principal entity that represents a SAML federated identity provider.
[SamlIdentityProvider](#cloudstructs-samlidentityprovider)|Create a SAML identity provider.
[SlackEvents](#cloudstructs-slackevents)|Send Slack events to Amazon EventBridge.
[SlackTextract](#cloudstructs-slacktextract)|Extract text from images posted to Slack using Amazon Textract.
[StateMachineCustomResourceProvider](#cloudstructs-statemachinecustomresourceprovider)|A state machine custom resource provider.
[StaticWebsite](#cloudstructs-staticwebsite)|A CloudFront static website hosted on S3.
[UrlShortener](#cloudstructs-urlshortener)|URL shortener.


**Structs**

Name|Description
----|-----------
[CodeCommitMirrorProps](#cloudstructs-codecommitmirrorprops)|Properties for a CodeCommitMirror.
[EcsServiceRollerProps](#cloudstructs-ecsservicerollerprops)|Properties for a EcsServiceRoller.
[EmailReceiverProps](#cloudstructs-emailreceiverprops)|Properties for an EmailReceiver.
[SamlIdentityProviderProps](#cloudstructs-samlidentityproviderprops)|Properties for a SamlProvider.
[SlackEventsProps](#cloudstructs-slackeventsprops)|Properties for a SlackEvents.
[SlackTextractProps](#cloudstructs-slacktextractprops)|Properties for a SlackTextract.
[StateMachineCustomResourceProviderProps](#cloudstructs-statemachinecustomresourceproviderprops)|Properties for a StateMachineCustomResourceProvider.
[StaticWebsiteProps](#cloudstructs-staticwebsiteprops)|Properties for a StaticWebsite.
[UrlShortenerProps](#cloudstructs-urlshortenerprops)|Properties for a UrlShortener.


**Interfaces**

Name|Description
----|-----------
[IStateMachine](#cloudstructs-istatemachine)|A State Machine.



## class CodeCommitMirror  <a id="cloudstructs-codecommitmirror"></a>

Mirror a repository to AWS CodeCommit on schedule.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new CodeCommitMirror(scope: Construct, id: string, props: CodeCommitMirrorProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[CodeCommitMirrorProps](#cloudstructs-codecommitmirrorprops)</code>)  *No description*
  * **cluster** (<code>[aws_ecs.ICluster](#aws-cdk-lib-aws-ecs-icluster)</code>)  The ECS cluster where to run the mirroring operation. 
  * **repository** (<code>[CodeCommitMirrorSourceRepository](#cloudstructs-codecommitmirrorsourcerepository)</code>)  The source repository. 
  * **schedule** (<code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code>)  The schedule for the mirroring operation. __*Default*__: everyday at midnight
  * **subnetSelection** (<code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code>)  Where to run the mirroring Fargate tasks. __*Default*__: public subnets




## class CodeCommitMirrorSourceRepository  <a id="cloudstructs-codecommitmirrorsourcerepository"></a>

A source repository for AWS CodeCommit mirroring.


### Initializer




```ts
new CodeCommitMirrorSourceRepository()
```




### Properties


Name | Type | Description 
-----|------|-------------
**name** | <code>string</code> | The name of the repository.
**plainTextUrl**? | <code>string</code> | The HTTPS clone URL in plain text, used for a public repository.<br/>__*Optional*__
**secretUrl**? | <code>[aws_ecs.Secret](#aws-cdk-lib-aws-ecs-secret)</code> | The HTTPS clone URL if the repository is private.<br/>__*Optional*__

### Methods


#### *static* gitHub(owner, name) <a id="cloudstructs-codecommitmirrorsourcerepository-github"></a>

Public GitHub repository.

```ts
static gitHub(owner: string, name: string): CodeCommitMirrorSourceRepository
```

* **owner** (<code>string</code>)  *No description*
* **name** (<code>string</code>)  *No description*

__Returns__:
* <code>[CodeCommitMirrorSourceRepository](#cloudstructs-codecommitmirrorsourcerepository)</code>

#### *static* private(name, url) <a id="cloudstructs-codecommitmirrorsourcerepository-private"></a>

Private repository with HTTPS clone URL stored in a AWS Secrets Manager secret or a AWS Systems Manager secure string parameter.

```ts
static private(name: string, url: Secret): CodeCommitMirrorSourceRepository
```

* **name** (<code>string</code>)  the repository name.
* **url** (<code>[aws_ecs.Secret](#aws-cdk-lib-aws-ecs-secret)</code>)  the secret containing the HTTPS clone URL.

__Returns__:
* <code>[CodeCommitMirrorSourceRepository](#cloudstructs-codecommitmirrorsourcerepository)</code>



## class EcsServiceRoller  <a id="cloudstructs-ecsserviceroller"></a>

Roll your ECS service tasks on schedule or with a rule.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new EcsServiceRoller(scope: Construct, id: string, props: EcsServiceRollerProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EcsServiceRollerProps](#cloudstructs-ecsservicerollerprops)</code>)  *No description*
  * **cluster** (<code>[aws_ecs.ICluster](#aws-cdk-lib-aws-ecs-icluster)</code>)  The ECS cluster where the services run. 
  * **service** (<code>[aws_ecs.IService](#aws-cdk-lib-aws-ecs-iservice)</code>)  The ECS service for which tasks should be rolled. 
  * **trigger** (<code>[RollTrigger](#cloudstructs-rolltrigger)</code>)  The rule or schedule that should trigger a roll. __*Default*__: roll everyday at midnight




## class EmailReceiver  <a id="cloudstructs-emailreceiver"></a>

Receive emails through SES, save them to S3 and invokes a Lambda function.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new EmailReceiver(scope: Construct, id: string, props: EmailReceiverProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EmailReceiverProps](#cloudstructs-emailreceiverprops)</code>)  *No description*
  * **function** (<code>[aws_lambda.IFunction](#aws-cdk-lib-aws-lambda-ifunction)</code>)  A Lambda function to invoke after the message is saved to S3. 
  * **receiptRuleSet** (<code>[aws_ses.IReceiptRuleSet](#aws-cdk-lib-aws-ses-ireceiptruleset)</code>)  The SES receipt rule set where a receipt rule will be added. 
  * **recipients** (<code>Array<string></code>)  The recipients for which emails should be received. 
  * **afterRule** (<code>[aws_ses.IReceiptRule](#aws-cdk-lib-aws-ses-ireceiptrule)</code>)  An existing rule after which the new rule will be placed in the rule set. __*Default*__: The new rule is inserted at the beginning of the rule list.
  * **sourceWhitelist** (<code>string</code>)  A regular expression to whitelist source email addresses. __*Default*__: no whitelisting of source email addresses




## class RollTrigger  <a id="cloudstructs-rolltrigger"></a>

The rule or schedule that should trigger a roll.


### Initializer




```ts
new RollTrigger()
```




### Properties


Name | Type | Description 
-----|------|-------------
**rule**? | <code>[aws_events.Rule](#aws-cdk-lib-aws-events-rule)</code> | Roll rule.<br/>__*Default*__: roll everyday at midnight
**schedule**? | <code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code> | Roll schedule.<br/>__*Default*__: roll everyday at midnight

### Methods


#### *static* fromRule(rule) <a id="cloudstructs-rolltrigger-fromrule"></a>

Rule that should trigger a roll.

```ts
static fromRule(rule: Rule): RollTrigger
```

* **rule** (<code>[aws_events.Rule](#aws-cdk-lib-aws-events-rule)</code>)  *No description*

__Returns__:
* <code>[RollTrigger](#cloudstructs-rolltrigger)</code>

#### *static* fromSchedule(schedule) <a id="cloudstructs-rolltrigger-fromschedule"></a>

Schedule that should trigger a roll.

```ts
static fromSchedule(schedule: Schedule): RollTrigger
```

* **schedule** (<code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code>)  *No description*

__Returns__:
* <code>[RollTrigger](#cloudstructs-rolltrigger)</code>



## class SamlFederatedPrincipal ⚠️ <a id="cloudstructs-samlfederatedprincipal"></a>

Principal entity that represents a SAML federated identity provider.

__Implements__: [aws_iam.IPrincipal](#aws-cdk-lib-aws-iam-iprincipal), [aws_iam.IGrantable](#aws-cdk-lib-aws-iam-igrantable)
__Extends__: [aws_iam.FederatedPrincipal](#aws-cdk-lib-aws-iam-federatedprincipal)

### Initializer




```ts
new SamlFederatedPrincipal(identityProvider: SamlIdentityProvider)
```

* **identityProvider** (<code>[SamlIdentityProvider](#cloudstructs-samlidentityprovider)</code>)  *No description*




## class SamlIdentityProvider ⚠️ <a id="cloudstructs-samlidentityprovider"></a>

Create a SAML identity provider.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new SamlIdentityProvider(scope: Construct, id: string, props: SamlIdentityProviderProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SamlIdentityProviderProps](#cloudstructs-samlidentityproviderprops)</code>)  *No description*
  * **metadataDocument** (<code>string</code>)  An XML document generated by an identity provider (IdP) that supports SAML 2.0. 
  * **name** (<code>string</code>)  A name for the SAML identity provider. __*Default*__: derived for the node's unique id



### Properties


Name | Type | Description 
-----|------|-------------
**samlIdentityProviderArn**⚠️ | <code>string</code> | The ARN of the SAML identity provider.



## class SlackEvents  <a id="cloudstructs-slackevents"></a>

Send Slack events to Amazon EventBridge.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new SlackEvents(scope: Construct, id: string, props: SlackEventsProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackEventsProps](#cloudstructs-slackeventsprops)</code>)  *No description*
  * **signingSecret** (<code>[SecretValue](#aws-cdk-lib-secretvalue)</code>)  The signing secret of the Slack app. 
  * **apiName** (<code>string</code>)  A name for the API Gateway resource. __*Default*__: SlackEventsApi
  * **customEventBus** (<code>boolean</code>)  Whether to use a custom event bus. __*Default*__: false



### Properties


Name | Type | Description 
-----|------|-------------
**eventBus**? | <code>[aws_events.EventBus](#aws-cdk-lib-aws-events-eventbus)</code> | The custom event bus where Slack events are sent.<br/>__*Optional*__



## class SlackTextract  <a id="cloudstructs-slacktextract"></a>

Extract text from images posted to Slack using Amazon Textract.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new SlackTextract(scope: Construct, id: string, props: SlackTextractProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackTextractProps](#cloudstructs-slacktextractprops)</code>)  *No description*
  * **appId** (<code>string</code>)  The application id of the Slack app. 
  * **botToken** (<code>[SecretValue](#aws-cdk-lib-secretvalue)</code>)  The **bot** token of the Slack app. 
  * **signingSecret** (<code>[SecretValue](#aws-cdk-lib-secretvalue)</code>)  The signing secret of the Slack app. 




## class StateMachineCustomResourceProvider  <a id="cloudstructs-statemachinecustomresourceprovider"></a>

A state machine custom resource provider.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new StateMachineCustomResourceProvider(scope: Construct, id: string, props: StateMachineCustomResourceProviderProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[StateMachineCustomResourceProviderProps](#cloudstructs-statemachinecustomresourceproviderprops)</code>)  *No description*
  * **stateMachine** (<code>[IStateMachine](#cloudstructs-istatemachine)</code>)  The state machine. 
  * **timeout** (<code>[Duration](#aws-cdk-lib-duration)</code>)  Timeout. __*Default*__: Duration.minutes(30)



### Properties


Name | Type | Description 
-----|------|-------------
**serviceToken** | <code>string</code> | The service token.



## class StaticWebsite  <a id="cloudstructs-staticwebsite"></a>

A CloudFront static website hosted on S3.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new StaticWebsite(scope: Construct, id: string, props: StaticWebsiteProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[StaticWebsiteProps](#cloudstructs-staticwebsiteprops)</code>)  *No description*
  * **domainName** (<code>string</code>)  The domain name for this static website. 
  * **hostedZone** (<code>[aws_route53.IHostedZone](#aws-cdk-lib-aws-route53-ihostedzone)</code>)  The hosted zone where records should be added. 
  * **backendConfiguration** (<code>any</code>)  A backend configuration that will be saved as `config.json` in the S3 bucket of the static website. __*Optional*__
  * **httpHeaders** (<code>Map<string, string></code>)  Custom HTTP headers. __*Default*__: best practice security headers
  * **redirects** (<code>Array<string></code>)  A list of domain names that should redirect to `domainName`. __*Default*__: the domain name of the hosted zone



### Properties


Name | Type | Description 
-----|------|-------------
**bucket** | <code>[aws_s3.Bucket](#aws-cdk-lib-aws-s3-bucket)</code> | The S3 bucket of this static website.
**distribution** | <code>[aws_cloudfront.Distribution](#aws-cdk-lib-aws-cloudfront-distribution)</code> | The CloudFront distribution of this static website.



## class UrlShortener  <a id="cloudstructs-urlshortener"></a>

URL shortener.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new UrlShortener(scope: Construct, id: string, props: UrlShortenerProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[UrlShortenerProps](#cloudstructs-urlshortenerprops)</code>)  *No description*
  * **hostedZone** (<code>[aws_route53.IHostedZone](#aws-cdk-lib-aws-route53-ihostedzone)</code>)  The hosted zone for the short URLs domain. 
  * **apiGatewayEndpoint** (<code>[aws_ec2.IInterfaceVpcEndpoint](#aws-cdk-lib-aws-ec2-iinterfacevpcendpoint)</code>)  An interface VPC endpoint for API gateway. __*Default*__: API is public
  * **expiration** (<code>[Duration](#aws-cdk-lib-duration)</code>)  Expiration for short urls. __*Default*__: cdk.Duration.days(365)



### Properties


Name | Type | Description 
-----|------|-------------
**api** | <code>[aws_apigateway.LambdaRestApi](#aws-cdk-lib-aws-apigateway-lambdarestapi)</code> | The underlying API Gateway REST API.
**apiEndpoint** | <code>string</code> | The endpoint of the URL shortener API.



## struct CodeCommitMirrorProps  <a id="cloudstructs-codecommitmirrorprops"></a>


Properties for a CodeCommitMirror.



Name | Type | Description 
-----|------|-------------
**cluster** | <code>[aws_ecs.ICluster](#aws-cdk-lib-aws-ecs-icluster)</code> | The ECS cluster where to run the mirroring operation.
**repository** | <code>[CodeCommitMirrorSourceRepository](#cloudstructs-codecommitmirrorsourcerepository)</code> | The source repository.
**schedule**? | <code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code> | The schedule for the mirroring operation.<br/>__*Default*__: everyday at midnight
**subnetSelection**? | <code>[aws_ec2.SubnetSelection](#aws-cdk-lib-aws-ec2-subnetselection)</code> | Where to run the mirroring Fargate tasks.<br/>__*Default*__: public subnets



## struct EcsServiceRollerProps  <a id="cloudstructs-ecsservicerollerprops"></a>


Properties for a EcsServiceRoller.



Name | Type | Description 
-----|------|-------------
**cluster** | <code>[aws_ecs.ICluster](#aws-cdk-lib-aws-ecs-icluster)</code> | The ECS cluster where the services run.
**service** | <code>[aws_ecs.IService](#aws-cdk-lib-aws-ecs-iservice)</code> | The ECS service for which tasks should be rolled.
**trigger**? | <code>[RollTrigger](#cloudstructs-rolltrigger)</code> | The rule or schedule that should trigger a roll.<br/>__*Default*__: roll everyday at midnight



## struct EmailReceiverProps  <a id="cloudstructs-emailreceiverprops"></a>


Properties for an EmailReceiver.



Name | Type | Description 
-----|------|-------------
**function** | <code>[aws_lambda.IFunction](#aws-cdk-lib-aws-lambda-ifunction)</code> | A Lambda function to invoke after the message is saved to S3.
**receiptRuleSet** | <code>[aws_ses.IReceiptRuleSet](#aws-cdk-lib-aws-ses-ireceiptruleset)</code> | The SES receipt rule set where a receipt rule will be added.
**recipients** | <code>Array<string></code> | The recipients for which emails should be received.
**afterRule**? | <code>[aws_ses.IReceiptRule](#aws-cdk-lib-aws-ses-ireceiptrule)</code> | An existing rule after which the new rule will be placed in the rule set.<br/>__*Default*__: The new rule is inserted at the beginning of the rule list.
**sourceWhitelist**? | <code>string</code> | A regular expression to whitelist source email addresses.<br/>__*Default*__: no whitelisting of source email addresses



## interface IStateMachine  <a id="cloudstructs-istatemachine"></a>


A State Machine.

### Properties


Name | Type | Description 
-----|------|-------------
**stateMachineArn** | <code>string</code> | The ARN of the state machine.



## struct SamlIdentityProviderProps ⚠️ <a id="cloudstructs-samlidentityproviderprops"></a>


Properties for a SamlProvider.



Name | Type | Description 
-----|------|-------------
**metadataDocument**⚠️ | <code>string</code> | An XML document generated by an identity provider (IdP) that supports SAML 2.0.
**name**?⚠️ | <code>string</code> | A name for the SAML identity provider.<br/>__*Default*__: derived for the node's unique id



## struct SlackEventsProps  <a id="cloudstructs-slackeventsprops"></a>


Properties for a SlackEvents.



Name | Type | Description 
-----|------|-------------
**signingSecret** | <code>[SecretValue](#aws-cdk-lib-secretvalue)</code> | The signing secret of the Slack app.
**apiName**? | <code>string</code> | A name for the API Gateway resource.<br/>__*Default*__: SlackEventsApi
**customEventBus**? | <code>boolean</code> | Whether to use a custom event bus.<br/>__*Default*__: false



## struct SlackTextractProps  <a id="cloudstructs-slacktextractprops"></a>


Properties for a SlackTextract.



Name | Type | Description 
-----|------|-------------
**appId** | <code>string</code> | The application id of the Slack app.
**botToken** | <code>[SecretValue](#aws-cdk-lib-secretvalue)</code> | The **bot** token of the Slack app.
**signingSecret** | <code>[SecretValue](#aws-cdk-lib-secretvalue)</code> | The signing secret of the Slack app.



## struct StateMachineCustomResourceProviderProps  <a id="cloudstructs-statemachinecustomresourceproviderprops"></a>


Properties for a StateMachineCustomResourceProvider.



Name | Type | Description 
-----|------|-------------
**stateMachine** | <code>[IStateMachine](#cloudstructs-istatemachine)</code> | The state machine.
**timeout**? | <code>[Duration](#aws-cdk-lib-duration)</code> | Timeout.<br/>__*Default*__: Duration.minutes(30)



## struct StaticWebsiteProps  <a id="cloudstructs-staticwebsiteprops"></a>


Properties for a StaticWebsite.



Name | Type | Description 
-----|------|-------------
**domainName** | <code>string</code> | The domain name for this static website.
**hostedZone** | <code>[aws_route53.IHostedZone](#aws-cdk-lib-aws-route53-ihostedzone)</code> | The hosted zone where records should be added.
**backendConfiguration**? | <code>any</code> | A backend configuration that will be saved as `config.json` in the S3 bucket of the static website.<br/>__*Optional*__
**httpHeaders**? | <code>Map<string, string></code> | Custom HTTP headers.<br/>__*Default*__: best practice security headers
**redirects**? | <code>Array<string></code> | A list of domain names that should redirect to `domainName`.<br/>__*Default*__: the domain name of the hosted zone



## struct UrlShortenerProps  <a id="cloudstructs-urlshortenerprops"></a>


Properties for a UrlShortener.



Name | Type | Description 
-----|------|-------------
**hostedZone** | <code>[aws_route53.IHostedZone](#aws-cdk-lib-aws-route53-ihostedzone)</code> | The hosted zone for the short URLs domain.
**apiGatewayEndpoint**? | <code>[aws_ec2.IInterfaceVpcEndpoint](#aws-cdk-lib-aws-ec2-iinterfacevpcendpoint)</code> | An interface VPC endpoint for API gateway.<br/>__*Default*__: API is public
**expiration**? | <code>[Duration](#aws-cdk-lib-duration)</code> | Expiration for short urls.<br/>__*Default*__: cdk.Duration.days(365)



