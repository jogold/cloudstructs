import { CfnTemplate } from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';
import mjml2html = require('mjml'); // eslint-disable-line @typescript-eslint/no-require-imports

/**
 * Properties for a MjmlTempalte
 */
export interface MjmlTemplateProps {
  /**
   * The name of the template
   *
   * @default - a CloudFormation generated name
   */
  readonly templateName?: string;

  /**
   * The subject line of the email
   */
  readonly subject: string;

  /**
   * The MJML of the email
   */
  readonly mjml: string;
}

/**
 * SES email template from [MJML](https://mjml.io/)
 */
export class MjmlTemplate extends Construct {
  /**
   * The name of the template
   */
  public readonly templateName: string;

  constructor(scope: Construct, id: string, props: MjmlTemplateProps) {
    super(scope, id);

    const template = new CfnTemplate(this, 'Resource', {
      template: {
        templateName: props.templateName,
        subjectPart: props.subject,
        htmlPart: mjml2html(props.mjml).html,
      },
    });

    this.templateName = template.attrId;
  }
}