import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MjmlTemplate } from '../../src';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

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

    const template = new MjmlTemplate(this, 'Template', {
      subject: 'Welcome!',
      mjml,
    });

    new CfnOutput(this, 'TemplateName', {
      value: template.templateName,
    });
  }
}

const app = new App();
new TestStack(app, 'mjml-template-integ');
app.synth();
