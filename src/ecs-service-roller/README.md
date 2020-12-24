# EcsServiceRoller

Roll your ECS service tasks on schedule or with a rule

## Usage

Define a `EcsServiceRoller`:

```ts
import * as cdk from '@aws-cdk/core';
import * as cloudstructs from 'cloudstructs';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // code that defines or imports a cluster and a service

    // Roll tasks of myFirstService everyday at midnight
    new cloudstructs.EcsServiceRoller(this, 'MyFirstRoller', {
      cluster: myCluster,
      service: myFirstService,
    });

    // Roll tasks of mySecondService every 5 hours
    new cloudstructs.EcsServiceRoller(this, 'MySecondRoller', {
      cluster: myCluster,
      service: mySecondService,
      trigger: cloudstructs.RollTrigger.fromSchedule(events.Schedule.rate(cdk.Duration.hours(5))),
    });

    // Roll tasks of myThirdService with a rule
    new cloudstructs.EcsServiceRoller(this, 'MyThirdRoller', {
      cluster: myCluster,
      service: myThirdService,
      trigger: cloudstructs.RollTrigger.fromRule(rule),
    });
  }
}
```
