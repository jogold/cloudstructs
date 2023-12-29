import 'aws-sdk-client-mock-jest';
import { CloudFormationClient, GetTemplateCommand } from '@aws-sdk/client-cloudformation';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/toolkit-cleaner/extract-template-hashes.lambda';

const cloudFormationClientMock = mockClient(CloudFormationClient);

test('extracts hashes', async () => {
  process.env.DOCKER_IMAGE_ASSET_HASH = '5a7abf30ce10141adcb73c9b836ec68479c65fb4d1693df160563e36ece0d55e';

  cloudFormationClientMock.on(GetTemplateCommand).resolves({
    TemplateBody: 'hello 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824 world 486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
  });

  const response = await handler('stack1');

  expect(cloudFormationClientMock).toHaveReceivedCommandWith(GetTemplateCommand, { StackName: 'stack1' });

  expect(response).toEqual([
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    '486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
  ]);
});

test('extracts hashes with docker tag prefix', async () => {
  process.env.DOCKER_IMAGE_ASSET_HASH = 'prefix5a7abf30ce10141adcb73c9b836ec68479c65fb4d1693df160563e36ece0d55e';

  cloudFormationClientMock.on(GetTemplateCommand).resolves({
    TemplateBody: 'hello prefix2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824 world 486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
  });

  const response = await handler('stack1');

  expect(cloudFormationClientMock).toHaveReceivedCommandWith(GetTemplateCommand, { StackName: 'stack1' });

  expect(response).toEqual([
    'prefix2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    '486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
  ]);
});
