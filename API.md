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
[SlackApp](#cloudstructs-slackapp)|A Slack application deployed with a manifest.
[SlackAppManifest](#cloudstructs-slackappmanifest)|A Slack app manifest.
[SlackAppManifestDefinition](#cloudstructs-slackappmanifestdefinition)|A Slack app manifest definition.
[SlackEvents](#cloudstructs-slackevents)|Send Slack events to Amazon EventBridge.
[SlackTextract](#cloudstructs-slacktextract)|Extract text from images posted to Slack using Amazon Textract.
[SslServerTest](#cloudstructs-sslservertest)|Perform SSL server test for a hostname.
[StateMachineCustomResourceProvider](#cloudstructs-statemachinecustomresourceprovider)|A state machine custom resource provider.
[StaticWebsite](#cloudstructs-staticwebsite)|A CloudFront static website hosted on S3.
[ToolkitCleaner](#cloudstructs-toolkitcleaner)|Clean unused S3 and ECR assets from your CDK Toolkit.
[UrlShortener](#cloudstructs-urlshortener)|URL shortener.


**Structs**

Name|Description
----|-----------
[CodeCommitMirrorProps](#cloudstructs-codecommitmirrorprops)|Properties for a CodeCommitMirror.
[EcsServiceRollerProps](#cloudstructs-ecsservicerollerprops)|Properties for a EcsServiceRoller.
[EmailReceiverProps](#cloudstructs-emailreceiverprops)|Properties for an EmailReceiver.
[SamlIdentityProviderProps](#cloudstructs-samlidentityproviderprops)|Properties for a SamlProvider.
[SlackAppManifestAppHome](#cloudstructs-slackappmanifestapphome)|App Home configuration.
[SlackAppManifestEventSubscriptions](#cloudstructs-slackappmanifesteventsubscriptions)|Events API configuration for the app.
[SlackAppManifestInteractivity](#cloudstructs-slackappmanifestinteractivity)|Interactivity configuration for the app.
[SlackAppManifestOauthConfig](#cloudstructs-slackappmanifestoauthconfig)|OAuth configuration for the app.
[SlackAppManifestProps](#cloudstructs-slackappmanifestprops)|Properties for a Slack app manifest.
[SlackAppManifestSettings](#cloudstructs-slackappmanifestsettings)|Settings section of the app config pages.
[SlackAppManifestShortcut](#cloudstructs-slackappmanifestshortcut)|Shortcut configuration.
[SlackAppManifestSlashCommand](#cloudstructs-slackappmanifestslashcommand)|Slash command configuration.
[SlackAppManifestWorkflowStep](#cloudstructs-slackappmanifestworkflowstep)|Workflow step.
[SlackAppProps](#cloudstructs-slackappprops)|Properties for a SlackApp.
[SlackEventsProps](#cloudstructs-slackeventsprops)|Properties for a SlackEvents.
[SlackTextractProps](#cloudstructs-slacktextractprops)|Properties for a SlackTextract.
[SlackkAppManifestBotUser](#cloudstructs-slackkappmanifestbotuser)|Bot user configuration.
[SslServerTestProps](#cloudstructs-sslservertestprops)|Properties for a SslServerTest.
[StateMachineCustomResourceProviderProps](#cloudstructs-statemachinecustomresourceproviderprops)|Properties for a StateMachineCustomResourceProvider.
[StaticWebsiteProps](#cloudstructs-staticwebsiteprops)|Properties for a StaticWebsite.
[ToolkitCleanerProps](#cloudstructs-toolkitcleanerprops)|Properties for a ToolkitCleaner.
[UrlShortenerProps](#cloudstructs-urlshortenerprops)|Properties for a UrlShortener.


**Interfaces**

Name|Description
----|-----------
[IStateMachine](#cloudstructs-istatemachine)|A State Machine.


**Enums**

Name|Description
----|-----------
[SlackAppManifestShortcutType](#cloudstructs-slackappmanifestshortcuttype)|Type of shortcuts.
[SslServerTestGrade](#cloudstructs-sslservertestgrade)|SSL Server test grade.



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



## class SlackApp  <a id="cloudstructs-slackapp"></a>

A Slack application deployed with a manifest.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new SlackApp(scope: Construct, id: string, props: SlackAppProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackAppProps](#cloudstructs-slackappprops)</code>)  *No description*
  * **configurationTokenSecret** (<code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code>)  An AWS Secrets Manager secret containing the app configuration token. 
  * **manifest** (<code>[SlackAppManifestDefinition](#cloudstructs-slackappmanifestdefinition)</code>)  The definition of the app manifest. 
  * **credentialsSecret** (<code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code>)  The AWS Secrets Manager secret where to store the app credentials. __*Default*__: a new secret is created



### Properties


Name | Type | Description 
-----|------|-------------
**appId** | <code>string</code> | The ID of the application.
**clientId** | <code>string</code> | A dynamic reference to the client ID of the app.
**clientSecret** | <code>string</code> | A dynamic reference to the client secret of the app.
**credentials** | <code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code> | An AWS Secrets Manager secret containing the credentials of the application.
**signingSecret** | <code>string</code> | A dynamic reference to the signing secret of the app.
**verificationToken** | <code>string</code> | A dynamic reference to the verification token of the app.



## class SlackAppManifest  <a id="cloudstructs-slackappmanifest"></a>

A Slack app manifest.


### Initializer




```ts
new SlackAppManifest(props: SlackAppManifestProps)
```

* **props** (<code>[SlackAppManifestProps](#cloudstructs-slackappmanifestprops)</code>)  *No description*
  * **name** (<code>string</code>)  The name of the app. 
  * **allowedIpAddressRanges** (<code>Array<string></code>)  An array of IP addresses that conform to the Allowed IP Ranges feature. __*Optional*__
  * **appHome** (<code>[SlackAppManifestAppHome](#cloudstructs-slackappmanifestapphome)</code>)  App Home configuration. __*Optional*__
  * **backgroundColor** (<code>string</code>)  A hex color value that specifies the background color used on hovercards that display information about your app. __*Optional*__
  * **botUser** (<code>[SlackkAppManifestBotUser](#cloudstructs-slackkappmanifestbotuser)</code>)  Bot user configuration. __*Optional*__
  * **description** (<code>string</code>)  A short description of the app for display to users. __*Default*__: no short description
  * **eventSubscriptions** (<code>[SlackAppManifestEventSubscriptions](#cloudstructs-slackappmanifesteventsubscriptions)</code>)  Events API configuration for the app. __*Optional*__
  * **interactivity** (<code>[SlackAppManifestInteractivity](#cloudstructs-slackappmanifestinteractivity)</code>)  Interactivity configuration for the app. __*Optional*__
  * **longDescription** (<code>string</code>)  A longer version of the description of the app. __*Optional*__
  * **majorVersion** (<code>number</code>)  The major version of the manifest schema to target. __*Default*__: do not target a specific major version
  * **minorVersion** (<code>number</code>)  The minor version of the manifest schema to target. __*Default*__: do not target a specific minor version
  * **oauthConfig** (<code>[SlackAppManifestOauthConfig](#cloudstructs-slackappmanifestoauthconfig)</code>)  OAuth configuration for the app. __*Optional*__
  * **orgDeploy** (<code>boolean</code>)  Whether org-wide deploy is enabled. __*Default*__: false
  * **shortcuts** (<code>Array<[SlackAppManifestShortcut](#cloudstructs-slackappmanifestshortcut)></code>)  Shortcuts configuration. __*Optional*__
  * **slashCommands** (<code>Array<[SlackAppManifestSlashCommand](#cloudstructs-slackappmanifestslashcommand)></code>)  Slash commands configuration. __*Optional*__
  * **socketMode** (<code>boolean</code>)  Whether Socket Mode is enabled. __*Default*__: false
  * **unfurlDomains** (<code>Array<string></code>)  Valid unfurl domains to register. __*Optional*__
  * **workflowSteps** (<code>Array<[SlackAppManifestWorkflowStep](#cloudstructs-slackappmanifestworkflowstep)></code>)  Workflow steps. __*Optional*__


### Methods


#### render(construct) <a id="cloudstructs-slackappmanifest-render"></a>



```ts
render(construct: IConstruct): string
```

* **construct** (<code>[IConstruct](#constructs-iconstruct)</code>)  *No description*

__Returns__:
* <code>string</code>



## class SlackAppManifestDefinition  <a id="cloudstructs-slackappmanifestdefinition"></a>

A Slack app manifest definition.


### Initializer




```ts
new SlackAppManifestDefinition()
```



### Methods


#### render(construct) <a id="cloudstructs-slackappmanifestdefinition-render"></a>

Renders the JSON app manifest encoded as a string.

```ts
render(construct: IConstruct): string
```

* **construct** (<code>[IConstruct](#constructs-iconstruct)</code>)  *No description*

__Returns__:
* <code>string</code>

#### *static* fromFile(file) <a id="cloudstructs-slackappmanifestdefinition-fromfile"></a>

Creates a Slack app manifest from a file containg a JSON app manifest.

```ts
static fromFile(file: string): SlackAppManifestDefinition
```

* **file** (<code>string</code>)  *No description*

__Returns__:
* <code>[SlackAppManifestDefinition](#cloudstructs-slackappmanifestdefinition)</code>

#### *static* fromManifest(props) <a id="cloudstructs-slackappmanifestdefinition-frommanifest"></a>

Creates a Slack app manifest by specifying properties.

```ts
static fromManifest(props: SlackAppManifestProps): SlackAppManifestDefinition
```

* **props** (<code>[SlackAppManifestProps](#cloudstructs-slackappmanifestprops)</code>)  *No description*
  * **name** (<code>string</code>)  The name of the app. 
  * **allowedIpAddressRanges** (<code>Array<string></code>)  An array of IP addresses that conform to the Allowed IP Ranges feature. __*Optional*__
  * **appHome** (<code>[SlackAppManifestAppHome](#cloudstructs-slackappmanifestapphome)</code>)  App Home configuration. __*Optional*__
  * **backgroundColor** (<code>string</code>)  A hex color value that specifies the background color used on hovercards that display information about your app. __*Optional*__
  * **botUser** (<code>[SlackkAppManifestBotUser](#cloudstructs-slackkappmanifestbotuser)</code>)  Bot user configuration. __*Optional*__
  * **description** (<code>string</code>)  A short description of the app for display to users. __*Default*__: no short description
  * **eventSubscriptions** (<code>[SlackAppManifestEventSubscriptions](#cloudstructs-slackappmanifesteventsubscriptions)</code>)  Events API configuration for the app. __*Optional*__
  * **interactivity** (<code>[SlackAppManifestInteractivity](#cloudstructs-slackappmanifestinteractivity)</code>)  Interactivity configuration for the app. __*Optional*__
  * **longDescription** (<code>string</code>)  A longer version of the description of the app. __*Optional*__
  * **majorVersion** (<code>number</code>)  The major version of the manifest schema to target. __*Default*__: do not target a specific major version
  * **minorVersion** (<code>number</code>)  The minor version of the manifest schema to target. __*Default*__: do not target a specific minor version
  * **oauthConfig** (<code>[SlackAppManifestOauthConfig](#cloudstructs-slackappmanifestoauthconfig)</code>)  OAuth configuration for the app. __*Optional*__
  * **orgDeploy** (<code>boolean</code>)  Whether org-wide deploy is enabled. __*Default*__: false
  * **shortcuts** (<code>Array<[SlackAppManifestShortcut](#cloudstructs-slackappmanifestshortcut)></code>)  Shortcuts configuration. __*Optional*__
  * **slashCommands** (<code>Array<[SlackAppManifestSlashCommand](#cloudstructs-slackappmanifestslashcommand)></code>)  Slash commands configuration. __*Optional*__
  * **socketMode** (<code>boolean</code>)  Whether Socket Mode is enabled. __*Default*__: false
  * **unfurlDomains** (<code>Array<string></code>)  Valid unfurl domains to register. __*Optional*__
  * **workflowSteps** (<code>Array<[SlackAppManifestWorkflowStep](#cloudstructs-slackappmanifestworkflowstep)></code>)  Workflow steps. __*Optional*__

__Returns__:
* <code>[SlackAppManifestDefinition](#cloudstructs-slackappmanifestdefinition)</code>

#### *static* fromString(manifest) <a id="cloudstructs-slackappmanifestdefinition-fromstring"></a>

Create a Slack app manifest from a JSON app manifest encoded as a string.

```ts
static fromString(manifest: string): SlackAppManifestDefinition
```

* **manifest** (<code>string</code>)  *No description*

__Returns__:
* <code>[SlackAppManifestDefinition](#cloudstructs-slackappmanifestdefinition)</code>



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




## class SslServerTest  <a id="cloudstructs-sslservertest"></a>

Perform SSL server test for a hostname.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new SslServerTest(scope: Construct, id: string, props: SslServerTestProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SslServerTestProps](#cloudstructs-sslservertestprops)</code>)  *No description*
  * **host** (<code>string</code>)  The hostname to test. 
  * **alarmTopic** (<code>[aws_sns.ITopic](#aws-cdk-lib-aws-sns-itopic)</code>)  The topic to which the results must be sent when the grade is below the minimum grade. __*Default*__: a new topic is created
  * **minimumGrade** (<code>[SslServerTestGrade](#cloudstructs-sslservertestgrade)</code>)  Minimum grade for the test. The grade is calculated using the worst grade of all endpoints. __*Default*__: SslServerTestGrade.A_PLUS
  * **schedule** (<code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code>)  The schedule for the test. __*Default*__: every day



### Properties


Name | Type | Description 
-----|------|-------------
**alarmTopic** | <code>[aws_sns.ITopic](#aws-cdk-lib-aws-sns-itopic)</code> | The topic to which the SSL test results are sent when the grade is below the minimum grade.



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
  * **redirects** (<code>Array<string></code>)  A list of domain names that should redirect to `domainName`. __*Default*__: the domain name of the hosted zone
  * **responseHeadersPolicy** (<code>[aws_cloudfront.ResponseHeadersPolicy](#aws-cdk-lib-aws-cloudfront-responseheaderspolicy)</code>)  Response headers policy for the default behavior. __*Default*__: a new policy is created with best practice security headers



### Properties


Name | Type | Description 
-----|------|-------------
**bucket** | <code>[aws_s3.Bucket](#aws-cdk-lib-aws-s3-bucket)</code> | The S3 bucket of this static website.
**distribution** | <code>[aws_cloudfront.Distribution](#aws-cdk-lib-aws-cloudfront-distribution)</code> | The CloudFront distribution of this static website.
*static* **defaultSecurityHeadersBehavior** | <code>[aws_cloudfront.ResponseSecurityHeadersBehavior](#aws-cdk-lib-aws-cloudfront-responsesecurityheadersbehavior)</code> | Best practice security headers used as default.



## class ToolkitCleaner  <a id="cloudstructs-toolkitcleaner"></a>

Clean unused S3 and ECR assets from your CDK Toolkit.

__Implements__: [IConstruct](#constructs-iconstruct), [IDependable](#constructs-idependable)
__Extends__: [Construct](#constructs-construct)

### Initializer




```ts
new ToolkitCleaner(scope: Construct, id: string, props?: ToolkitCleanerProps)
```

* **scope** (<code>[Construct](#constructs-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[ToolkitCleanerProps](#cloudstructs-toolkitcleanerprops)</code>)  *No description*
  * **dryRun** (<code>boolean</code>)  Only output number of assets and total size that would be deleted but without actually deleting assets. __*Optional*__
  * **retainAssetsNewerThan** (<code>[Duration](#aws-cdk-lib-duration)</code>)  Retain unused assets that were created recently. __*Default*__: all unused assets are removed
  * **schedule** (<code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code>)  The schedule for the cleaner. __*Default*__: every day
  * **scheduleEnabled** (<code>boolean</code>)  Whether to clean on schedule. __*Default*__: true




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
  * **apiGatewayAuthorizer** (<code>[aws_apigateway.IAuthorizer](#aws-cdk-lib-aws-apigateway-iauthorizer)</code>)  Authorizer for API gateway. __*Default*__: do not use an authorizer for the API
  * **apiGatewayEndpoint** (<code>[aws_ec2.IInterfaceVpcEndpoint](#aws-cdk-lib-aws-ec2-iinterfacevpcendpoint)</code>)  An interface VPC endpoint for API gateway. __*Default*__: API is public
  * **bucketName** (<code>string</code>)  A name for the bucket saving the redirects. __*Default*__: derived from short link domain name
  * **corsAllowOrigins** (<code>Array<string></code>)  Allowed origins for CORS. __*Default*__: CORS is not enabled
  * **expiration** (<code>[Duration](#aws-cdk-lib-duration)</code>)  Expiration for short urls. __*Default*__: cdk.Duration.days(365)
  * **iamAuthorization** (<code>boolean</code>)  Whether to use IAM authorization. __*Default*__: do not use IAM authorization
  * **recordName** (<code>string</code>)  The record name to use in the hosted zone. __*Default*__: zone root



### Properties


Name | Type | Description 
-----|------|-------------
**api** | <code>[aws_apigateway.RestApi](#aws-cdk-lib-aws-apigateway-restapi)</code> | The underlying API Gateway REST API.
**apiEndpoint** | <code>string</code> | The endpoint of the URL shortener API.

### Methods


#### grantInvoke(grantee) <a id="cloudstructs-urlshortener-grantinvoke"></a>

Grant access to invoke the URL shortener if protected by IAM authorization.

```ts
grantInvoke(grantee: IGrantable): Grant
```

* **grantee** (<code>[aws_iam.IGrantable](#aws-cdk-lib-aws-iam-igrantable)</code>)  *No description*

__Returns__:
* <code>[aws_iam.Grant](#aws-cdk-lib-aws-iam-grant)</code>



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



## struct SlackAppManifestAppHome  <a id="cloudstructs-slackappmanifestapphome"></a>


App Home configuration.



Name | Type | Description 
-----|------|-------------
**homeTab**? | <code>boolean</code> | Wether the Home tab is enabled.<br/>__*Default*__: false
**messagesTab**? | <code>boolean</code> | Wether the Messages is enabled.<br/>__*Default*__: false
**messagesTabReadOnly**? | <code>boolean</code> | Whether the users can send messages to your app in the Messages tab of your App Home.<br/>__*Default*__: false



## struct SlackAppManifestEventSubscriptions  <a id="cloudstructs-slackappmanifesteventsubscriptions"></a>


Events API configuration for the app.



Name | Type | Description 
-----|------|-------------
**requestUrl** | <code>string</code> | The full https URL that acts as the Events API request URL.
**botEvents**? | <code>Array<string></code> | Event types you want the app to subscribe to.<br/>__*Optional*__
**userEvents**? | <code>Array<string></code> | Event types you want the app to subscribe to on behalf of authorized users.<br/>__*Optional*__



## struct SlackAppManifestInteractivity  <a id="cloudstructs-slackappmanifestinteractivity"></a>


Interactivity configuration for the app.



Name | Type | Description 
-----|------|-------------
**enabled**? | <code>boolean</code> | Whether or not interactivity features are enabled.<br/>__*Default*__: true
**messageMenuOptionsUrl**? | <code>string</code> | The full https URL that acts as th interactive Options Load URL.<br/>__*Optional*__
**requestUrl**? | <code>string</code> | The full https URL that acts as the interactive Request URL.<br/>__*Optional*__



## struct SlackAppManifestOauthConfig  <a id="cloudstructs-slackappmanifestoauthconfig"></a>


OAuth configuration for the app.



Name | Type | Description 
-----|------|-------------
**botScopes**? | <code>Array<string></code> | Bot scopes to request upon app installation.<br/>__*Optional*__
**redirectUrls**? | <code>Array<string></code> | OAuth redirect URLs.<br/>__*Optional*__
**userScopes**? | <code>Array<string></code> | User scopes to request upon app installation.<br/>__*Optional*__



## struct SlackAppManifestProps  <a id="cloudstructs-slackappmanifestprops"></a>


Properties for a Slack app manifest.



Name | Type | Description 
-----|------|-------------
**name** | <code>string</code> | The name of the app.
**allowedIpAddressRanges**? | <code>Array<string></code> | An array of IP addresses that conform to the Allowed IP Ranges feature.<br/>__*Optional*__
**appHome**? | <code>[SlackAppManifestAppHome](#cloudstructs-slackappmanifestapphome)</code> | App Home configuration.<br/>__*Optional*__
**backgroundColor**? | <code>string</code> | A hex color value that specifies the background color used on hovercards that display information about your app.<br/>__*Optional*__
**botUser**? | <code>[SlackkAppManifestBotUser](#cloudstructs-slackkappmanifestbotuser)</code> | Bot user configuration.<br/>__*Optional*__
**description**? | <code>string</code> | A short description of the app for display to users.<br/>__*Default*__: no short description
**eventSubscriptions**? | <code>[SlackAppManifestEventSubscriptions](#cloudstructs-slackappmanifesteventsubscriptions)</code> | Events API configuration for the app.<br/>__*Optional*__
**interactivity**? | <code>[SlackAppManifestInteractivity](#cloudstructs-slackappmanifestinteractivity)</code> | Interactivity configuration for the app.<br/>__*Optional*__
**longDescription**? | <code>string</code> | A longer version of the description of the app.<br/>__*Optional*__
**majorVersion**? | <code>number</code> | The major version of the manifest schema to target.<br/>__*Default*__: do not target a specific major version
**minorVersion**? | <code>number</code> | The minor version of the manifest schema to target.<br/>__*Default*__: do not target a specific minor version
**oauthConfig**? | <code>[SlackAppManifestOauthConfig](#cloudstructs-slackappmanifestoauthconfig)</code> | OAuth configuration for the app.<br/>__*Optional*__
**orgDeploy**? | <code>boolean</code> | Whether org-wide deploy is enabled.<br/>__*Default*__: false
**shortcuts**? | <code>Array<[SlackAppManifestShortcut](#cloudstructs-slackappmanifestshortcut)></code> | Shortcuts configuration.<br/>__*Optional*__
**slashCommands**? | <code>Array<[SlackAppManifestSlashCommand](#cloudstructs-slackappmanifestslashcommand)></code> | Slash commands configuration.<br/>__*Optional*__
**socketMode**? | <code>boolean</code> | Whether Socket Mode is enabled.<br/>__*Default*__: false
**unfurlDomains**? | <code>Array<string></code> | Valid unfurl domains to register.<br/>__*Optional*__
**workflowSteps**? | <code>Array<[SlackAppManifestWorkflowStep](#cloudstructs-slackappmanifestworkflowstep)></code> | Workflow steps.<br/>__*Optional*__



## struct SlackAppManifestSettings  <a id="cloudstructs-slackappmanifestsettings"></a>


Settings section of the app config pages.



Name | Type | Description 
-----|------|-------------
**allowedIpAddressRanges**? | <code>Array<string></code> | An array of IP addresses that conform to the Allowed IP Ranges feature.<br/>__*Optional*__
**eventSubscriptions**? | <code>[SlackAppManifestEventSubscriptions](#cloudstructs-slackappmanifesteventsubscriptions)</code> | Events API configuration for the app.<br/>__*Optional*__
**interactivity**? | <code>[SlackAppManifestInteractivity](#cloudstructs-slackappmanifestinteractivity)</code> | Interactivity configuration for the app.<br/>__*Optional*__
**orgDeploy**? | <code>boolean</code> | Whether org-wide deploy is enabled.<br/>__*Default*__: false
**socketMode**? | <code>boolean</code> | Whether Socket Mode is enabled.<br/>__*Default*__: false



## struct SlackAppManifestShortcut  <a id="cloudstructs-slackappmanifestshortcut"></a>


Shortcut configuration.



Name | Type | Description 
-----|------|-------------
**callbackId** | <code>string</code> | The callback ID of the shortcut.
**description** | <code>string</code> | A short description of the shortcut.
**name** | <code>string</code> | The name of the shortcut.
**type** | <code>[SlackAppManifestShortcutType](#cloudstructs-slackappmanifestshortcuttype)</code> | The type of shortcut.



## struct SlackAppManifestSlashCommand  <a id="cloudstructs-slackappmanifestslashcommand"></a>


Slash command configuration.



Name | Type | Description 
-----|------|-------------
**command** | <code>string</code> | The actual slash command.
**description** | <code>string</code> | The description of the slash command.
**shouldEscape**? | <code>boolean</code> | Whether channels, users, and links typed with the slash command should be escaped.<br/>__*Default*__: false
**url**? | <code>string</code> | The full https URL that acts as the slash command's request URL.<br/>__*Optional*__
**usageHint**? | <code>string</code> | The short usage hint about the slash command for users.<br/>__*Optional*__



## struct SlackAppManifestWorkflowStep  <a id="cloudstructs-slackappmanifestworkflowstep"></a>


Workflow step.



Name | Type | Description 
-----|------|-------------
**callbackId** | <code>string</code> | The callback ID of the workflow step.
**name** | <code>string</code> | The name of the workflow step.



## struct SlackAppProps  <a id="cloudstructs-slackappprops"></a>


Properties for a SlackApp.



Name | Type | Description 
-----|------|-------------
**configurationTokenSecret** | <code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code> | An AWS Secrets Manager secret containing the app configuration token.
**manifest** | <code>[SlackAppManifestDefinition](#cloudstructs-slackappmanifestdefinition)</code> | The definition of the app manifest.
**credentialsSecret**? | <code>[aws_secretsmanager.ISecret](#aws-cdk-lib-aws-secretsmanager-isecret)</code> | The AWS Secrets Manager secret where to store the app credentials.<br/>__*Default*__: a new secret is created



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



## struct SlackkAppManifestBotUser  <a id="cloudstructs-slackkappmanifestbotuser"></a>


Bot user configuration.



Name | Type | Description 
-----|------|-------------
**displayName** | <code>string</code> | The display name of the bot user.
**alwaysOnline**? | <code>boolean</code> | Whether the bot user will always appear to be online.<br/>__*Default*__: false



## struct SslServerTestProps  <a id="cloudstructs-sslservertestprops"></a>


Properties for a SslServerTest.



Name | Type | Description 
-----|------|-------------
**host** | <code>string</code> | The hostname to test.
**alarmTopic**? | <code>[aws_sns.ITopic](#aws-cdk-lib-aws-sns-itopic)</code> | The topic to which the results must be sent when the grade is below the minimum grade.<br/>__*Default*__: a new topic is created
**minimumGrade**? | <code>[SslServerTestGrade](#cloudstructs-sslservertestgrade)</code> | Minimum grade for the test. The grade is calculated using the worst grade of all endpoints.<br/>__*Default*__: SslServerTestGrade.A_PLUS
**schedule**? | <code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code> | The schedule for the test.<br/>__*Default*__: every day



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
**redirects**? | <code>Array<string></code> | A list of domain names that should redirect to `domainName`.<br/>__*Default*__: the domain name of the hosted zone
**responseHeadersPolicy**? | <code>[aws_cloudfront.ResponseHeadersPolicy](#aws-cdk-lib-aws-cloudfront-responseheaderspolicy)</code> | Response headers policy for the default behavior.<br/>__*Default*__: a new policy is created with best practice security headers



## struct ToolkitCleanerProps  <a id="cloudstructs-toolkitcleanerprops"></a>


Properties for a ToolkitCleaner.



Name | Type | Description 
-----|------|-------------
**dryRun**? | <code>boolean</code> | Only output number of assets and total size that would be deleted but without actually deleting assets.<br/>__*Optional*__
**retainAssetsNewerThan**? | <code>[Duration](#aws-cdk-lib-duration)</code> | Retain unused assets that were created recently.<br/>__*Default*__: all unused assets are removed
**schedule**? | <code>[aws_events.Schedule](#aws-cdk-lib-aws-events-schedule)</code> | The schedule for the cleaner.<br/>__*Default*__: every day
**scheduleEnabled**? | <code>boolean</code> | Whether to clean on schedule.<br/>__*Default*__: true



## struct UrlShortenerProps  <a id="cloudstructs-urlshortenerprops"></a>


Properties for a UrlShortener.



Name | Type | Description 
-----|------|-------------
**hostedZone** | <code>[aws_route53.IHostedZone](#aws-cdk-lib-aws-route53-ihostedzone)</code> | The hosted zone for the short URLs domain.
**apiGatewayAuthorizer**? | <code>[aws_apigateway.IAuthorizer](#aws-cdk-lib-aws-apigateway-iauthorizer)</code> | Authorizer for API gateway.<br/>__*Default*__: do not use an authorizer for the API
**apiGatewayEndpoint**? | <code>[aws_ec2.IInterfaceVpcEndpoint](#aws-cdk-lib-aws-ec2-iinterfacevpcendpoint)</code> | An interface VPC endpoint for API gateway.<br/>__*Default*__: API is public
**bucketName**? | <code>string</code> | A name for the bucket saving the redirects.<br/>__*Default*__: derived from short link domain name
**corsAllowOrigins**? | <code>Array<string></code> | Allowed origins for CORS.<br/>__*Default*__: CORS is not enabled
**expiration**? | <code>[Duration](#aws-cdk-lib-duration)</code> | Expiration for short urls.<br/>__*Default*__: cdk.Duration.days(365)
**iamAuthorization**? | <code>boolean</code> | Whether to use IAM authorization.<br/>__*Default*__: do not use IAM authorization
**recordName**? | <code>string</code> | The record name to use in the hosted zone.<br/>__*Default*__: zone root



## enum SlackAppManifestShortcutType  <a id="cloudstructs-slackappmanifestshortcuttype"></a>

Type of shortcuts.

Name | Description
-----|-----
**MESSAGE** |Message shortcuts are shown to users in the context menus of messages within Slack.
**GLOBAL** |Global shortcuts are available to users via the shortcuts button in the composer, and when using search in Slack.


## enum SslServerTestGrade  <a id="cloudstructs-sslservertestgrade"></a>

SSL Server test grade.

Name | Description
-----|-----
**A_PLUS** |
**A** |
**A_MINUS** |
**B** |
**C** |
**D** |
**E** |
**F** |


