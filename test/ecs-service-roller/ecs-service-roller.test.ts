import { Template } from '@aws-cdk/assertions';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { EcsServiceRoller, RollTrigger } from '../../src';

let stack: cdk.Stack;
let cluster: ecs.ICluster;
let service: ecs.IService;
beforeEach(() => {
  stack = new cdk.Stack();
  cluster = new ecs.Cluster(stack, 'Cluster');
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('my-image'),
  });
  service = new ecs.FargateService(stack, 'Service', {
    cluster,
    taskDefinition,
  });
});

test('EcsServiceRoller with default', () => {
  new EcsServiceRoller(stack, 'EcsServiceRoller', {
    cluster,
    service,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('EcsServiceRoller with schedule', () => {
  new EcsServiceRoller(stack, 'EcsServiceRoller', {
    cluster,
    service,
    trigger: RollTrigger.fromSchedule(events.Schedule.rate(cdk.Duration.hours(5))),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});

test('EcsServiceRoller with rule', () => {
  const rule = new events.Rule(stack, 'Rule', {
    eventPattern: {
      detail: ['detail'],
    },
  });

  new EcsServiceRoller(stack, 'EcsServiceRoller', {
    cluster,
    service,
    trigger: RollTrigger.fromRule(rule),
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
