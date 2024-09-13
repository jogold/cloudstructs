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

* [`MjmlTemplate`](src/mjml-template) SES email template from [MJML](https://mjml.io/)

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
