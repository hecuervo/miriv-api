import { Injectable } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly sendGridClient: SendGridClient,
    private configService: ConfigService,
  ) {}

  async sendTestEmail(
    recipient: string,
    body = 'This is a test mail',
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: 'noreply@domain.com', //Approved sender ID in Sendgrid
      subject: 'Test email',
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailResetPasswordRequest(
    recipient: string,
    name: string,
    url: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.configService.get('EMAIL_FROM'),
      templateId: this.configService.get('EMAIL_TEMPLATE_REQUEST_PASSWORD_ID'),
      dynamicTemplateData: { name: name, url: url },
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailWelcomeAgent(
    recipient: string,
    name: string,
    url: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.configService.get('EMAIL_FROM'),
      subject: `¡Bienvenido a Mi Portal Miriv, ${name}!`,
      templateId: this.configService.get('EMAIL_TEMPLATE_WELCOME_AGENT_ID'),
      dynamicTemplateData: { name: name, url: url },
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailCustomer(
    recipient: string,
    name: string,
    url: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.configService.get('EMAIL_FROM'),
      subject: `¡Bienvenido a Mi Portal Miriv, ${name}!`,
      templateId: this.configService.get('EMAIL_TEMPLATE_WELCOME_CUSTOMERS_ID'),
      dynamicTemplateData: { name: name, url: url },
    };
    await this.sendGridClient.send(mail);
  }
}
