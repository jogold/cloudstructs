# cloudstructs

High-level constructs for AWS CDK

## Installation

`npm install cloudstructs` or `yarn add cloudstructs`

## Constructs

* [`SlackEvents`](src/slack-events) Send Slack events to Amazon EventBridge

* [`SlackTextract`](src/slack-textract) Extract text from images posted to Slack
  using Amazon Textract. The extracted text is posted in a thread under the image
  and gets indexed!

* [`StaticWebsite`](src/static-website) A CloudFront static website hosted on S3 with
  HTTPS redirect and backend configuration saved to the bucket.

* [`StateMachineCustomResourceProvider`](src/state-machine-cr-provider) Implement custom
  resources with AWS Step Functions state machines
