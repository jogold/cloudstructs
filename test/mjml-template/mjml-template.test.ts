import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MjmlTemplate } from '../../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('MjmlTemplate', () => {
  const mjml = `
  <mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>Hello {{name}}</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

  new MjmlTemplate(stack, 'Template', {
    subject: 'Welcome!',
    mjml,
  });

  expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
});
