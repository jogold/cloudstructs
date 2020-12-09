# API Reference

**Classes**

Name|Description
----|-----------
[EmailReceiver](#cloudstructs-emailreceiver)|Receive emails through SES, save them to S3 and invokes a Lambda function.
[SlackEvents](#cloudstructs-slackevents)|Send Slack events to Amazon EventBridge.
[SlackTextract](#cloudstructs-slacktextract)|Extract text from images posted to Slack using Amazon Textract.
[StateMachineCustomResourceProvider](#cloudstructs-statemachinecustomresourceprovider)|A state machine custom resource provider.
[StaticWebsite](#cloudstructs-staticwebsite)|A CloudFront static website hosted on S3.


**Structs**

Name|Description
----|-----------
[EmailReceiverProps](#cloudstructs-emailreceiverprops)|Properties for an EmailReceiver.
[SlackEventsProps](#cloudstructs-slackeventsprops)|Properties for a SlackEvents.
[SlackTextractProps](#cloudstructs-slacktextractprops)|Properties for a SlackTextract.
[StateMachineCustomResourceProviderProps](#cloudstructs-statemachinecustomresourceproviderprops)|Properties for a StateMachineCustomResourceProvider.
[StaticWebsiteProps](#cloudstructs-staticwebsiteprops)|Properties for a StaticWebsite.


**Interfaces**

Name|Description
----|-----------
[IStateMachine](#cloudstructs-istatemachine)|A State Machine.



## class EmailReceiver  <a id="cloudstructs-emailreceiver"></a>

Receive emails through SES, save them to S3 and invokes a Lambda function.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new EmailReceiver(scope: Construct, id: string, props: EmailReceiverProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EmailReceiverProps](#cloudstructs-emailreceiverprops)</code>)  *No description*
  * **function** (<code>[IFunction](#aws-cdk-aws-lambda-ifunction)</code>)  A Lambda function to invoke after the message is saved to S3. 
  * **receiptRuleSet** (<code>[IReceiptRuleSet](#aws-cdk-aws-ses-ireceiptruleset)</code>)  The SES receipt rule set where a receipt rule will be added. 
  * **recipients** (<code>Array<string></code>)  The recipients for which emails should be received. 
  * **afterRule** (<code>[IReceiptRule](#aws-cdk-aws-ses-ireceiptrule)</code>)  An existing rule after which the new rule will be placed in the rule set. __*Default*__: The new rule is inserted at the beginning of the rule list.
  * **sourceWhitelist** (<code>string</code>)  A regular expression to whitelist source email addresses. __*Default*__: no whitelisting of source email addresses




## class SlackEvents  <a id="cloudstructs-slackevents"></a>

Send Slack events to Amazon EventBridge.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new SlackEvents(scope: Construct, id: string, props: SlackEventsProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackEventsProps](#cloudstructs-slackeventsprops)</code>)  *No description*
  * **signingSecret** (<code>[SecretValue](#aws-cdk-core-secretvalue)</code>)  The signing secret of the Slack app. 
  * **apiName** (<code>string</code>)  A name for the API Gateway resource. __*Default*__: SlackEventsApi
  * **customEventBus** (<code>boolean</code>)  Whether to use a custom event bus. __*Default*__: false



### Properties


Name | Type | Description 
-----|------|-------------
**eventBus**? | <code>[EventBus](#aws-cdk-aws-events-eventbus)</code> | The custom event bus where Slack events are sent.<br/>__*Optional*__



## class SlackTextract  <a id="cloudstructs-slacktextract"></a>

Extract text from images posted to Slack using Amazon Textract.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new SlackTextract(scope: Construct, id: string, props: SlackTextractProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackTextractProps](#cloudstructs-slacktextractprops)</code>)  *No description*
  * **appId** (<code>string</code>)  The application id of the Slack app. 
  * **botToken** (<code>[SecretValue](#aws-cdk-core-secretvalue)</code>)  The **bot** token of the Slack app. 
  * **signingSecret** (<code>[SecretValue](#aws-cdk-core-secretvalue)</code>)  The signing secret of the Slack app. 




## class StateMachineCustomResourceProvider  <a id="cloudstructs-statemachinecustomresourceprovider"></a>

A state machine custom resource provider.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new StateMachineCustomResourceProvider(scope: Construct, id: string, props: StateMachineCustomResourceProviderProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[StateMachineCustomResourceProviderProps](#cloudstructs-statemachinecustomresourceproviderprops)</code>)  *No description*
  * **stateMachine** (<code>[IStateMachine](#cloudstructs-istatemachine)</code>)  The state machine. 
  * **timeout** (<code>[Duration](#aws-cdk-core-duration)</code>)  Timeout. __*Default*__: Duration.minutes(30)



### Properties


Name | Type | Description 
-----|------|-------------
**serviceToken** | <code>string</code> | The service token.



## class StaticWebsite  <a id="cloudstructs-staticwebsite"></a>

A CloudFront static website hosted on S3.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new StaticWebsite(scope: Construct, id: string, props: StaticWebsiteProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[StaticWebsiteProps](#cloudstructs-staticwebsiteprops)</code>)  *No description*
  * **domainName** (<code>string</code>)  The domain name for this static website. 
  * **hostedZone** (<code>[IHostedZone](#aws-cdk-aws-route53-ihostedzone)</code>)  The hosted zone where records should be added. 
  * **backendConfiguration** (<code>any</code>)  A backend configuration that will be saved as `config.json` in the S3 bucket of the static website. __*Optional*__
  * **redirects** (<code>Array<string></code>)  A list of domain names that should redirect to `domainName`. __*Default*__: the domain name of the hosted zone



### Properties


Name | Type | Description 
-----|------|-------------
**bucket** | <code>[Bucket](#aws-cdk-aws-s3-bucket)</code> | The S3 bucket of this static website.
**distribution** | <code>[Distribution](#aws-cdk-aws-cloudfront-distribution)</code> | The CloudFront distribution of this static website.



## struct EmailReceiverProps  <a id="cloudstructs-emailreceiverprops"></a>


Properties for an EmailReceiver.



Name | Type | Description 
-----|------|-------------
**function** | <code>[IFunction](#aws-cdk-aws-lambda-ifunction)</code> | A Lambda function to invoke after the message is saved to S3.
**receiptRuleSet** | <code>[IReceiptRuleSet](#aws-cdk-aws-ses-ireceiptruleset)</code> | The SES receipt rule set where a receipt rule will be added.
**recipients** | <code>Array<string></code> | The recipients for which emails should be received.
**afterRule**? | <code>[IReceiptRule](#aws-cdk-aws-ses-ireceiptrule)</code> | An existing rule after which the new rule will be placed in the rule set.<br/>__*Default*__: The new rule is inserted at the beginning of the rule list.
**sourceWhitelist**? | <code>string</code> | A regular expression to whitelist source email addresses.<br/>__*Default*__: no whitelisting of source email addresses



## interface IStateMachine  <a id="cloudstructs-istatemachine"></a>


A State Machine.

### Properties


Name | Type | Description 
-----|------|-------------
**stateMachineArn** | <code>string</code> | The ARN of the state machine.



## struct SlackEventsProps  <a id="cloudstructs-slackeventsprops"></a>


Properties for a SlackEvents.



Name | Type | Description 
-----|------|-------------
**signingSecret** | <code>[SecretValue](#aws-cdk-core-secretvalue)</code> | The signing secret of the Slack app.
**apiName**? | <code>string</code> | A name for the API Gateway resource.<br/>__*Default*__: SlackEventsApi
**customEventBus**? | <code>boolean</code> | Whether to use a custom event bus.<br/>__*Default*__: false



## struct SlackTextractProps  <a id="cloudstructs-slacktextractprops"></a>


Properties for a SlackTextract.



Name | Type | Description 
-----|------|-------------
**appId** | <code>string</code> | The application id of the Slack app.
**botToken** | <code>[SecretValue](#aws-cdk-core-secretvalue)</code> | The **bot** token of the Slack app.
**signingSecret** | <code>[SecretValue](#aws-cdk-core-secretvalue)</code> | The signing secret of the Slack app.



## struct StateMachineCustomResourceProviderProps  <a id="cloudstructs-statemachinecustomresourceproviderprops"></a>


Properties for a StateMachineCustomResourceProvider.



Name | Type | Description 
-----|------|-------------
**stateMachine** | <code>[IStateMachine](#cloudstructs-istatemachine)</code> | The state machine.
**timeout**? | <code>[Duration](#aws-cdk-core-duration)</code> | Timeout.<br/>__*Default*__: Duration.minutes(30)



## struct StaticWebsiteProps  <a id="cloudstructs-staticwebsiteprops"></a>


Properties for a StaticWebsite.



Name | Type | Description 
-----|------|-------------
**domainName** | <code>string</code> | The domain name for this static website.
**hostedZone** | <code>[IHostedZone](#aws-cdk-aws-route53-ihostedzone)</code> | The hosted zone where records should be added.
**backendConfiguration**? | <code>any</code> | A backend configuration that will be saved as `config.json` in the S3 bucket of the static website.<br/>__*Optional*__
**redirects**? | <code>Array<string></code> | A list of domain names that should redirect to `domainName`.<br/>__*Default*__: the domain name of the hosted zone



