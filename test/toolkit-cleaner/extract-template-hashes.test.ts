const ServiceMock = {
  getTemplate: jest.fn().mockImplementation(() => ({
    promise: jest.fn().mockResolvedValue({
      TemplateBody: 'hello 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824 world 486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
    }),
  })),
};

jest.mock('aws-sdk', () => {
  return {
    CloudFormation: jest.fn(() => ServiceMock),
  };
});

import { handler } from '../../src/toolkit-cleaner/extract-template-hashes.lambda';

test('extracts hashes', async () => {

  const response = await handler('stack1');

  expect(ServiceMock.getTemplate).toHaveBeenCalledWith({ StackName: 'stack1' });

  expect(response).toEqual([
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    '486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7',
  ]);
});
