import { Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { CodeCommitMirror, CodeCommitMirrorSourceRepository } from '../../src';

let stack: Stack;
let cluster: ecs.ICluster;
beforeEach(() => {
  stack = new Stack();
  cluster = new ecs.Cluster(stack, 'Cluster');
});

test('CodeCommitMirror with a public GitHub repo', () => {
  new CodeCommitMirror(stack, 'Mirror', {
    repository: CodeCommitMirrorSourceRepository.gitHub('jogold', 'cloudstructs'),
    cluster,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('CodeCommitMirror with a private GitHub repo', () => {
  const urlSecret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'clone-url');

  new CodeCommitMirror(stack, 'Mirror', {
    cluster,
    repository: CodeCommitMirrorSourceRepository.private('private', ecs.Secret.fromSecretsManager(urlSecret)),
    schedule: events.Schedule.rate(Duration.hours(6)),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
