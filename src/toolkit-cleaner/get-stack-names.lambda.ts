import { CloudFormation } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const cloudFormation = new CloudFormation();

export async function handler() {
  const res: string[] = [];

  let nextToken: string | undefined;
  let finished = false;
  while (!finished) {
    const response = await cloudFormation.describeStacks({ NextToken: nextToken }).promise();
    res.push(...(response.Stacks ?? []).map(s => s.StackName));

    nextToken = response.NextToken;
    if (nextToken === undefined) {
      finished = true;
    }
  }

  return res;
}
