import { handler } from '../../src/ssl-server-test/extract-grade.lambda';

test('extracts grade', async () => {
  const grade = await handler({
    endpoints: [
      { grade: 'E' },
      { grade: 'A+' },
      { grade: 'C' },
    ],
  });

  expect(grade).toBe('E');
});