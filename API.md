# cloudstructs

High-level constructs for AWS CDK

## Installation

`npm install cloudstructs` or `yarn add cloudstructs`

Version >= 0.2.0 requires AWS CDK v2.

## Constructs

* [`CodeCommitMirror`](src/codecommit-mirror) Mirror a repository to AWS CodeCommit on schedule

* [`EcsServiceRoller`](src/ecs-service-roller) Roll your ECS service tasks on schedule or with
  a rule

* [`EmailReceiver`](src/email-receiver) Receive emails through SES, save them to S3
  and invoke a Lambda function

* ['MjmlTemplate`](src/mjml-template) SES email template from [MJML](https://mjml.io/)

* [`SlackApp`](src/slack-app) Deploy Slack apps from manifests

* [`SlackEvents`](src/slack-events) Send Slack events to Amazon EventBridge

* [`SlackTextract`](src/slack-textract) Extract text from images posted to Slack
  using Amazon Textract. The extracted text is posted in a thread under the image
  and gets indexed!

* [`SslServerTest`](src/ssl-server-test) Test a server/host for SSL/TLS on schedule and
  get notified when the overall rating is not satisfactory. [Powered by Qualys SSL Labs](https://www.ssllabs.com/).

* [`StateMachineCustomResourceProvider`](src/state-machine-cr-provider) Implement custom
  resources with AWS Step Functions state machines

* [`StaticWebsite`](src/static-website) A CloudFront static website hosted on S3 with
  HTTPS redirect, SPA redirect, HTTP security headers and backend configuration saved
  to the bucket.

* [`ToolkitCleaner`](src/toolkit-cleaner) Clean unused S3 and ECR assets from your CDK
  Toolkit.

* [`UrlShortener`](src/url-shortener) Deploy an URL shortener API

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CodeCommitMirror <a name="CodeCommitMirror" id="cloudstructs.CodeCommitMirror"></a>

Mirror a repository to AWS CodeCommit on schedule.

#### Initializers <a name="Initializers" id="cloudstructs.CodeCommitMirror.Initializer"></a>

```typescript
import { CodeCommitMirror } from 'cloudstructs'

new CodeCommitMirror(scope: Construct, id: string, props: CodeCommitMirrorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirror.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.CodeCommitMirror.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.CodeCommitMirror.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.CodeCommitMirrorProps">CodeCommitMirrorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.CodeCommitMirror.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.CodeCommitMirror.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.CodeCommitMirror.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.CodeCommitMirrorProps">CodeCommitMirrorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirror.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.CodeCommitMirror.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirror.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.CodeCommitMirror.isConstruct"></a>

```typescript
import { CodeCommitMirror } from 'cloudstructs'

CodeCommitMirror.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.CodeCommitMirror.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirror.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.CodeCommitMirror.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### DmarcReporter <a name="DmarcReporter" id="cloudstructs.DmarcReporter"></a>

Creates a DMARC record in Route 53 and invokes a Lambda function to process incoming reports.

#### Initializers <a name="Initializers" id="cloudstructs.DmarcReporter.Initializer"></a>

```typescript
import { DmarcReporter } from 'cloudstructs'

new DmarcReporter(scope: Construct, id: string, props: DmarcReporterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.DmarcReporter.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.DmarcReporter.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.DmarcReporter.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.DmarcReporterProps">DmarcReporterProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.DmarcReporter.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.DmarcReporter.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.DmarcReporter.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.DmarcReporterProps">DmarcReporterProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.DmarcReporter.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.DmarcReporter.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.DmarcReporter.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.DmarcReporter.isConstruct"></a>

```typescript
import { DmarcReporter } from 'cloudstructs'

DmarcReporter.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.DmarcReporter.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.DmarcReporter.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.DmarcReporter.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### EcsServiceRoller <a name="EcsServiceRoller" id="cloudstructs.EcsServiceRoller"></a>

Roll your ECS service tasks on schedule or with a rule.

#### Initializers <a name="Initializers" id="cloudstructs.EcsServiceRoller.Initializer"></a>

```typescript
import { EcsServiceRoller } from 'cloudstructs'

new EcsServiceRoller(scope: Construct, id: string, props: EcsServiceRollerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.EcsServiceRoller.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.EcsServiceRoller.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.EcsServiceRoller.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.EcsServiceRollerProps">EcsServiceRollerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.EcsServiceRoller.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.EcsServiceRoller.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.EcsServiceRoller.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.EcsServiceRollerProps">EcsServiceRollerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.EcsServiceRoller.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.EcsServiceRoller.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.EcsServiceRoller.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.EcsServiceRoller.isConstruct"></a>

```typescript
import { EcsServiceRoller } from 'cloudstructs'

EcsServiceRoller.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.EcsServiceRoller.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.EcsServiceRoller.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.EcsServiceRoller.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### EmailReceiver <a name="EmailReceiver" id="cloudstructs.EmailReceiver"></a>

Receive emails through SES, save them to S3 and invokes a Lambda function.

#### Initializers <a name="Initializers" id="cloudstructs.EmailReceiver.Initializer"></a>

```typescript
import { EmailReceiver } from 'cloudstructs'

new EmailReceiver(scope: Construct, id: string, props: EmailReceiverProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.EmailReceiver.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.EmailReceiver.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.EmailReceiver.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.EmailReceiverProps">EmailReceiverProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.EmailReceiver.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.EmailReceiver.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.EmailReceiver.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.EmailReceiverProps">EmailReceiverProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.EmailReceiver.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.EmailReceiver.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.EmailReceiver.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.EmailReceiver.isConstruct"></a>

```typescript
import { EmailReceiver } from 'cloudstructs'

EmailReceiver.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.EmailReceiver.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.EmailReceiver.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.EmailReceiver.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### MjmlTemplate <a name="MjmlTemplate" id="cloudstructs.MjmlTemplate"></a>

SES email template from [MJML](https://mjml.io/).

#### Initializers <a name="Initializers" id="cloudstructs.MjmlTemplate.Initializer"></a>

```typescript
import { MjmlTemplate } from 'cloudstructs'

new MjmlTemplate(scope: Construct, id: string, props: MjmlTemplateProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.MjmlTemplate.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.MjmlTemplate.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.MjmlTemplate.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.MjmlTemplateProps">MjmlTemplateProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.MjmlTemplate.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.MjmlTemplate.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.MjmlTemplate.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.MjmlTemplateProps">MjmlTemplateProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.MjmlTemplate.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.MjmlTemplate.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.MjmlTemplate.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.MjmlTemplate.isConstruct"></a>

```typescript
import { MjmlTemplate } from 'cloudstructs'

MjmlTemplate.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.MjmlTemplate.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.MjmlTemplate.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.MjmlTemplate.property.templateName">templateName</a></code> | <code>string</code> | The name of the template. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.MjmlTemplate.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `templateName`<sup>Required</sup> <a name="templateName" id="cloudstructs.MjmlTemplate.property.templateName"></a>

```typescript
public readonly templateName: string;
```

- *Type:* string

The name of the template.

---


### SamlIdentityProvider <a name="SamlIdentityProvider" id="cloudstructs.SamlIdentityProvider"></a>

Create a SAML identity provider.

#### Initializers <a name="Initializers" id="cloudstructs.SamlIdentityProvider.Initializer"></a>

```typescript
import { SamlIdentityProvider } from 'cloudstructs'

new SamlIdentityProvider(scope: Construct, id: string, props: SamlIdentityProviderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SamlIdentityProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.SamlIdentityProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.SamlIdentityProvider.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.SamlIdentityProviderProps">SamlIdentityProviderProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.SamlIdentityProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.SamlIdentityProvider.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SamlIdentityProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SamlIdentityProviderProps">SamlIdentityProviderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SamlIdentityProvider.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### ~~`toString`~~ <a name="toString" id="cloudstructs.SamlIdentityProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SamlIdentityProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.SamlIdentityProvider.isConstruct"></a>

```typescript
import { SamlIdentityProvider } from 'cloudstructs'

SamlIdentityProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.SamlIdentityProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SamlIdentityProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.SamlIdentityProvider.property.samlIdentityProviderArn">samlIdentityProviderArn</a></code> | <code>string</code> | The ARN of the SAML identity provider. |

---

##### ~~`node`~~<sup>Required</sup> <a name="node" id="cloudstructs.SamlIdentityProvider.property.node"></a>

- *Deprecated:* use `SamlProvider` from `aws-cdk-lib/aws-iam`

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### ~~`samlIdentityProviderArn`~~<sup>Required</sup> <a name="samlIdentityProviderArn" id="cloudstructs.SamlIdentityProvider.property.samlIdentityProviderArn"></a>

- *Deprecated:* use `SamlProvider` from `aws-cdk-lib/aws-iam`

```typescript
public readonly samlIdentityProviderArn: string;
```

- *Type:* string

The ARN of the SAML identity provider.

---


### SlackApp <a name="SlackApp" id="cloudstructs.SlackApp"></a>

A Slack application deployed with a manifest.

> [https://api.slack.com/reference/manifests](https://api.slack.com/reference/manifests)

#### Initializers <a name="Initializers" id="cloudstructs.SlackApp.Initializer"></a>

```typescript
import { SlackApp } from 'cloudstructs'

new SlackApp(scope: Construct, id: string, props: SlackAppProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackApp.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.SlackApp.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.SlackApp.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.SlackAppProps">SlackAppProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.SlackApp.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.SlackApp.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SlackApp.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SlackAppProps">SlackAppProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackApp.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.SlackApp.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackApp.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.SlackApp.isConstruct"></a>

```typescript
import { SlackApp } from 'cloudstructs'

SlackApp.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.SlackApp.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackApp.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.SlackApp.property.appId">appId</a></code> | <code>string</code> | The ID of the application. |
| <code><a href="#cloudstructs.SlackApp.property.clientId">clientId</a></code> | <code>string</code> | A dynamic reference to the client ID of the app. |
| <code><a href="#cloudstructs.SlackApp.property.clientSecret">clientSecret</a></code> | <code>string</code> | A dynamic reference to the client secret of the app. |
| <code><a href="#cloudstructs.SlackApp.property.credentials">credentials</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | An AWS Secrets Manager secret containing the credentials of the application. |
| <code><a href="#cloudstructs.SlackApp.property.signingSecret">signingSecret</a></code> | <code>string</code> | A dynamic reference to the signing secret of the app. |
| <code><a href="#cloudstructs.SlackApp.property.verificationToken">verificationToken</a></code> | <code>string</code> | A dynamic reference to the verification token of the app. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.SlackApp.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `appId`<sup>Required</sup> <a name="appId" id="cloudstructs.SlackApp.property.appId"></a>

```typescript
public readonly appId: string;
```

- *Type:* string

The ID of the application.

---

##### `clientId`<sup>Required</sup> <a name="clientId" id="cloudstructs.SlackApp.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

A dynamic reference to the client ID of the app.

---

##### `clientSecret`<sup>Required</sup> <a name="clientSecret" id="cloudstructs.SlackApp.property.clientSecret"></a>

```typescript
public readonly clientSecret: string;
```

- *Type:* string

A dynamic reference to the client secret of the app.

---

##### `credentials`<sup>Required</sup> <a name="credentials" id="cloudstructs.SlackApp.property.credentials"></a>

```typescript
public readonly credentials: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

An AWS Secrets Manager secret containing the credentials of the application.

```
{
  "appId": "...",
  "clientId": "...",
  "clientSecret": "...",
  "verificationToken": "...",
  "signingSecret": "..."
}
```

---

##### `signingSecret`<sup>Required</sup> <a name="signingSecret" id="cloudstructs.SlackApp.property.signingSecret"></a>

```typescript
public readonly signingSecret: string;
```

- *Type:* string

A dynamic reference to the signing secret of the app.

---

##### `verificationToken`<sup>Required</sup> <a name="verificationToken" id="cloudstructs.SlackApp.property.verificationToken"></a>

```typescript
public readonly verificationToken: string;
```

- *Type:* string

A dynamic reference to the verification token of the app.

---


### SlackEvents <a name="SlackEvents" id="cloudstructs.SlackEvents"></a>

Send Slack events to Amazon EventBridge.

#### Initializers <a name="Initializers" id="cloudstructs.SlackEvents.Initializer"></a>

```typescript
import { SlackEvents } from 'cloudstructs'

new SlackEvents(scope: Construct, id: string, props: SlackEventsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackEvents.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.SlackEvents.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.SlackEvents.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.SlackEventsProps">SlackEventsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.SlackEvents.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.SlackEvents.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SlackEvents.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SlackEventsProps">SlackEventsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackEvents.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.SlackEvents.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackEvents.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.SlackEvents.isConstruct"></a>

```typescript
import { SlackEvents } from 'cloudstructs'

SlackEvents.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.SlackEvents.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackEvents.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.SlackEvents.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.EventBus</code> | The custom event bus where Slack events are sent. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.SlackEvents.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventBus`<sup>Optional</sup> <a name="eventBus" id="cloudstructs.SlackEvents.property.eventBus"></a>

```typescript
public readonly eventBus: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus

The custom event bus where Slack events are sent.

---


### SlackTextract <a name="SlackTextract" id="cloudstructs.SlackTextract"></a>

Extract text from images posted to Slack using Amazon Textract.

#### Initializers <a name="Initializers" id="cloudstructs.SlackTextract.Initializer"></a>

```typescript
import { SlackTextract } from 'cloudstructs'

new SlackTextract(scope: Construct, id: string, props: SlackTextractProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackTextract.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.SlackTextract.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.SlackTextract.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.SlackTextractProps">SlackTextractProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.SlackTextract.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.SlackTextract.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SlackTextract.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SlackTextractProps">SlackTextractProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackTextract.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.SlackTextract.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackTextract.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.SlackTextract.isConstruct"></a>

```typescript
import { SlackTextract } from 'cloudstructs'

SlackTextract.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.SlackTextract.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackTextract.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.SlackTextract.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### SslServerTest <a name="SslServerTest" id="cloudstructs.SslServerTest"></a>

Perform SSL server test for a hostname.

#### Initializers <a name="Initializers" id="cloudstructs.SslServerTest.Initializer"></a>

```typescript
import { SslServerTest } from 'cloudstructs'

new SslServerTest(scope: Construct, id: string, props: SslServerTestProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SslServerTest.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTest.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTest.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.SslServerTestProps">SslServerTestProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.SslServerTest.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.SslServerTest.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SslServerTest.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SslServerTestProps">SslServerTestProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SslServerTest.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.SslServerTest.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SslServerTest.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.SslServerTest.isConstruct"></a>

```typescript
import { SslServerTest } from 'cloudstructs'

SslServerTest.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.SslServerTest.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SslServerTest.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.SslServerTest.property.alarmTopic">alarmTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The topic to which the SSL test results are sent when the grade is below the minimum grade. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.SslServerTest.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `alarmTopic`<sup>Required</sup> <a name="alarmTopic" id="cloudstructs.SslServerTest.property.alarmTopic"></a>

```typescript
public readonly alarmTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The topic to which the SSL test results are sent when the grade is below the minimum grade.

---


### StateMachineCustomResourceProvider <a name="StateMachineCustomResourceProvider" id="cloudstructs.StateMachineCustomResourceProvider"></a>

A state machine custom resource provider.

#### Initializers <a name="Initializers" id="cloudstructs.StateMachineCustomResourceProvider.Initializer"></a>

```typescript
import { StateMachineCustomResourceProvider } from 'cloudstructs'

new StateMachineCustomResourceProvider(scope: Construct, id: string, props: StateMachineCustomResourceProviderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.StateMachineCustomResourceProviderProps">StateMachineCustomResourceProviderProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.StateMachineCustomResourceProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.StateMachineCustomResourceProvider.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.StateMachineCustomResourceProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.StateMachineCustomResourceProviderProps">StateMachineCustomResourceProviderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.StateMachineCustomResourceProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.StateMachineCustomResourceProvider.isConstruct"></a>

```typescript
import { StateMachineCustomResourceProvider } from 'cloudstructs'

StateMachineCustomResourceProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.StateMachineCustomResourceProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.StateMachineCustomResourceProvider.property.serviceToken">serviceToken</a></code> | <code>string</code> | The service token. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.StateMachineCustomResourceProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `serviceToken`<sup>Required</sup> <a name="serviceToken" id="cloudstructs.StateMachineCustomResourceProvider.property.serviceToken"></a>

```typescript
public readonly serviceToken: string;
```

- *Type:* string

The service token.

---


### StaticWebsite <a name="StaticWebsite" id="cloudstructs.StaticWebsite"></a>

A CloudFront static website hosted on S3.

#### Initializers <a name="Initializers" id="cloudstructs.StaticWebsite.Initializer"></a>

```typescript
import { StaticWebsite } from 'cloudstructs'

new StaticWebsite(scope: Construct, id: string, props: StaticWebsiteProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.StaticWebsite.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.StaticWebsite.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.StaticWebsite.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.StaticWebsiteProps">StaticWebsiteProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.StaticWebsite.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.StaticWebsite.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.StaticWebsite.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.StaticWebsiteProps">StaticWebsiteProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.StaticWebsite.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.StaticWebsite.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.StaticWebsite.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.StaticWebsite.isConstruct"></a>

```typescript
import { StaticWebsite } from 'cloudstructs'

StaticWebsite.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.StaticWebsite.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.StaticWebsite.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.StaticWebsite.property.defaultSecurityHeadersBehavior">defaultSecurityHeadersBehavior</a></code> | <code>aws-cdk-lib.aws_cloudfront.ResponseSecurityHeadersBehavior</code> | Best practice security headers used as default. |
| <code><a href="#cloudstructs.StaticWebsite.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | The S3 bucket of this static website. |
| <code><a href="#cloudstructs.StaticWebsite.property.distribution">distribution</a></code> | <code>aws-cdk-lib.aws_cloudfront.Distribution</code> | The CloudFront distribution of this static website. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.StaticWebsite.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `defaultSecurityHeadersBehavior`<sup>Required</sup> <a name="defaultSecurityHeadersBehavior" id="cloudstructs.StaticWebsite.property.defaultSecurityHeadersBehavior"></a>

```typescript
public readonly defaultSecurityHeadersBehavior: ResponseSecurityHeadersBehavior;
```

- *Type:* aws-cdk-lib.aws_cloudfront.ResponseSecurityHeadersBehavior

Best practice security headers used as default.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="cloudstructs.StaticWebsite.property.bucket"></a>

```typescript
public readonly bucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

The S3 bucket of this static website.

---

##### `distribution`<sup>Required</sup> <a name="distribution" id="cloudstructs.StaticWebsite.property.distribution"></a>

```typescript
public readonly distribution: Distribution;
```

- *Type:* aws-cdk-lib.aws_cloudfront.Distribution

The CloudFront distribution of this static website.

---


### ToolkitCleaner <a name="ToolkitCleaner" id="cloudstructs.ToolkitCleaner"></a>

Clean unused S3 and ECR assets from your CDK Toolkit.

#### Initializers <a name="Initializers" id="cloudstructs.ToolkitCleaner.Initializer"></a>

```typescript
import { ToolkitCleaner } from 'cloudstructs'

new ToolkitCleaner(scope: Construct, id: string, props?: ToolkitCleanerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.ToolkitCleaner.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.ToolkitCleaner.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.ToolkitCleaner.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.ToolkitCleanerProps">ToolkitCleanerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.ToolkitCleaner.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.ToolkitCleaner.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cloudstructs.ToolkitCleaner.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.ToolkitCleanerProps">ToolkitCleanerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.ToolkitCleaner.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cloudstructs.ToolkitCleaner.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.ToolkitCleaner.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.ToolkitCleaner.isConstruct"></a>

```typescript
import { ToolkitCleaner } from 'cloudstructs'

ToolkitCleaner.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.ToolkitCleaner.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.ToolkitCleaner.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.ToolkitCleaner.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### UrlShortener <a name="UrlShortener" id="cloudstructs.UrlShortener"></a>

URL shortener.

#### Initializers <a name="Initializers" id="cloudstructs.UrlShortener.Initializer"></a>

```typescript
import { UrlShortener } from 'cloudstructs'

new UrlShortener(scope: Construct, id: string, props: UrlShortenerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.UrlShortener.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cloudstructs.UrlShortener.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cloudstructs.UrlShortener.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.UrlShortenerProps">UrlShortenerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cloudstructs.UrlShortener.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cloudstructs.UrlShortener.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.UrlShortener.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.UrlShortenerProps">UrlShortenerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.UrlShortener.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cloudstructs.UrlShortener.grantInvoke">grantInvoke</a></code> | Grant access to invoke the URL shortener if protected by IAM authorization. |

---

##### `toString` <a name="toString" id="cloudstructs.UrlShortener.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantInvoke` <a name="grantInvoke" id="cloudstructs.UrlShortener.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): Grant
```

Grant access to invoke the URL shortener if protected by IAM authorization.

###### `grantee`<sup>Required</sup> <a name="grantee" id="cloudstructs.UrlShortener.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.UrlShortener.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cloudstructs.UrlShortener.isConstruct"></a>

```typescript
import { UrlShortener } from 'cloudstructs'

UrlShortener.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cloudstructs.UrlShortener.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.UrlShortener.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cloudstructs.UrlShortener.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApi</code> | The underlying API Gateway REST API. |
| <code><a href="#cloudstructs.UrlShortener.property.apiEndpoint">apiEndpoint</a></code> | <code>string</code> | The endpoint of the URL shortener API. |

---

##### `node`<sup>Required</sup> <a name="node" id="cloudstructs.UrlShortener.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `api`<sup>Required</sup> <a name="api" id="cloudstructs.UrlShortener.property.api"></a>

```typescript
public readonly api: RestApi;
```

- *Type:* aws-cdk-lib.aws_apigateway.RestApi

The underlying API Gateway REST API.

---

##### `apiEndpoint`<sup>Required</sup> <a name="apiEndpoint" id="cloudstructs.UrlShortener.property.apiEndpoint"></a>

```typescript
public readonly apiEndpoint: string;
```

- *Type:* string

The endpoint of the URL shortener API.

---


## Structs <a name="Structs" id="Structs"></a>

### CodeCommitMirrorProps <a name="CodeCommitMirrorProps" id="cloudstructs.CodeCommitMirrorProps"></a>

Properties for a CodeCommitMirror.

#### Initializer <a name="Initializer" id="cloudstructs.CodeCommitMirrorProps.Initializer"></a>

```typescript
import { CodeCommitMirrorProps } from 'cloudstructs'

const codeCommitMirrorProps: CodeCommitMirrorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirrorProps.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.ICluster</code> | The ECS cluster where to run the mirroring operation. |
| <code><a href="#cloudstructs.CodeCommitMirrorProps.property.repository">repository</a></code> | <code><a href="#cloudstructs.CodeCommitMirrorSourceRepository">CodeCommitMirrorSourceRepository</a></code> | The source repository. |
| <code><a href="#cloudstructs.CodeCommitMirrorProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | The schedule for the mirroring operation. |
| <code><a href="#cloudstructs.CodeCommitMirrorProps.property.subnetSelection">subnetSelection</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Where to run the mirroring Fargate tasks. |

---

##### `cluster`<sup>Required</sup> <a name="cluster" id="cloudstructs.CodeCommitMirrorProps.property.cluster"></a>

```typescript
public readonly cluster: ICluster;
```

- *Type:* aws-cdk-lib.aws_ecs.ICluster

The ECS cluster where to run the mirroring operation.

---

##### `repository`<sup>Required</sup> <a name="repository" id="cloudstructs.CodeCommitMirrorProps.property.repository"></a>

```typescript
public readonly repository: CodeCommitMirrorSourceRepository;
```

- *Type:* <a href="#cloudstructs.CodeCommitMirrorSourceRepository">CodeCommitMirrorSourceRepository</a>

The source repository.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cloudstructs.CodeCommitMirrorProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* everyday at midnight

The schedule for the mirroring operation.

---

##### `subnetSelection`<sup>Optional</sup> <a name="subnetSelection" id="cloudstructs.CodeCommitMirrorProps.property.subnetSelection"></a>

```typescript
public readonly subnetSelection: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* public subnets

Where to run the mirroring Fargate tasks.

---

### DmarcReporterProps <a name="DmarcReporterProps" id="cloudstructs.DmarcReporterProps"></a>

Properties for a DmarcReporter.

#### Initializer <a name="Initializer" id="cloudstructs.DmarcReporterProps.Initializer"></a>

```typescript
import { DmarcReporterProps } from 'cloudstructs'

const dmarcReporterProps: DmarcReporterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.DmarcReporterProps.property.dmarcPolicy">dmarcPolicy</a></code> | <code><a href="#cloudstructs.DmarcPolicy">DmarcPolicy</a></code> | The DMARC policy to apply to messages that fail DMARC compliance. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | A Lambda function to invoke after the message is saved to S3. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | The Route 53 hosted zone to create the DMARC record in. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.receiptRuleSet">receiptRuleSet</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRuleSet</code> | The SES receipt rule set where a receipt rule will be added. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.additionalEmailAddresses">additionalEmailAddresses</a></code> | <code>string[]</code> | Additional email addresses to send DMARC reports to. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.afterRule">afterRule</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRule</code> | An existing rule after which the new rule will be placed in the rule set. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.dmarcDkimAlignment">dmarcDkimAlignment</a></code> | <code><a href="#cloudstructs.DmarcAlignment">DmarcAlignment</a></code> | The alignment mode to use for DKIM signatures. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.dmarcPercentage">dmarcPercentage</a></code> | <code>number</code> | The percentage of messages that should be checked for DMARC compliance. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.dmarcSpfAlignment">dmarcSpfAlignment</a></code> | <code><a href="#cloudstructs.DmarcAlignment">DmarcAlignment</a></code> | The alignment mode to use for SPF signatures. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.dmarcSubdomainPolicy">dmarcSubdomainPolicy</a></code> | <code><a href="#cloudstructs.DmarcPolicy">DmarcPolicy</a></code> | The DMARC policy to apply to messages that fail DMARC compliance for subdomains. |
| <code><a href="#cloudstructs.DmarcReporterProps.property.emailAddress">emailAddress</a></code> | <code>string</code> | The email address to send DMARC reports to. |

---

##### `dmarcPolicy`<sup>Required</sup> <a name="dmarcPolicy" id="cloudstructs.DmarcReporterProps.property.dmarcPolicy"></a>

```typescript
public readonly dmarcPolicy: DmarcPolicy;
```

- *Type:* <a href="#cloudstructs.DmarcPolicy">DmarcPolicy</a>

The DMARC policy to apply to messages that fail DMARC compliance.

This can be one of the following values:
- none: Do not apply any special handling to messages that fail DMARC compliance.
- quarantine: Quarantine messages that fail DMARC compliance.
- reject: Reject messages that fail DMARC compliance.

---

##### `function`<sup>Required</sup> <a name="function" id="cloudstructs.DmarcReporterProps.property.function"></a>

```typescript
public readonly function: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

A Lambda function to invoke after the message is saved to S3.

The Lambda
function will be invoked with a SESMessage as event.

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="cloudstructs.DmarcReporterProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

The Route 53 hosted zone to create the DMARC record in.

---

##### `receiptRuleSet`<sup>Required</sup> <a name="receiptRuleSet" id="cloudstructs.DmarcReporterProps.property.receiptRuleSet"></a>

```typescript
public readonly receiptRuleSet: IReceiptRuleSet;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRuleSet

The SES receipt rule set where a receipt rule will be added.

---

##### `additionalEmailAddresses`<sup>Optional</sup> <a name="additionalEmailAddresses" id="cloudstructs.DmarcReporterProps.property.additionalEmailAddresses"></a>

```typescript
public readonly additionalEmailAddresses: string[];
```

- *Type:* string[]

Additional email addresses to send DMARC reports to.

---

##### `afterRule`<sup>Optional</sup> <a name="afterRule" id="cloudstructs.DmarcReporterProps.property.afterRule"></a>

```typescript
public readonly afterRule: IReceiptRule;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRule
- *Default:* The new rule is inserted at the beginning of the rule list.

An existing rule after which the new rule will be placed in the rule set.

---

##### `dmarcDkimAlignment`<sup>Optional</sup> <a name="dmarcDkimAlignment" id="cloudstructs.DmarcReporterProps.property.dmarcDkimAlignment"></a>

```typescript
public readonly dmarcDkimAlignment: DmarcAlignment;
```

- *Type:* <a href="#cloudstructs.DmarcAlignment">DmarcAlignment</a>
- *Default:* relaxed

The alignment mode to use for DKIM signatures.

This can be one of the following values:
- relaxed: Use relaxed alignment mode.
- strict: Use strict alignment mode.

---

##### `dmarcPercentage`<sup>Optional</sup> <a name="dmarcPercentage" id="cloudstructs.DmarcReporterProps.property.dmarcPercentage"></a>

```typescript
public readonly dmarcPercentage: number;
```

- *Type:* number
- *Default:* 100

The percentage of messages that should be checked for DMARC compliance.

This is a value between 0 and 100.

---

##### `dmarcSpfAlignment`<sup>Optional</sup> <a name="dmarcSpfAlignment" id="cloudstructs.DmarcReporterProps.property.dmarcSpfAlignment"></a>

```typescript
public readonly dmarcSpfAlignment: DmarcAlignment;
```

- *Type:* <a href="#cloudstructs.DmarcAlignment">DmarcAlignment</a>
- *Default:* relaxed

The alignment mode to use for SPF signatures.

This can be one of the following values:
- relaxed: Use relaxed alignment mode.
- strict: Use strict alignment mode.

---

##### `dmarcSubdomainPolicy`<sup>Optional</sup> <a name="dmarcSubdomainPolicy" id="cloudstructs.DmarcReporterProps.property.dmarcSubdomainPolicy"></a>

```typescript
public readonly dmarcSubdomainPolicy: DmarcPolicy;
```

- *Type:* <a href="#cloudstructs.DmarcPolicy">DmarcPolicy</a>
- *Default:* inherited from dmarcPolicy

The DMARC policy to apply to messages that fail DMARC compliance for subdomains.

This can be one of the following values:
- none: Do not apply any special handling to messages that fail DMARC compliance.
- quarantine: Quarantine messages that fail DMARC compliance.
- reject: Reject messages that fail DMARC compliance.

---

##### `emailAddress`<sup>Optional</sup> <a name="emailAddress" id="cloudstructs.DmarcReporterProps.property.emailAddress"></a>

```typescript
public readonly emailAddress: string;
```

- *Type:* string
- *Default:* dmarc-reports@${hostedZone.zoneName}

The email address to send DMARC reports to.

This email address must be verified in SES.

---

### EcsServiceRollerProps <a name="EcsServiceRollerProps" id="cloudstructs.EcsServiceRollerProps"></a>

Properties for a EcsServiceRoller.

#### Initializer <a name="Initializer" id="cloudstructs.EcsServiceRollerProps.Initializer"></a>

```typescript
import { EcsServiceRollerProps } from 'cloudstructs'

const ecsServiceRollerProps: EcsServiceRollerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.EcsServiceRollerProps.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.ICluster</code> | The ECS cluster where the services run. |
| <code><a href="#cloudstructs.EcsServiceRollerProps.property.service">service</a></code> | <code>aws-cdk-lib.aws_ecs.IService</code> | The ECS service for which tasks should be rolled. |
| <code><a href="#cloudstructs.EcsServiceRollerProps.property.trigger">trigger</a></code> | <code><a href="#cloudstructs.RollTrigger">RollTrigger</a></code> | The rule or schedule that should trigger a roll. |

---

##### `cluster`<sup>Required</sup> <a name="cluster" id="cloudstructs.EcsServiceRollerProps.property.cluster"></a>

```typescript
public readonly cluster: ICluster;
```

- *Type:* aws-cdk-lib.aws_ecs.ICluster

The ECS cluster where the services run.

---

##### `service`<sup>Required</sup> <a name="service" id="cloudstructs.EcsServiceRollerProps.property.service"></a>

```typescript
public readonly service: IService;
```

- *Type:* aws-cdk-lib.aws_ecs.IService

The ECS service for which tasks should be rolled.

---

##### `trigger`<sup>Optional</sup> <a name="trigger" id="cloudstructs.EcsServiceRollerProps.property.trigger"></a>

```typescript
public readonly trigger: RollTrigger;
```

- *Type:* <a href="#cloudstructs.RollTrigger">RollTrigger</a>
- *Default:* roll everyday at midnight

The rule or schedule that should trigger a roll.

---

### EmailReceiverProps <a name="EmailReceiverProps" id="cloudstructs.EmailReceiverProps"></a>

Properties for an EmailReceiver.

#### Initializer <a name="Initializer" id="cloudstructs.EmailReceiverProps.Initializer"></a>

```typescript
import { EmailReceiverProps } from 'cloudstructs'

const emailReceiverProps: EmailReceiverProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.EmailReceiverProps.property.function">function</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | A Lambda function to invoke after the message is saved to S3. |
| <code><a href="#cloudstructs.EmailReceiverProps.property.receiptRuleSet">receiptRuleSet</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRuleSet</code> | The SES receipt rule set where a receipt rule will be added. |
| <code><a href="#cloudstructs.EmailReceiverProps.property.recipients">recipients</a></code> | <code>string[]</code> | The recipients for which emails should be received. |
| <code><a href="#cloudstructs.EmailReceiverProps.property.afterRule">afterRule</a></code> | <code>aws-cdk-lib.aws_ses.IReceiptRule</code> | An existing rule after which the new rule will be placed in the rule set. |
| <code><a href="#cloudstructs.EmailReceiverProps.property.enabled">enabled</a></code> | <code>boolean</code> | Whether the receiver is active. |
| <code><a href="#cloudstructs.EmailReceiverProps.property.sourceWhitelist">sourceWhitelist</a></code> | <code>string</code> | A regular expression to whitelist source email addresses. |

---

##### `function`<sup>Required</sup> <a name="function" id="cloudstructs.EmailReceiverProps.property.function"></a>

```typescript
public readonly function: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

A Lambda function to invoke after the message is saved to S3.

The Lambda
function will be invoked with a SESMessage as event.

---

##### `receiptRuleSet`<sup>Required</sup> <a name="receiptRuleSet" id="cloudstructs.EmailReceiverProps.property.receiptRuleSet"></a>

```typescript
public readonly receiptRuleSet: IReceiptRuleSet;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRuleSet

The SES receipt rule set where a receipt rule will be added.

---

##### `recipients`<sup>Required</sup> <a name="recipients" id="cloudstructs.EmailReceiverProps.property.recipients"></a>

```typescript
public readonly recipients: string[];
```

- *Type:* string[]

The recipients for which emails should be received.

---

##### `afterRule`<sup>Optional</sup> <a name="afterRule" id="cloudstructs.EmailReceiverProps.property.afterRule"></a>

```typescript
public readonly afterRule: IReceiptRule;
```

- *Type:* aws-cdk-lib.aws_ses.IReceiptRule
- *Default:* The new rule is inserted at the beginning of the rule list.

An existing rule after which the new rule will be placed in the rule set.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cloudstructs.EmailReceiverProps.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the receiver is active.

---

##### `sourceWhitelist`<sup>Optional</sup> <a name="sourceWhitelist" id="cloudstructs.EmailReceiverProps.property.sourceWhitelist"></a>

```typescript
public readonly sourceWhitelist: string;
```

- *Type:* string
- *Default:* no whitelisting of source email addresses

A regular expression to whitelist source email addresses.

---

### MjmlTemplateProps <a name="MjmlTemplateProps" id="cloudstructs.MjmlTemplateProps"></a>

Properties for a MjmlTempalte.

#### Initializer <a name="Initializer" id="cloudstructs.MjmlTemplateProps.Initializer"></a>

```typescript
import { MjmlTemplateProps } from 'cloudstructs'

const mjmlTemplateProps: MjmlTemplateProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.MjmlTemplateProps.property.mjml">mjml</a></code> | <code>string</code> | The MJML of the email. |
| <code><a href="#cloudstructs.MjmlTemplateProps.property.subject">subject</a></code> | <code>string</code> | The subject line of the email. |
| <code><a href="#cloudstructs.MjmlTemplateProps.property.templateName">templateName</a></code> | <code>string</code> | The name of the template. |

---

##### `mjml`<sup>Required</sup> <a name="mjml" id="cloudstructs.MjmlTemplateProps.property.mjml"></a>

```typescript
public readonly mjml: string;
```

- *Type:* string

The MJML of the email.

---

##### `subject`<sup>Required</sup> <a name="subject" id="cloudstructs.MjmlTemplateProps.property.subject"></a>

```typescript
public readonly subject: string;
```

- *Type:* string

The subject line of the email.

---

##### `templateName`<sup>Optional</sup> <a name="templateName" id="cloudstructs.MjmlTemplateProps.property.templateName"></a>

```typescript
public readonly templateName: string;
```

- *Type:* string
- *Default:* a CloudFormation generated name

The name of the template.

---

### SamlIdentityProviderProps <a name="SamlIdentityProviderProps" id="cloudstructs.SamlIdentityProviderProps"></a>

Properties for a SamlProvider.

#### Initializer <a name="Initializer" id="cloudstructs.SamlIdentityProviderProps.Initializer"></a>

```typescript
import { SamlIdentityProviderProps } from 'cloudstructs'

const samlIdentityProviderProps: SamlIdentityProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SamlIdentityProviderProps.property.metadataDocument">metadataDocument</a></code> | <code>string</code> | An XML document generated by an identity provider (IdP) that supports SAML 2.0. |
| <code><a href="#cloudstructs.SamlIdentityProviderProps.property.name">name</a></code> | <code>string</code> | A name for the SAML identity provider. |

---

##### ~~`metadataDocument`~~<sup>Required</sup> <a name="metadataDocument" id="cloudstructs.SamlIdentityProviderProps.property.metadataDocument"></a>

- *Deprecated:* use `SamlProviderProps` from `aws-cdk-lib/aws-iam`

```typescript
public readonly metadataDocument: string;
```

- *Type:* string

An XML document generated by an identity provider (IdP) that supports SAML 2.0.

The document includes the issuer's name, expiration information, and keys that
can be used to validate the SAML authentication response (assertions) that are
received from the IdP. You must generate the metadata document using the identity
management software that is used as your organization's IdP.

---

##### ~~`name`~~<sup>Optional</sup> <a name="name" id="cloudstructs.SamlIdentityProviderProps.property.name"></a>

- *Deprecated:* use `SamlProviderProps` from `aws-cdk-lib/aws-iam`

```typescript
public readonly name: string;
```

- *Type:* string
- *Default:* derived for the node's unique id

A name for the SAML identity provider.

---

### SlackAppManifestAppHome <a name="SlackAppManifestAppHome" id="cloudstructs.SlackAppManifestAppHome"></a>

App Home configuration.

> [https://api.slack.com/surfaces/tabs](https://api.slack.com/surfaces/tabs)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestAppHome.Initializer"></a>

```typescript
import { SlackAppManifestAppHome } from 'cloudstructs'

const slackAppManifestAppHome: SlackAppManifestAppHome = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestAppHome.property.homeTab">homeTab</a></code> | <code>boolean</code> | Wether the Home tab is enabled. |
| <code><a href="#cloudstructs.SlackAppManifestAppHome.property.messagesTab">messagesTab</a></code> | <code>boolean</code> | Wether the Messages is enabled. |
| <code><a href="#cloudstructs.SlackAppManifestAppHome.property.messagesTabReadOnly">messagesTabReadOnly</a></code> | <code>boolean</code> | Whether the users can send messages to your app in the Messages tab of your App Home. |

---

##### `homeTab`<sup>Optional</sup> <a name="homeTab" id="cloudstructs.SlackAppManifestAppHome.property.homeTab"></a>

```typescript
public readonly homeTab: boolean;
```

- *Type:* boolean
- *Default:* false

Wether the Home tab is enabled.

---

##### `messagesTab`<sup>Optional</sup> <a name="messagesTab" id="cloudstructs.SlackAppManifestAppHome.property.messagesTab"></a>

```typescript
public readonly messagesTab: boolean;
```

- *Type:* boolean
- *Default:* false

Wether the Messages is enabled.

---

##### `messagesTabReadOnly`<sup>Optional</sup> <a name="messagesTabReadOnly" id="cloudstructs.SlackAppManifestAppHome.property.messagesTabReadOnly"></a>

```typescript
public readonly messagesTabReadOnly: boolean;
```

- *Type:* boolean
- *Default:* false

Whether the users can send messages to your app in the Messages tab of your App Home.

---

### SlackAppManifestEventSubscriptions <a name="SlackAppManifestEventSubscriptions" id="cloudstructs.SlackAppManifestEventSubscriptions"></a>

Events API configuration for the app.

> [https://api.slack.com/events-api](https://api.slack.com/events-api)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestEventSubscriptions.Initializer"></a>

```typescript
import { SlackAppManifestEventSubscriptions } from 'cloudstructs'

const slackAppManifestEventSubscriptions: SlackAppManifestEventSubscriptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestEventSubscriptions.property.requestUrl">requestUrl</a></code> | <code>string</code> | The full https URL that acts as the Events API request URL. |
| <code><a href="#cloudstructs.SlackAppManifestEventSubscriptions.property.botEvents">botEvents</a></code> | <code>string[]</code> | Event types you want the app to subscribe to. |
| <code><a href="#cloudstructs.SlackAppManifestEventSubscriptions.property.userEvents">userEvents</a></code> | <code>string[]</code> | Event types you want the app to subscribe to on behalf of authorized users. |

---

##### `requestUrl`<sup>Required</sup> <a name="requestUrl" id="cloudstructs.SlackAppManifestEventSubscriptions.property.requestUrl"></a>

```typescript
public readonly requestUrl: string;
```

- *Type:* string

The full https URL that acts as the Events API request URL.

> [https://api.slack.com/events-api#the-events-api__subscribing-to-event-types__events-api-request-urls](https://api.slack.com/events-api#the-events-api__subscribing-to-event-types__events-api-request-urls)

---

##### `botEvents`<sup>Optional</sup> <a name="botEvents" id="cloudstructs.SlackAppManifestEventSubscriptions.property.botEvents"></a>

```typescript
public readonly botEvents: string[];
```

- *Type:* string[]

Event types you want the app to subscribe to.

A maximum of 100 event types can be used

> [https://api.slack.com/events](https://api.slack.com/events)

---

##### `userEvents`<sup>Optional</sup> <a name="userEvents" id="cloudstructs.SlackAppManifestEventSubscriptions.property.userEvents"></a>

```typescript
public readonly userEvents: string[];
```

- *Type:* string[]

Event types you want the app to subscribe to on behalf of authorized users.

A maximum of 100 event types can be used.

---

### SlackAppManifestInteractivity <a name="SlackAppManifestInteractivity" id="cloudstructs.SlackAppManifestInteractivity"></a>

Interactivity configuration for the app.

> [https://api.slack.com/interactivity/handling#setup](https://api.slack.com/interactivity/handling#setup)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestInteractivity.Initializer"></a>

```typescript
import { SlackAppManifestInteractivity } from 'cloudstructs'

const slackAppManifestInteractivity: SlackAppManifestInteractivity = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestInteractivity.property.enabled">enabled</a></code> | <code>boolean</code> | Whether or not interactivity features are enabled. |
| <code><a href="#cloudstructs.SlackAppManifestInteractivity.property.messageMenuOptionsUrl">messageMenuOptionsUrl</a></code> | <code>string</code> | The full https URL that acts as th interactive Options Load URL. |
| <code><a href="#cloudstructs.SlackAppManifestInteractivity.property.requestUrl">requestUrl</a></code> | <code>string</code> | The full https URL that acts as the interactive Request URL. |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cloudstructs.SlackAppManifestInteractivity.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Whether or not interactivity features are enabled.

---

##### `messageMenuOptionsUrl`<sup>Optional</sup> <a name="messageMenuOptionsUrl" id="cloudstructs.SlackAppManifestInteractivity.property.messageMenuOptionsUrl"></a>

```typescript
public readonly messageMenuOptionsUrl: string;
```

- *Type:* string

The full https URL that acts as th interactive Options Load URL.

---

##### `requestUrl`<sup>Optional</sup> <a name="requestUrl" id="cloudstructs.SlackAppManifestInteractivity.property.requestUrl"></a>

```typescript
public readonly requestUrl: string;
```

- *Type:* string

The full https URL that acts as the interactive Request URL.

---

### SlackAppManifestOauthConfig <a name="SlackAppManifestOauthConfig" id="cloudstructs.SlackAppManifestOauthConfig"></a>

OAuth configuration for the app.

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestOauthConfig.Initializer"></a>

```typescript
import { SlackAppManifestOauthConfig } from 'cloudstructs'

const slackAppManifestOauthConfig: SlackAppManifestOauthConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestOauthConfig.property.botScopes">botScopes</a></code> | <code>string[]</code> | Bot scopes to request upon app installation. |
| <code><a href="#cloudstructs.SlackAppManifestOauthConfig.property.redirectUrls">redirectUrls</a></code> | <code>string[]</code> | OAuth redirect URLs. |
| <code><a href="#cloudstructs.SlackAppManifestOauthConfig.property.userScopes">userScopes</a></code> | <code>string[]</code> | User scopes to request upon app installation. |

---

##### `botScopes`<sup>Optional</sup> <a name="botScopes" id="cloudstructs.SlackAppManifestOauthConfig.property.botScopes"></a>

```typescript
public readonly botScopes: string[];
```

- *Type:* string[]

Bot scopes to request upon app installation.

A maximum of 255 scopes can be included.

> [https://api.slack.com/scopes](https://api.slack.com/scopes)

---

##### `redirectUrls`<sup>Optional</sup> <a name="redirectUrls" id="cloudstructs.SlackAppManifestOauthConfig.property.redirectUrls"></a>

```typescript
public readonly redirectUrls: string[];
```

- *Type:* string[]

OAuth redirect URLs.

A maximum of 1000 redirect URLs can be included.

> [https://api.slack.com/authentication/oauth-v2#redirect_urls](https://api.slack.com/authentication/oauth-v2#redirect_urls)

---

##### `userScopes`<sup>Optional</sup> <a name="userScopes" id="cloudstructs.SlackAppManifestOauthConfig.property.userScopes"></a>

```typescript
public readonly userScopes: string[];
```

- *Type:* string[]

User scopes to request upon app installation.

A maximum of 255 scopes can be included.

> [https://api.slack.com/scopes](https://api.slack.com/scopes)

---

### SlackAppManifestProps <a name="SlackAppManifestProps" id="cloudstructs.SlackAppManifestProps"></a>

Properties for a Slack app manifest.

> [https://api.slack.com/reference/manifests](https://api.slack.com/reference/manifests)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestProps.Initializer"></a>

```typescript
import { SlackAppManifestProps } from 'cloudstructs'

const slackAppManifestProps: SlackAppManifestProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.name">name</a></code> | <code>string</code> | The name of the app. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.allowedIpAddressRanges">allowedIpAddressRanges</a></code> | <code>string[]</code> | An array of IP addresses that conform to the Allowed IP Ranges feature. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.appHome">appHome</a></code> | <code><a href="#cloudstructs.SlackAppManifestAppHome">SlackAppManifestAppHome</a></code> | App Home configuration. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.backgroundColor">backgroundColor</a></code> | <code>string</code> | A hex color value that specifies the background color used on hovercards that display information about your app. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.botUser">botUser</a></code> | <code><a href="#cloudstructs.SlackkAppManifestBotUser">SlackkAppManifestBotUser</a></code> | Bot user configuration. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.description">description</a></code> | <code>string</code> | A short description of the app for display to users. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.eventSubscriptions">eventSubscriptions</a></code> | <code><a href="#cloudstructs.SlackAppManifestEventSubscriptions">SlackAppManifestEventSubscriptions</a></code> | Events API configuration for the app. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.interactivity">interactivity</a></code> | <code><a href="#cloudstructs.SlackAppManifestInteractivity">SlackAppManifestInteractivity</a></code> | Interactivity configuration for the app. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.longDescription">longDescription</a></code> | <code>string</code> | A longer version of the description of the app. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.majorVersion">majorVersion</a></code> | <code>number</code> | The major version of the manifest schema to target. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.minorVersion">minorVersion</a></code> | <code>number</code> | The minor version of the manifest schema to target. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.oauthConfig">oauthConfig</a></code> | <code><a href="#cloudstructs.SlackAppManifestOauthConfig">SlackAppManifestOauthConfig</a></code> | OAuth configuration for the app. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.orgDeploy">orgDeploy</a></code> | <code>boolean</code> | Whether org-wide deploy is enabled. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.shortcuts">shortcuts</a></code> | <code><a href="#cloudstructs.SlackAppManifestShortcut">SlackAppManifestShortcut</a>[]</code> | Shortcuts configuration. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.slashCommands">slashCommands</a></code> | <code><a href="#cloudstructs.SlackAppManifestSlashCommand">SlackAppManifestSlashCommand</a>[]</code> | Slash commands configuration. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.socketMode">socketMode</a></code> | <code>boolean</code> | Whether Socket Mode is enabled. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.unfurlDomains">unfurlDomains</a></code> | <code>string[]</code> | Valid unfurl domains to register. |
| <code><a href="#cloudstructs.SlackAppManifestProps.property.workflowSteps">workflowSteps</a></code> | <code><a href="#cloudstructs.SlackAppManifestWorkflowStep">SlackAppManifestWorkflowStep</a>[]</code> | Workflow steps. |

---

##### `name`<sup>Required</sup> <a name="name" id="cloudstructs.SlackAppManifestProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the app.

Maximum length is 35 characters.

---

##### `allowedIpAddressRanges`<sup>Optional</sup> <a name="allowedIpAddressRanges" id="cloudstructs.SlackAppManifestProps.property.allowedIpAddressRanges"></a>

```typescript
public readonly allowedIpAddressRanges: string[];
```

- *Type:* string[]

An array of IP addresses that conform to the Allowed IP Ranges feature.

> [https://api.slack.com/authentication/best-practices#ip_allowlisting](https://api.slack.com/authentication/best-practices#ip_allowlisting)

---

##### `appHome`<sup>Optional</sup> <a name="appHome" id="cloudstructs.SlackAppManifestProps.property.appHome"></a>

```typescript
public readonly appHome: SlackAppManifestAppHome;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestAppHome">SlackAppManifestAppHome</a>

App Home configuration.

> [https://api.slack.com/surfaces/tabs](https://api.slack.com/surfaces/tabs)

---

##### `backgroundColor`<sup>Optional</sup> <a name="backgroundColor" id="cloudstructs.SlackAppManifestProps.property.backgroundColor"></a>

```typescript
public readonly backgroundColor: string;
```

- *Type:* string

A hex color value that specifies the background color used on hovercards that display information about your app.

Can be 3-digit (#000) or 6-digit (#000000) hex values with or without #

---

##### `botUser`<sup>Optional</sup> <a name="botUser" id="cloudstructs.SlackAppManifestProps.property.botUser"></a>

```typescript
public readonly botUser: SlackkAppManifestBotUser;
```

- *Type:* <a href="#cloudstructs.SlackkAppManifestBotUser">SlackkAppManifestBotUser</a>

Bot user configuration.

> [https://api.slack.com/bot-users](https://api.slack.com/bot-users)

---

##### `description`<sup>Optional</sup> <a name="description" id="cloudstructs.SlackAppManifestProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* no short description

A short description of the app for display to users.

Maximum length is 140 characters.

---

##### `eventSubscriptions`<sup>Optional</sup> <a name="eventSubscriptions" id="cloudstructs.SlackAppManifestProps.property.eventSubscriptions"></a>

```typescript
public readonly eventSubscriptions: SlackAppManifestEventSubscriptions;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestEventSubscriptions">SlackAppManifestEventSubscriptions</a>

Events API configuration for the app.

> [https://api.slack.com/events-api](https://api.slack.com/events-api)

---

##### `interactivity`<sup>Optional</sup> <a name="interactivity" id="cloudstructs.SlackAppManifestProps.property.interactivity"></a>

```typescript
public readonly interactivity: SlackAppManifestInteractivity;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestInteractivity">SlackAppManifestInteractivity</a>

Interactivity configuration for the app.

---

##### `longDescription`<sup>Optional</sup> <a name="longDescription" id="cloudstructs.SlackAppManifestProps.property.longDescription"></a>

```typescript
public readonly longDescription: string;
```

- *Type:* string

A longer version of the description of the app.

Maximum length is 4000 characters.

---

##### `majorVersion`<sup>Optional</sup> <a name="majorVersion" id="cloudstructs.SlackAppManifestProps.property.majorVersion"></a>

```typescript
public readonly majorVersion: number;
```

- *Type:* number
- *Default:* do not target a specific major version

The major version of the manifest schema to target.

---

##### `minorVersion`<sup>Optional</sup> <a name="minorVersion" id="cloudstructs.SlackAppManifestProps.property.minorVersion"></a>

```typescript
public readonly minorVersion: number;
```

- *Type:* number
- *Default:* do not target a specific minor version

The minor version of the manifest schema to target.

---

##### `oauthConfig`<sup>Optional</sup> <a name="oauthConfig" id="cloudstructs.SlackAppManifestProps.property.oauthConfig"></a>

```typescript
public readonly oauthConfig: SlackAppManifestOauthConfig;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestOauthConfig">SlackAppManifestOauthConfig</a>

OAuth configuration for the app.

---

##### `orgDeploy`<sup>Optional</sup> <a name="orgDeploy" id="cloudstructs.SlackAppManifestProps.property.orgDeploy"></a>

```typescript
public readonly orgDeploy: boolean;
```

- *Type:* boolean
- *Default:* false

Whether org-wide deploy is enabled.

> [https://api.slack.com/enterprise/apps](https://api.slack.com/enterprise/apps)

---

##### `shortcuts`<sup>Optional</sup> <a name="shortcuts" id="cloudstructs.SlackAppManifestProps.property.shortcuts"></a>

```typescript
public readonly shortcuts: SlackAppManifestShortcut[];
```

- *Type:* <a href="#cloudstructs.SlackAppManifestShortcut">SlackAppManifestShortcut</a>[]

Shortcuts configuration.

A maximum of 5 shortcuts can be included.

> [https://api.slack.com/interactivity/shortcuts](https://api.slack.com/interactivity/shortcuts)

---

##### `slashCommands`<sup>Optional</sup> <a name="slashCommands" id="cloudstructs.SlackAppManifestProps.property.slashCommands"></a>

```typescript
public readonly slashCommands: SlackAppManifestSlashCommand[];
```

- *Type:* <a href="#cloudstructs.SlackAppManifestSlashCommand">SlackAppManifestSlashCommand</a>[]

Slash commands configuration.

A maximum of 5 slash commands can be included.

> [https://api.slack.com/interactivity/slash-commands](https://api.slack.com/interactivity/slash-commands)

---

##### `socketMode`<sup>Optional</sup> <a name="socketMode" id="cloudstructs.SlackAppManifestProps.property.socketMode"></a>

```typescript
public readonly socketMode: boolean;
```

- *Type:* boolean
- *Default:* false

Whether Socket Mode is enabled.

> [https://api.slack.com/apis/connections/socket](https://api.slack.com/apis/connections/socket)

---

##### `unfurlDomains`<sup>Optional</sup> <a name="unfurlDomains" id="cloudstructs.SlackAppManifestProps.property.unfurlDomains"></a>

```typescript
public readonly unfurlDomains: string[];
```

- *Type:* string[]

Valid unfurl domains to register.

A maximum of 5 unfurl domains can be included.

> [https://api.slack.com/reference/messaging/link-unfurling#configuring_domains](https://api.slack.com/reference/messaging/link-unfurling#configuring_domains)

---

##### `workflowSteps`<sup>Optional</sup> <a name="workflowSteps" id="cloudstructs.SlackAppManifestProps.property.workflowSteps"></a>

```typescript
public readonly workflowSteps: SlackAppManifestWorkflowStep[];
```

- *Type:* <a href="#cloudstructs.SlackAppManifestWorkflowStep">SlackAppManifestWorkflowStep</a>[]

Workflow steps.

A maximum of 10 workflow steps can be included.

> [https://api.slack.com/workflows/steps](https://api.slack.com/workflows/steps)

---

### SlackAppManifestSettings <a name="SlackAppManifestSettings" id="cloudstructs.SlackAppManifestSettings"></a>

Settings section of the app config pages.

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestSettings.Initializer"></a>

```typescript
import { SlackAppManifestSettings } from 'cloudstructs'

const slackAppManifestSettings: SlackAppManifestSettings = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestSettings.property.allowedIpAddressRanges">allowedIpAddressRanges</a></code> | <code>string[]</code> | An array of IP addresses that conform to the Allowed IP Ranges feature. |
| <code><a href="#cloudstructs.SlackAppManifestSettings.property.eventSubscriptions">eventSubscriptions</a></code> | <code><a href="#cloudstructs.SlackAppManifestEventSubscriptions">SlackAppManifestEventSubscriptions</a></code> | Events API configuration for the app. |
| <code><a href="#cloudstructs.SlackAppManifestSettings.property.interactivity">interactivity</a></code> | <code><a href="#cloudstructs.SlackAppManifestInteractivity">SlackAppManifestInteractivity</a></code> | Interactivity configuration for the app. |
| <code><a href="#cloudstructs.SlackAppManifestSettings.property.orgDeploy">orgDeploy</a></code> | <code>boolean</code> | Whether org-wide deploy is enabled. |
| <code><a href="#cloudstructs.SlackAppManifestSettings.property.socketMode">socketMode</a></code> | <code>boolean</code> | Whether Socket Mode is enabled. |

---

##### `allowedIpAddressRanges`<sup>Optional</sup> <a name="allowedIpAddressRanges" id="cloudstructs.SlackAppManifestSettings.property.allowedIpAddressRanges"></a>

```typescript
public readonly allowedIpAddressRanges: string[];
```

- *Type:* string[]

An array of IP addresses that conform to the Allowed IP Ranges feature.

> [https://api.slack.com/authentication/best-practices#ip_allowlisting](https://api.slack.com/authentication/best-practices#ip_allowlisting)

---

##### `eventSubscriptions`<sup>Optional</sup> <a name="eventSubscriptions" id="cloudstructs.SlackAppManifestSettings.property.eventSubscriptions"></a>

```typescript
public readonly eventSubscriptions: SlackAppManifestEventSubscriptions;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestEventSubscriptions">SlackAppManifestEventSubscriptions</a>

Events API configuration for the app.

> [https://api.slack.com/events-api](https://api.slack.com/events-api)

---

##### `interactivity`<sup>Optional</sup> <a name="interactivity" id="cloudstructs.SlackAppManifestSettings.property.interactivity"></a>

```typescript
public readonly interactivity: SlackAppManifestInteractivity;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestInteractivity">SlackAppManifestInteractivity</a>

Interactivity configuration for the app.

---

##### `orgDeploy`<sup>Optional</sup> <a name="orgDeploy" id="cloudstructs.SlackAppManifestSettings.property.orgDeploy"></a>

```typescript
public readonly orgDeploy: boolean;
```

- *Type:* boolean
- *Default:* false

Whether org-wide deploy is enabled.

> [https://api.slack.com/enterprise/apps](https://api.slack.com/enterprise/apps)

---

##### `socketMode`<sup>Optional</sup> <a name="socketMode" id="cloudstructs.SlackAppManifestSettings.property.socketMode"></a>

```typescript
public readonly socketMode: boolean;
```

- *Type:* boolean
- *Default:* false

Whether Socket Mode is enabled.

> [https://api.slack.com/apis/connections/socket](https://api.slack.com/apis/connections/socket)

---

### SlackAppManifestShortcut <a name="SlackAppManifestShortcut" id="cloudstructs.SlackAppManifestShortcut"></a>

Shortcut configuration.

> [https://api.slack.com/interactivity/shortcuts](https://api.slack.com/interactivity/shortcuts)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestShortcut.Initializer"></a>

```typescript
import { SlackAppManifestShortcut } from 'cloudstructs'

const slackAppManifestShortcut: SlackAppManifestShortcut = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestShortcut.property.callbackId">callbackId</a></code> | <code>string</code> | The callback ID of the shortcut. |
| <code><a href="#cloudstructs.SlackAppManifestShortcut.property.description">description</a></code> | <code>string</code> | A short description of the shortcut. |
| <code><a href="#cloudstructs.SlackAppManifestShortcut.property.name">name</a></code> | <code>string</code> | The name of the shortcut. |
| <code><a href="#cloudstructs.SlackAppManifestShortcut.property.type">type</a></code> | <code><a href="#cloudstructs.SlackAppManifestShortcutType">SlackAppManifestShortcutType</a></code> | The type of shortcut. |

---

##### `callbackId`<sup>Required</sup> <a name="callbackId" id="cloudstructs.SlackAppManifestShortcut.property.callbackId"></a>

```typescript
public readonly callbackId: string;
```

- *Type:* string

The callback ID of the shortcut.

Maximum length is 255 characters.

---

##### `description`<sup>Required</sup> <a name="description" id="cloudstructs.SlackAppManifestShortcut.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

A short description of the shortcut.

Maximum length is 150 characters

---

##### `name`<sup>Required</sup> <a name="name" id="cloudstructs.SlackAppManifestShortcut.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the shortcut.

---

##### `type`<sup>Required</sup> <a name="type" id="cloudstructs.SlackAppManifestShortcut.property.type"></a>

```typescript
public readonly type: SlackAppManifestShortcutType;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestShortcutType">SlackAppManifestShortcutType</a>

The type of shortcut.

> [https://api.slack.com/interactivity/shortcuts](https://api.slack.com/interactivity/shortcuts)

---

### SlackAppManifestSlashCommand <a name="SlackAppManifestSlashCommand" id="cloudstructs.SlackAppManifestSlashCommand"></a>

Slash command configuration.

> [https://api.slack.com/interactivity/slash-commands](https://api.slack.com/interactivity/slash-commands)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestSlashCommand.Initializer"></a>

```typescript
import { SlackAppManifestSlashCommand } from 'cloudstructs'

const slackAppManifestSlashCommand: SlackAppManifestSlashCommand = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestSlashCommand.property.command">command</a></code> | <code>string</code> | The actual slash command. |
| <code><a href="#cloudstructs.SlackAppManifestSlashCommand.property.description">description</a></code> | <code>string</code> | The description of the slash command. |
| <code><a href="#cloudstructs.SlackAppManifestSlashCommand.property.shouldEscape">shouldEscape</a></code> | <code>boolean</code> | Whether channels, users, and links typed with the slash command should be escaped. |
| <code><a href="#cloudstructs.SlackAppManifestSlashCommand.property.url">url</a></code> | <code>string</code> | The full https URL that acts as the slash command's request URL. |
| <code><a href="#cloudstructs.SlackAppManifestSlashCommand.property.usageHint">usageHint</a></code> | <code>string</code> | The short usage hint about the slash command for users. |

---

##### `command`<sup>Required</sup> <a name="command" id="cloudstructs.SlackAppManifestSlashCommand.property.command"></a>

```typescript
public readonly command: string;
```

- *Type:* string

The actual slash command.

Maximum length is 32 characters

---

##### `description`<sup>Required</sup> <a name="description" id="cloudstructs.SlackAppManifestSlashCommand.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

The description of the slash command.

Maximum length is 2000 characters.

---

##### `shouldEscape`<sup>Optional</sup> <a name="shouldEscape" id="cloudstructs.SlackAppManifestSlashCommand.property.shouldEscape"></a>

```typescript
public readonly shouldEscape: boolean;
```

- *Type:* boolean
- *Default:* false

Whether channels, users, and links typed with the slash command should be escaped.

---

##### `url`<sup>Optional</sup> <a name="url" id="cloudstructs.SlackAppManifestSlashCommand.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* string

The full https URL that acts as the slash command's request URL.

> [https://api.slack.com/interactivity/slash-commands#creating_commands](https://api.slack.com/interactivity/slash-commands#creating_commands)

---

##### `usageHint`<sup>Optional</sup> <a name="usageHint" id="cloudstructs.SlackAppManifestSlashCommand.property.usageHint"></a>

```typescript
public readonly usageHint: string;
```

- *Type:* string

The short usage hint about the slash command for users.

Maximum length is 1000 characters.

---

### SlackAppManifestWorkflowStep <a name="SlackAppManifestWorkflowStep" id="cloudstructs.SlackAppManifestWorkflowStep"></a>

Workflow step.

> [https://api.slack.com/workflows/steps](https://api.slack.com/workflows/steps)

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppManifestWorkflowStep.Initializer"></a>

```typescript
import { SlackAppManifestWorkflowStep } from 'cloudstructs'

const slackAppManifestWorkflowStep: SlackAppManifestWorkflowStep = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestWorkflowStep.property.callbackId">callbackId</a></code> | <code>string</code> | The callback ID of the workflow step. |
| <code><a href="#cloudstructs.SlackAppManifestWorkflowStep.property.name">name</a></code> | <code>string</code> | The name of the workflow step. |

---

##### `callbackId`<sup>Required</sup> <a name="callbackId" id="cloudstructs.SlackAppManifestWorkflowStep.property.callbackId"></a>

```typescript
public readonly callbackId: string;
```

- *Type:* string

The callback ID of the workflow step.

Maximum length of 50 characters.

---

##### `name`<sup>Required</sup> <a name="name" id="cloudstructs.SlackAppManifestWorkflowStep.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the workflow step.

Maximum length of 50 characters.

---

### SlackAppProps <a name="SlackAppProps" id="cloudstructs.SlackAppProps"></a>

Properties for a SlackApp.

#### Initializer <a name="Initializer" id="cloudstructs.SlackAppProps.Initializer"></a>

```typescript
import { SlackAppProps } from 'cloudstructs'

const slackAppProps: SlackAppProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppProps.property.configurationTokenSecret">configurationTokenSecret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | An AWS Secrets Manager secret containing the app configuration token. |
| <code><a href="#cloudstructs.SlackAppProps.property.manifest">manifest</a></code> | <code><a href="#cloudstructs.SlackAppManifestDefinition">SlackAppManifestDefinition</a></code> | The definition of the app manifest. |
| <code><a href="#cloudstructs.SlackAppProps.property.credentialsSecret">credentialsSecret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | The AWS Secrets Manager secret where to store the app credentials. |

---

##### `configurationTokenSecret`<sup>Required</sup> <a name="configurationTokenSecret" id="cloudstructs.SlackAppProps.property.configurationTokenSecret"></a>

```typescript
public readonly configurationTokenSecret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

An AWS Secrets Manager secret containing the app configuration token.

Must use the following JSON format:

```
{
  "refreshToken": "<token>"
}
```

---

##### `manifest`<sup>Required</sup> <a name="manifest" id="cloudstructs.SlackAppProps.property.manifest"></a>

```typescript
public readonly manifest: SlackAppManifestDefinition;
```

- *Type:* <a href="#cloudstructs.SlackAppManifestDefinition">SlackAppManifestDefinition</a>

The definition of the app manifest.

> [https://api.slack.com/reference/manifests](https://api.slack.com/reference/manifests)

---

##### `credentialsSecret`<sup>Optional</sup> <a name="credentialsSecret" id="cloudstructs.SlackAppProps.property.credentialsSecret"></a>

```typescript
public readonly credentialsSecret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret
- *Default:* a new secret is created

The AWS Secrets Manager secret where to store the app credentials.

---

### SlackEventsProps <a name="SlackEventsProps" id="cloudstructs.SlackEventsProps"></a>

Properties for a SlackEvents.

#### Initializer <a name="Initializer" id="cloudstructs.SlackEventsProps.Initializer"></a>

```typescript
import { SlackEventsProps } from 'cloudstructs'

const slackEventsProps: SlackEventsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackEventsProps.property.signingSecret">signingSecret</a></code> | <code>aws-cdk-lib.SecretValue</code> | The signing secret of the Slack app. |
| <code><a href="#cloudstructs.SlackEventsProps.property.apiName">apiName</a></code> | <code>string</code> | A name for the API Gateway resource. |
| <code><a href="#cloudstructs.SlackEventsProps.property.customEventBus">customEventBus</a></code> | <code>boolean</code> | Whether to use a custom event bus. |

---

##### `signingSecret`<sup>Required</sup> <a name="signingSecret" id="cloudstructs.SlackEventsProps.property.signingSecret"></a>

```typescript
public readonly signingSecret: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

The signing secret of the Slack app.

---

##### `apiName`<sup>Optional</sup> <a name="apiName" id="cloudstructs.SlackEventsProps.property.apiName"></a>

```typescript
public readonly apiName: string;
```

- *Type:* string
- *Default:* SlackEventsApi

A name for the API Gateway resource.

---

##### `customEventBus`<sup>Optional</sup> <a name="customEventBus" id="cloudstructs.SlackEventsProps.property.customEventBus"></a>

```typescript
public readonly customEventBus: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to use a custom event bus.

---

### SlackkAppManifestBotUser <a name="SlackkAppManifestBotUser" id="cloudstructs.SlackkAppManifestBotUser"></a>

Bot user configuration.

> [https://api.slack.com/bot-users](https://api.slack.com/bot-users)

#### Initializer <a name="Initializer" id="cloudstructs.SlackkAppManifestBotUser.Initializer"></a>

```typescript
import { SlackkAppManifestBotUser } from 'cloudstructs'

const slackkAppManifestBotUser: SlackkAppManifestBotUser = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackkAppManifestBotUser.property.displayName">displayName</a></code> | <code>string</code> | The display name of the bot user. |
| <code><a href="#cloudstructs.SlackkAppManifestBotUser.property.alwaysOnline">alwaysOnline</a></code> | <code>boolean</code> | Whether the bot user will always appear to be online. |

---

##### `displayName`<sup>Required</sup> <a name="displayName" id="cloudstructs.SlackkAppManifestBotUser.property.displayName"></a>

```typescript
public readonly displayName: string;
```

- *Type:* string

The display name of the bot user.

Maximum length is 80 characters.

---

##### `alwaysOnline`<sup>Optional</sup> <a name="alwaysOnline" id="cloudstructs.SlackkAppManifestBotUser.property.alwaysOnline"></a>

```typescript
public readonly alwaysOnline: boolean;
```

- *Type:* boolean
- *Default:* false

Whether the bot user will always appear to be online.

---

### SlackTextractProps <a name="SlackTextractProps" id="cloudstructs.SlackTextractProps"></a>

Properties for a SlackTextract.

#### Initializer <a name="Initializer" id="cloudstructs.SlackTextractProps.Initializer"></a>

```typescript
import { SlackTextractProps } from 'cloudstructs'

const slackTextractProps: SlackTextractProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackTextractProps.property.appId">appId</a></code> | <code>string</code> | The application id of the Slack app. |
| <code><a href="#cloudstructs.SlackTextractProps.property.botToken">botToken</a></code> | <code>aws-cdk-lib.SecretValue</code> | The **bot** token of the Slack app. |
| <code><a href="#cloudstructs.SlackTextractProps.property.signingSecret">signingSecret</a></code> | <code>aws-cdk-lib.SecretValue</code> | The signing secret of the Slack app. |

---

##### `appId`<sup>Required</sup> <a name="appId" id="cloudstructs.SlackTextractProps.property.appId"></a>

```typescript
public readonly appId: string;
```

- *Type:* string

The application id of the Slack app.

---

##### `botToken`<sup>Required</sup> <a name="botToken" id="cloudstructs.SlackTextractProps.property.botToken"></a>

```typescript
public readonly botToken: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

The **bot** token of the Slack app.

The following scopes are required: `chat:write` and `files:read`

---

##### `signingSecret`<sup>Required</sup> <a name="signingSecret" id="cloudstructs.SlackTextractProps.property.signingSecret"></a>

```typescript
public readonly signingSecret: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

The signing secret of the Slack app.

---

### SslServerTestProps <a name="SslServerTestProps" id="cloudstructs.SslServerTestProps"></a>

Properties for a SslServerTest.

#### Initializer <a name="Initializer" id="cloudstructs.SslServerTestProps.Initializer"></a>

```typescript
import { SslServerTestProps } from 'cloudstructs'

const sslServerTestProps: SslServerTestProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SslServerTestProps.property.host">host</a></code> | <code>string</code> | The hostname to test. |
| <code><a href="#cloudstructs.SslServerTestProps.property.alarmTopic">alarmTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The topic to which the results must be sent when the grade is below the minimum grade. |
| <code><a href="#cloudstructs.SslServerTestProps.property.minimumGrade">minimumGrade</a></code> | <code><a href="#cloudstructs.SslServerTestGrade">SslServerTestGrade</a></code> | Minimum grade for the test. The grade is calculated using the worst grade of all endpoints. |
| <code><a href="#cloudstructs.SslServerTestProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | The schedule for the test. |

---

##### `host`<sup>Required</sup> <a name="host" id="cloudstructs.SslServerTestProps.property.host"></a>

```typescript
public readonly host: string;
```

- *Type:* string

The hostname to test.

---

##### `alarmTopic`<sup>Optional</sup> <a name="alarmTopic" id="cloudstructs.SslServerTestProps.property.alarmTopic"></a>

```typescript
public readonly alarmTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic
- *Default:* a new topic is created

The topic to which the results must be sent when the grade is below the minimum grade.

---

##### `minimumGrade`<sup>Optional</sup> <a name="minimumGrade" id="cloudstructs.SslServerTestProps.property.minimumGrade"></a>

```typescript
public readonly minimumGrade: SslServerTestGrade;
```

- *Type:* <a href="#cloudstructs.SslServerTestGrade">SslServerTestGrade</a>
- *Default:* SslServerTestGrade.A_PLUS

Minimum grade for the test. The grade is calculated using the worst grade of all endpoints.

Used to send the results to an alarm SNS topic.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cloudstructs.SslServerTestProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* every day

The schedule for the test.

---

### StateMachineCustomResourceProviderProps <a name="StateMachineCustomResourceProviderProps" id="cloudstructs.StateMachineCustomResourceProviderProps"></a>

Properties for a StateMachineCustomResourceProvider.

#### Initializer <a name="Initializer" id="cloudstructs.StateMachineCustomResourceProviderProps.Initializer"></a>

```typescript
import { StateMachineCustomResourceProviderProps } from 'cloudstructs'

const stateMachineCustomResourceProviderProps: StateMachineCustomResourceProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.StateMachineCustomResourceProviderProps.property.stateMachine">stateMachine</a></code> | <code><a href="#cloudstructs.IStateMachine">IStateMachine</a></code> | The state machine. |
| <code><a href="#cloudstructs.StateMachineCustomResourceProviderProps.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | Timeout. |

---

##### `stateMachine`<sup>Required</sup> <a name="stateMachine" id="cloudstructs.StateMachineCustomResourceProviderProps.property.stateMachine"></a>

```typescript
public readonly stateMachine: IStateMachine;
```

- *Type:* <a href="#cloudstructs.IStateMachine">IStateMachine</a>

The state machine.

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="cloudstructs.StateMachineCustomResourceProviderProps.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(30)

Timeout.

---

### StaticWebsiteProps <a name="StaticWebsiteProps" id="cloudstructs.StaticWebsiteProps"></a>

Properties for a StaticWebsite.

#### Initializer <a name="Initializer" id="cloudstructs.StaticWebsiteProps.Initializer"></a>

```typescript
import { StaticWebsiteProps } from 'cloudstructs'

const staticWebsiteProps: StaticWebsiteProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.domainName">domainName</a></code> | <code>string</code> | The domain name for this static website. |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | The hosted zone where records should be added. |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.backendConfiguration">backendConfiguration</a></code> | <code>any</code> | A backend configuration that will be saved as `config.json` in the S3 bucket of the static website. |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.cachePolicy">cachePolicy</a></code> | <code>aws-cdk-lib.aws_cloudfront.ICachePolicy</code> | Cache policy for the default behavior. |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.edgeLambdas">edgeLambdas</a></code> | <code>aws-cdk-lib.aws_cloudfront.EdgeLambda[]</code> | The Lambda@Edge functions to invoke before serving the contents. |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.redirects">redirects</a></code> | <code>string[]</code> | A list of domain names that should redirect to `domainName`. |
| <code><a href="#cloudstructs.StaticWebsiteProps.property.responseHeadersPolicy">responseHeadersPolicy</a></code> | <code>aws-cdk-lib.aws_cloudfront.ResponseHeadersPolicy</code> | Response headers policy for the default behavior. |

---

##### `domainName`<sup>Required</sup> <a name="domainName" id="cloudstructs.StaticWebsiteProps.property.domainName"></a>

```typescript
public readonly domainName: string;
```

- *Type:* string

The domain name for this static website.

---

*Example*

```typescript
www.my-static-website.com
```


##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="cloudstructs.StaticWebsiteProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

The hosted zone where records should be added.

---

##### `backendConfiguration`<sup>Optional</sup> <a name="backendConfiguration" id="cloudstructs.StaticWebsiteProps.property.backendConfiguration"></a>

```typescript
public readonly backendConfiguration: any;
```

- *Type:* any

A backend configuration that will be saved as `config.json` in the S3 bucket of the static website.

The frontend can query this config by doing `fetch('/config.json')`.

---

*Example*

```typescript
{ userPoolId: '1234', apiEndoint: 'https://www.my-api.com/api' }
```


##### `cachePolicy`<sup>Optional</sup> <a name="cachePolicy" id="cloudstructs.StaticWebsiteProps.property.cachePolicy"></a>

```typescript
public readonly cachePolicy: ICachePolicy;
```

- *Type:* aws-cdk-lib.aws_cloudfront.ICachePolicy
- *Default:* CachePolicy.CACHING_OPTIMIZED

Cache policy for the default behavior.

---

##### `edgeLambdas`<sup>Optional</sup> <a name="edgeLambdas" id="cloudstructs.StaticWebsiteProps.property.edgeLambdas"></a>

```typescript
public readonly edgeLambdas: EdgeLambda[];
```

- *Type:* aws-cdk-lib.aws_cloudfront.EdgeLambda[]
- *Default:* an origin request function that redirects all requests for a path to /index.html

The Lambda@Edge functions to invoke before serving the contents.

---

##### `redirects`<sup>Optional</sup> <a name="redirects" id="cloudstructs.StaticWebsiteProps.property.redirects"></a>

```typescript
public readonly redirects: string[];
```

- *Type:* string[]
- *Default:* the domain name of the hosted zone

A list of domain names that should redirect to `domainName`.

---

##### `responseHeadersPolicy`<sup>Optional</sup> <a name="responseHeadersPolicy" id="cloudstructs.StaticWebsiteProps.property.responseHeadersPolicy"></a>

```typescript
public readonly responseHeadersPolicy: ResponseHeadersPolicy;
```

- *Type:* aws-cdk-lib.aws_cloudfront.ResponseHeadersPolicy
- *Default:* a new policy is created with best practice security headers

Response headers policy for the default behavior.

---

### ToolkitCleanerProps <a name="ToolkitCleanerProps" id="cloudstructs.ToolkitCleanerProps"></a>

Properties for a ToolkitCleaner.

#### Initializer <a name="Initializer" id="cloudstructs.ToolkitCleanerProps.Initializer"></a>

```typescript
import { ToolkitCleanerProps } from 'cloudstructs'

const toolkitCleanerProps: ToolkitCleanerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.ToolkitCleanerProps.property.dryRun">dryRun</a></code> | <code>boolean</code> | Only output number of assets and total size that would be deleted but without actually deleting assets. |
| <code><a href="#cloudstructs.ToolkitCleanerProps.property.retainAssetsNewerThan">retainAssetsNewerThan</a></code> | <code>aws-cdk-lib.Duration</code> | Retain unused assets that were created recently. |
| <code><a href="#cloudstructs.ToolkitCleanerProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | The schedule for the cleaner. |
| <code><a href="#cloudstructs.ToolkitCleanerProps.property.scheduleEnabled">scheduleEnabled</a></code> | <code>boolean</code> | Whether to clean on schedule. |

---

##### `dryRun`<sup>Optional</sup> <a name="dryRun" id="cloudstructs.ToolkitCleanerProps.property.dryRun"></a>

```typescript
public readonly dryRun: boolean;
```

- *Type:* boolean

Only output number of assets and total size that would be deleted but without actually deleting assets.

---

##### `retainAssetsNewerThan`<sup>Optional</sup> <a name="retainAssetsNewerThan" id="cloudstructs.ToolkitCleanerProps.property.retainAssetsNewerThan"></a>

```typescript
public readonly retainAssetsNewerThan: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* all unused assets are removed

Retain unused assets that were created recently.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cloudstructs.ToolkitCleanerProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* every day

The schedule for the cleaner.

---

##### `scheduleEnabled`<sup>Optional</sup> <a name="scheduleEnabled" id="cloudstructs.ToolkitCleanerProps.property.scheduleEnabled"></a>

```typescript
public readonly scheduleEnabled: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to clean on schedule.

If you'd like to run the cleanup manually
via the console, set to `false`.

---

### UrlShortenerProps <a name="UrlShortenerProps" id="cloudstructs.UrlShortenerProps"></a>

Properties for a UrlShortener.

#### Initializer <a name="Initializer" id="cloudstructs.UrlShortenerProps.Initializer"></a>

```typescript
import { UrlShortenerProps } from 'cloudstructs'

const urlShortenerProps: UrlShortenerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.UrlShortenerProps.property.hostedZone">hostedZone</a></code> | <code>aws-cdk-lib.aws_route53.IHostedZone</code> | The hosted zone for the short URLs domain. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.apiGatewayAuthorizer">apiGatewayAuthorizer</a></code> | <code>aws-cdk-lib.aws_apigateway.IAuthorizer</code> | Authorizer for API gateway. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.apiGatewayEndpoint">apiGatewayEndpoint</a></code> | <code>aws-cdk-lib.aws_ec2.IInterfaceVpcEndpoint</code> | An interface VPC endpoint for API gateway. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.bucketName">bucketName</a></code> | <code>string</code> | A name for the bucket saving the redirects. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.corsAllowOrigins">corsAllowOrigins</a></code> | <code>string[]</code> | Allowed origins for CORS. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.expiration">expiration</a></code> | <code>aws-cdk-lib.Duration</code> | Expiration for short urls. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.iamAuthorization">iamAuthorization</a></code> | <code>boolean</code> | Whether to use IAM authorization. |
| <code><a href="#cloudstructs.UrlShortenerProps.property.recordName">recordName</a></code> | <code>string</code> | The record name to use in the hosted zone. |

---

##### `hostedZone`<sup>Required</sup> <a name="hostedZone" id="cloudstructs.UrlShortenerProps.property.hostedZone"></a>

```typescript
public readonly hostedZone: IHostedZone;
```

- *Type:* aws-cdk-lib.aws_route53.IHostedZone

The hosted zone for the short URLs domain.

---

##### `apiGatewayAuthorizer`<sup>Optional</sup> <a name="apiGatewayAuthorizer" id="cloudstructs.UrlShortenerProps.property.apiGatewayAuthorizer"></a>

```typescript
public readonly apiGatewayAuthorizer: IAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigateway.IAuthorizer
- *Default:* do not use an authorizer for the API

Authorizer for API gateway.

---

##### `apiGatewayEndpoint`<sup>Optional</sup> <a name="apiGatewayEndpoint" id="cloudstructs.UrlShortenerProps.property.apiGatewayEndpoint"></a>

```typescript
public readonly apiGatewayEndpoint: IInterfaceVpcEndpoint;
```

- *Type:* aws-cdk-lib.aws_ec2.IInterfaceVpcEndpoint
- *Default:* API is public

An interface VPC endpoint for API gateway.

Specifying this property will
make the API private.

> [https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html)

---

##### `bucketName`<sup>Optional</sup> <a name="bucketName" id="cloudstructs.UrlShortenerProps.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string
- *Default:* derived from short link domain name

A name for the bucket saving the redirects.

---

##### `corsAllowOrigins`<sup>Optional</sup> <a name="corsAllowOrigins" id="cloudstructs.UrlShortenerProps.property.corsAllowOrigins"></a>

```typescript
public readonly corsAllowOrigins: string[];
```

- *Type:* string[]
- *Default:* CORS is not enabled

Allowed origins for CORS.

---

##### `expiration`<sup>Optional</sup> <a name="expiration" id="cloudstructs.UrlShortenerProps.property.expiration"></a>

```typescript
public readonly expiration: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* cdk.Duration.days(365)

Expiration for short urls.

---

##### `iamAuthorization`<sup>Optional</sup> <a name="iamAuthorization" id="cloudstructs.UrlShortenerProps.property.iamAuthorization"></a>

```typescript
public readonly iamAuthorization: boolean;
```

- *Type:* boolean
- *Default:* do not use IAM authorization

Whether to use IAM authorization.

---

##### `recordName`<sup>Optional</sup> <a name="recordName" id="cloudstructs.UrlShortenerProps.property.recordName"></a>

```typescript
public readonly recordName: string;
```

- *Type:* string
- *Default:* zone root

The record name to use in the hosted zone.

---

## Classes <a name="Classes" id="Classes"></a>

### CodeCommitMirrorSourceRepository <a name="CodeCommitMirrorSourceRepository" id="cloudstructs.CodeCommitMirrorSourceRepository"></a>

A source repository for AWS CodeCommit mirroring.

#### Initializers <a name="Initializers" id="cloudstructs.CodeCommitMirrorSourceRepository.Initializer"></a>

```typescript
import { CodeCommitMirrorSourceRepository } from 'cloudstructs'

new CodeCommitMirrorSourceRepository()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirrorSourceRepository.gitHub">gitHub</a></code> | Public GitHub repository. |
| <code><a href="#cloudstructs.CodeCommitMirrorSourceRepository.private">private</a></code> | Private repository with HTTPS clone URL stored in a AWS Secrets Manager secret or a AWS Systems Manager secure string parameter. |

---

##### `gitHub` <a name="gitHub" id="cloudstructs.CodeCommitMirrorSourceRepository.gitHub"></a>

```typescript
import { CodeCommitMirrorSourceRepository } from 'cloudstructs'

CodeCommitMirrorSourceRepository.gitHub(owner: string, name: string)
```

Public GitHub repository.

###### `owner`<sup>Required</sup> <a name="owner" id="cloudstructs.CodeCommitMirrorSourceRepository.gitHub.parameter.owner"></a>

- *Type:* string

---

###### `name`<sup>Required</sup> <a name="name" id="cloudstructs.CodeCommitMirrorSourceRepository.gitHub.parameter.name"></a>

- *Type:* string

---

##### `private` <a name="private" id="cloudstructs.CodeCommitMirrorSourceRepository.private"></a>

```typescript
import { CodeCommitMirrorSourceRepository } from 'cloudstructs'

CodeCommitMirrorSourceRepository.private(name: string, url: Secret)
```

Private repository with HTTPS clone URL stored in a AWS Secrets Manager secret or a AWS Systems Manager secure string parameter.

###### `name`<sup>Required</sup> <a name="name" id="cloudstructs.CodeCommitMirrorSourceRepository.private.parameter.name"></a>

- *Type:* string

the repository name.

---

###### `url`<sup>Required</sup> <a name="url" id="cloudstructs.CodeCommitMirrorSourceRepository.private.parameter.url"></a>

- *Type:* aws-cdk-lib.aws_ecs.Secret

the secret containing the HTTPS clone URL.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.CodeCommitMirrorSourceRepository.property.name">name</a></code> | <code>string</code> | The name of the repository. |
| <code><a href="#cloudstructs.CodeCommitMirrorSourceRepository.property.plainTextUrl">plainTextUrl</a></code> | <code>string</code> | The HTTPS clone URL in plain text, used for a public repository. |
| <code><a href="#cloudstructs.CodeCommitMirrorSourceRepository.property.secretUrl">secretUrl</a></code> | <code>aws-cdk-lib.aws_ecs.Secret</code> | The HTTPS clone URL if the repository is private. |

---

##### `name`<sup>Required</sup> <a name="name" id="cloudstructs.CodeCommitMirrorSourceRepository.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the repository.

---

##### `plainTextUrl`<sup>Optional</sup> <a name="plainTextUrl" id="cloudstructs.CodeCommitMirrorSourceRepository.property.plainTextUrl"></a>

```typescript
public readonly plainTextUrl: string;
```

- *Type:* string

The HTTPS clone URL in plain text, used for a public repository.

---

##### `secretUrl`<sup>Optional</sup> <a name="secretUrl" id="cloudstructs.CodeCommitMirrorSourceRepository.property.secretUrl"></a>

```typescript
public readonly secretUrl: Secret;
```

- *Type:* aws-cdk-lib.aws_ecs.Secret

The HTTPS clone URL if the repository is private.

The secret should contain the username and/or token.

---

*Example*

```typescript
`https://TOKEN@github.com/owner/name`
`https://USERNAME:TOKEN@bitbucket.org/owner/name.git`
```



### RollTrigger <a name="RollTrigger" id="cloudstructs.RollTrigger"></a>

The rule or schedule that should trigger a roll.

#### Initializers <a name="Initializers" id="cloudstructs.RollTrigger.Initializer"></a>

```typescript
import { RollTrigger } from 'cloudstructs'

new RollTrigger()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.RollTrigger.fromRule">fromRule</a></code> | Rule that should trigger a roll. |
| <code><a href="#cloudstructs.RollTrigger.fromSchedule">fromSchedule</a></code> | Schedule that should trigger a roll. |

---

##### `fromRule` <a name="fromRule" id="cloudstructs.RollTrigger.fromRule"></a>

```typescript
import { RollTrigger } from 'cloudstructs'

RollTrigger.fromRule(rule: Rule)
```

Rule that should trigger a roll.

###### `rule`<sup>Required</sup> <a name="rule" id="cloudstructs.RollTrigger.fromRule.parameter.rule"></a>

- *Type:* aws-cdk-lib.aws_events.Rule

---

##### `fromSchedule` <a name="fromSchedule" id="cloudstructs.RollTrigger.fromSchedule"></a>

```typescript
import { RollTrigger } from 'cloudstructs'

RollTrigger.fromSchedule(schedule: Schedule)
```

Schedule that should trigger a roll.

###### `schedule`<sup>Required</sup> <a name="schedule" id="cloudstructs.RollTrigger.fromSchedule.parameter.schedule"></a>

- *Type:* aws-cdk-lib.aws_events.Schedule

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.RollTrigger.property.rule">rule</a></code> | <code>aws-cdk-lib.aws_events.Rule</code> | Roll rule. |
| <code><a href="#cloudstructs.RollTrigger.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | Roll schedule. |

---

##### `rule`<sup>Optional</sup> <a name="rule" id="cloudstructs.RollTrigger.property.rule"></a>

```typescript
public readonly rule: Rule;
```

- *Type:* aws-cdk-lib.aws_events.Rule
- *Default:* roll everyday at midnight

Roll rule.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="cloudstructs.RollTrigger.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* roll everyday at midnight

Roll schedule.

---


### SamlFederatedPrincipal <a name="SamlFederatedPrincipal" id="cloudstructs.SamlFederatedPrincipal"></a>

Principal entity that represents a SAML federated identity provider.

#### Initializers <a name="Initializers" id="cloudstructs.SamlFederatedPrincipal.Initializer"></a>

```typescript
import { SamlFederatedPrincipal } from 'cloudstructs'

new SamlFederatedPrincipal(identityProvider: SamlIdentityProvider)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.Initializer.parameter.identityProvider">identityProvider</a></code> | <code><a href="#cloudstructs.SamlIdentityProvider">SamlIdentityProvider</a></code> | *No description.* |

---

##### `identityProvider`<sup>Required</sup> <a name="identityProvider" id="cloudstructs.SamlFederatedPrincipal.Initializer.parameter.identityProvider"></a>

- *Type:* <a href="#cloudstructs.SamlIdentityProvider">SamlIdentityProvider</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.addToAssumeRolePolicy">addToAssumeRolePolicy</a></code> | Add the principal to the AssumeRolePolicyDocument. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.addToPolicy">addToPolicy</a></code> | Add to the policy of this principal. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.addToPrincipalPolicy">addToPrincipalPolicy</a></code> | Add to the policy of this principal. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.dedupeString">dedupeString</a></code> | Return whether or not this principal is equal to the given principal. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.toJSON">toJSON</a></code> | JSON-ify the principal. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.toString">toString</a></code> | Returns a string representation of an object. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.withConditions">withConditions</a></code> | Returns a new PrincipalWithConditions using this principal as the base, with the passed conditions added. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.withSessionTags">withSessionTags</a></code> | Returns a new principal using this principal as the base, with session tags enabled. |

---

##### ~~`addToAssumeRolePolicy`~~ <a name="addToAssumeRolePolicy" id="cloudstructs.SamlFederatedPrincipal.addToAssumeRolePolicy"></a>

```typescript
public addToAssumeRolePolicy(document: PolicyDocument): void
```

Add the principal to the AssumeRolePolicyDocument.

Add the statements to the AssumeRolePolicyDocument necessary to give this principal
permissions to assume the given role.

###### `document`<sup>Required</sup> <a name="document" id="cloudstructs.SamlFederatedPrincipal.addToAssumeRolePolicy.parameter.document"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

---

##### ~~`addToPolicy`~~ <a name="addToPolicy" id="cloudstructs.SamlFederatedPrincipal.addToPolicy"></a>

```typescript
public addToPolicy(statement: PolicyStatement): boolean
```

Add to the policy of this principal.

###### `statement`<sup>Required</sup> <a name="statement" id="cloudstructs.SamlFederatedPrincipal.addToPolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### ~~`addToPrincipalPolicy`~~ <a name="addToPrincipalPolicy" id="cloudstructs.SamlFederatedPrincipal.addToPrincipalPolicy"></a>

```typescript
public addToPrincipalPolicy(_statement: PolicyStatement): AddToPrincipalPolicyResult
```

Add to the policy of this principal.

###### `_statement`<sup>Required</sup> <a name="_statement" id="cloudstructs.SamlFederatedPrincipal.addToPrincipalPolicy.parameter._statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### ~~`dedupeString`~~ <a name="dedupeString" id="cloudstructs.SamlFederatedPrincipal.dedupeString"></a>

```typescript
public dedupeString(): string
```

Return whether or not this principal is equal to the given principal.

##### ~~`toJSON`~~ <a name="toJSON" id="cloudstructs.SamlFederatedPrincipal.toJSON"></a>

```typescript
public toJSON(): {[ key: string ]: string[]}
```

JSON-ify the principal.

Used when JSON.stringify() is called

##### ~~`toString`~~ <a name="toString" id="cloudstructs.SamlFederatedPrincipal.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of an object.

##### ~~`withConditions`~~ <a name="withConditions" id="cloudstructs.SamlFederatedPrincipal.withConditions"></a>

```typescript
public withConditions(conditions: {[ key: string ]: any}): PrincipalBase
```

Returns a new PrincipalWithConditions using this principal as the base, with the passed conditions added.

When there is a value for the same operator and key in both the principal and the
conditions parameter, the value from the conditions parameter will be used.

###### `conditions`<sup>Required</sup> <a name="conditions" id="cloudstructs.SamlFederatedPrincipal.withConditions.parameter.conditions"></a>

- *Type:* {[ key: string ]: any}

---

##### ~~`withSessionTags`~~ <a name="withSessionTags" id="cloudstructs.SamlFederatedPrincipal.withSessionTags"></a>

```typescript
public withSessionTags(): PrincipalBase
```

Returns a new principal using this principal as the base, with session tags enabled.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.property.assumeRoleAction">assumeRoleAction</a></code> | <code>string</code> | When this Principal is used in an AssumeRole policy, the action to use. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal to grant permissions to. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.property.policyFragment">policyFragment</a></code> | <code>aws-cdk-lib.aws_iam.PrincipalPolicyFragment</code> | Return the policy fragment that identifies this principal in a Policy. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.property.principalAccount">principalAccount</a></code> | <code>string</code> | The AWS account ID of this principal. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.property.conditions">conditions</a></code> | <code>{[ key: string ]: any}</code> | The conditions under which the policy is in effect. |
| <code><a href="#cloudstructs.SamlFederatedPrincipal.property.federated">federated</a></code> | <code>string</code> | federated identity provider (i.e. 'cognito-identity.amazonaws.com' for users authenticated through Cognito). |

---

##### ~~`assumeRoleAction`~~<sup>Required</sup> <a name="assumeRoleAction" id="cloudstructs.SamlFederatedPrincipal.property.assumeRoleAction"></a>

- *Deprecated:* use `SamlPrincipal` from `aws-cdk-lib/aws-iam`

```typescript
public readonly assumeRoleAction: string;
```

- *Type:* string

When this Principal is used in an AssumeRole policy, the action to use.

---

##### ~~`grantPrincipal`~~<sup>Required</sup> <a name="grantPrincipal" id="cloudstructs.SamlFederatedPrincipal.property.grantPrincipal"></a>

- *Deprecated:* use `SamlPrincipal` from `aws-cdk-lib/aws-iam`

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal to grant permissions to.

---

##### ~~`policyFragment`~~<sup>Required</sup> <a name="policyFragment" id="cloudstructs.SamlFederatedPrincipal.property.policyFragment"></a>

- *Deprecated:* use `SamlPrincipal` from `aws-cdk-lib/aws-iam`

```typescript
public readonly policyFragment: PrincipalPolicyFragment;
```

- *Type:* aws-cdk-lib.aws_iam.PrincipalPolicyFragment

Return the policy fragment that identifies this principal in a Policy.

---

##### ~~`principalAccount`~~<sup>Optional</sup> <a name="principalAccount" id="cloudstructs.SamlFederatedPrincipal.property.principalAccount"></a>

- *Deprecated:* use `SamlPrincipal` from `aws-cdk-lib/aws-iam`

```typescript
public readonly principalAccount: string;
```

- *Type:* string

The AWS account ID of this principal.

Can be undefined when the account is not known
(for example, for service principals).
Can be a Token - in that case,
it's assumed to be AWS::AccountId.

---

##### ~~`conditions`~~<sup>Required</sup> <a name="conditions" id="cloudstructs.SamlFederatedPrincipal.property.conditions"></a>

- *Deprecated:* use `SamlPrincipal` from `aws-cdk-lib/aws-iam`

```typescript
public readonly conditions: {[ key: string ]: any};
```

- *Type:* {[ key: string ]: any}

The conditions under which the policy is in effect.

> [https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html)

---

##### ~~`federated`~~<sup>Required</sup> <a name="federated" id="cloudstructs.SamlFederatedPrincipal.property.federated"></a>

- *Deprecated:* use `SamlPrincipal` from `aws-cdk-lib/aws-iam`

```typescript
public readonly federated: string;
```

- *Type:* string

federated identity provider (i.e. 'cognito-identity.amazonaws.com' for users authenticated through Cognito).

---


### SlackAppManifest <a name="SlackAppManifest" id="cloudstructs.SlackAppManifest"></a>

A Slack app manifest.

> [https://api.slack.com/reference/manifests](https://api.slack.com/reference/manifests)

#### Initializers <a name="Initializers" id="cloudstructs.SlackAppManifest.Initializer"></a>

```typescript
import { SlackAppManifest } from 'cloudstructs'

new SlackAppManifest(props: SlackAppManifestProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.SlackAppManifest.Initializer.parameter.props">props</a></code> | <code><a href="#cloudstructs.SlackAppManifestProps">SlackAppManifestProps</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SlackAppManifest.Initializer.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SlackAppManifestProps">SlackAppManifestProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackAppManifest.render">render</a></code> | *No description.* |

---

##### `render` <a name="render" id="cloudstructs.SlackAppManifest.render"></a>

```typescript
public render(construct: IConstruct): string
```

###### `construct`<sup>Required</sup> <a name="construct" id="cloudstructs.SlackAppManifest.render.parameter.construct"></a>

- *Type:* constructs.IConstruct

---




### SlackAppManifestDefinition <a name="SlackAppManifestDefinition" id="cloudstructs.SlackAppManifestDefinition"></a>

A Slack app manifest definition.

#### Initializers <a name="Initializers" id="cloudstructs.SlackAppManifestDefinition.Initializer"></a>

```typescript
import { SlackAppManifestDefinition } from 'cloudstructs'

new SlackAppManifestDefinition()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestDefinition.render">render</a></code> | Renders the JSON app manifest encoded as a string. |

---

##### `render` <a name="render" id="cloudstructs.SlackAppManifestDefinition.render"></a>

```typescript
public render(construct: IConstruct): string
```

Renders the JSON app manifest encoded as a string.

###### `construct`<sup>Required</sup> <a name="construct" id="cloudstructs.SlackAppManifestDefinition.render.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestDefinition.fromFile">fromFile</a></code> | Creates a Slack app manifest from a file containg a JSON app manifest. |
| <code><a href="#cloudstructs.SlackAppManifestDefinition.fromManifest">fromManifest</a></code> | Creates a Slack app manifest by specifying properties. |
| <code><a href="#cloudstructs.SlackAppManifestDefinition.fromString">fromString</a></code> | Create a Slack app manifest from a JSON app manifest encoded as a string. |

---

##### `fromFile` <a name="fromFile" id="cloudstructs.SlackAppManifestDefinition.fromFile"></a>

```typescript
import { SlackAppManifestDefinition } from 'cloudstructs'

SlackAppManifestDefinition.fromFile(file: string)
```

Creates a Slack app manifest from a file containg a JSON app manifest.

###### `file`<sup>Required</sup> <a name="file" id="cloudstructs.SlackAppManifestDefinition.fromFile.parameter.file"></a>

- *Type:* string

---

##### `fromManifest` <a name="fromManifest" id="cloudstructs.SlackAppManifestDefinition.fromManifest"></a>

```typescript
import { SlackAppManifestDefinition } from 'cloudstructs'

SlackAppManifestDefinition.fromManifest(props: SlackAppManifestProps)
```

Creates a Slack app manifest by specifying properties.

###### `props`<sup>Required</sup> <a name="props" id="cloudstructs.SlackAppManifestDefinition.fromManifest.parameter.props"></a>

- *Type:* <a href="#cloudstructs.SlackAppManifestProps">SlackAppManifestProps</a>

---

##### `fromString` <a name="fromString" id="cloudstructs.SlackAppManifestDefinition.fromString"></a>

```typescript
import { SlackAppManifestDefinition } from 'cloudstructs'

SlackAppManifestDefinition.fromString(manifest: string)
```

Create a Slack app manifest from a JSON app manifest encoded as a string.

###### `manifest`<sup>Required</sup> <a name="manifest" id="cloudstructs.SlackAppManifestDefinition.fromString.parameter.manifest"></a>

- *Type:* string

---



## Protocols <a name="Protocols" id="Protocols"></a>

### IStateMachine <a name="IStateMachine" id="cloudstructs.IStateMachine"></a>

- *Implemented By:* <a href="#cloudstructs.IStateMachine">IStateMachine</a>

A State Machine.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cloudstructs.IStateMachine.property.stateMachineArn">stateMachineArn</a></code> | <code>string</code> | The ARN of the state machine. |

---

##### `stateMachineArn`<sup>Required</sup> <a name="stateMachineArn" id="cloudstructs.IStateMachine.property.stateMachineArn"></a>

```typescript
public readonly stateMachineArn: string;
```

- *Type:* string

The ARN of the state machine.

---

## Enums <a name="Enums" id="Enums"></a>

### DmarcAlignment <a name="DmarcAlignment" id="cloudstructs.DmarcAlignment"></a>

The DMARC alignment mode.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.DmarcAlignment.RELAXED">RELAXED</a></code> | Relaxed alignment mode. |
| <code><a href="#cloudstructs.DmarcAlignment.STRICT">STRICT</a></code> | Strict alignment mode. |

---

##### `RELAXED` <a name="RELAXED" id="cloudstructs.DmarcAlignment.RELAXED"></a>

Relaxed alignment mode.

---


##### `STRICT` <a name="STRICT" id="cloudstructs.DmarcAlignment.STRICT"></a>

Strict alignment mode.

---


### DmarcPolicy <a name="DmarcPolicy" id="cloudstructs.DmarcPolicy"></a>

The DMARC policy to apply to messages that fail DMARC compliance.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.DmarcPolicy.NONE">NONE</a></code> | Do not apply any special handling to messages that fail DMARC compliance. |
| <code><a href="#cloudstructs.DmarcPolicy.QUARANTINE">QUARANTINE</a></code> | Quarantine messages that fail DMARC compliance. |
| <code><a href="#cloudstructs.DmarcPolicy.REJECT">REJECT</a></code> | Reject messages that fail DMARC compliance. |

---

##### `NONE` <a name="NONE" id="cloudstructs.DmarcPolicy.NONE"></a>

Do not apply any special handling to messages that fail DMARC compliance.

---


##### `QUARANTINE` <a name="QUARANTINE" id="cloudstructs.DmarcPolicy.QUARANTINE"></a>

Quarantine messages that fail DMARC compliance.

(usually by sending them to spam)

---


##### `REJECT` <a name="REJECT" id="cloudstructs.DmarcPolicy.REJECT"></a>

Reject messages that fail DMARC compliance.

(usually by rejecting them outright)

---


### SlackAppManifestShortcutType <a name="SlackAppManifestShortcutType" id="cloudstructs.SlackAppManifestShortcutType"></a>

Type of shortcuts.

> [https://api.slack.com/interactivity/shortcuts](https://api.slack.com/interactivity/shortcuts)

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SlackAppManifestShortcutType.MESSAGE">MESSAGE</a></code> | Message shortcuts are shown to users in the context menus of messages within Slack. |
| <code><a href="#cloudstructs.SlackAppManifestShortcutType.GLOBAL">GLOBAL</a></code> | Global shortcuts are available to users via the shortcuts button in the composer, and when using search in Slack. |

---

##### `MESSAGE` <a name="MESSAGE" id="cloudstructs.SlackAppManifestShortcutType.MESSAGE"></a>

Message shortcuts are shown to users in the context menus of messages within Slack.

> [https://api.slack.com/interactivity/shortcuts/using#message_shortcuts](https://api.slack.com/interactivity/shortcuts/using#message_shortcuts)

---


##### `GLOBAL` <a name="GLOBAL" id="cloudstructs.SlackAppManifestShortcutType.GLOBAL"></a>

Global shortcuts are available to users via the shortcuts button in the composer, and when using search in Slack.

> [https://api.slack.com/interactivity/shortcuts/using#global_shortcuts](https://api.slack.com/interactivity/shortcuts/using#global_shortcuts)

---


### SslServerTestGrade <a name="SslServerTestGrade" id="cloudstructs.SslServerTestGrade"></a>

SSL Server test grade.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cloudstructs.SslServerTestGrade.A_PLUS">A_PLUS</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.A">A</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.A_MINUS">A_MINUS</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.B">B</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.C">C</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.D">D</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.E">E</a></code> | *No description.* |
| <code><a href="#cloudstructs.SslServerTestGrade.F">F</a></code> | *No description.* |

---

##### `A_PLUS` <a name="A_PLUS" id="cloudstructs.SslServerTestGrade.A_PLUS"></a>

---


##### `A` <a name="A" id="cloudstructs.SslServerTestGrade.A"></a>

---


##### `A_MINUS` <a name="A_MINUS" id="cloudstructs.SslServerTestGrade.A_MINUS"></a>

---


##### `B` <a name="B" id="cloudstructs.SslServerTestGrade.B"></a>

---


##### `C` <a name="C" id="cloudstructs.SslServerTestGrade.C"></a>

---


##### `D` <a name="D" id="cloudstructs.SslServerTestGrade.D"></a>

---


##### `E` <a name="E" id="cloudstructs.SslServerTestGrade.E"></a>

---


##### `F` <a name="F" id="cloudstructs.SslServerTestGrade.F"></a>

---

