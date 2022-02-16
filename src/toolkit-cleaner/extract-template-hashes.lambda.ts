import { CloudFormation } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

const cloudFormation = new CloudFormation();

export async function handler(stackName: string) {
  const template = await cloudFormation.getTemplate({
    StackName: stackName,
  }).promise();

  if (!template.TemplateBody) {
    return [];
  }

  const hashes = template.TemplateBody.match(/[a-f0-9]{64}/g);

  return [...new Set(hashes)];
}
