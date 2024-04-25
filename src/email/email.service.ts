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

  async sendEmailPolicyReminderToCompleteOwner(
    recipient: string,
    name: string,
    url: string,
    policyNumber: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.configService.get('EMAIL_FROM'),
      subject: `¡Tu póliza ha sido creada ${policyNumber}!`,
      templateId: this.configService.get('EMAIL_TEMPLATE_REMINDER_OWNER'),
      dynamicTemplateData: { name: name, url: url, policyNumber: policyNumber },
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailPolicyReminderToCompleteTenant(
    recipient: string,
    name: string,
    url: string,
    policyNumber: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.configService.get('EMAIL_FROM'),
      subject: `¡Nueva póliza por validar ${policyNumber}!`,
      templateId: this.configService.get('EMAIL_TEMPLATE_REMINDER_TENANT'),
      dynamicTemplateData: { name: name, url: url, policyNumber: policyNumber },
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmailPolicyActivated(
    recipient: string,
    name: string,
    url: string,
    policyNumber: string,
    startDate: string,
    endDate: string,
  ): Promise<void> {
    const mail: MailDataRequired = {
      to: recipient,
      from: this.configService.get('EMAIL_FROM'),
      subject: `¡Tu póliza se encuentra vigente ${policyNumber}!`,
      templateId: this.configService.get('EMAIL_TEMPLATE_POLICY_ACTIVATED'),
      attachments: [],
      dynamicTemplateData: {
        name: name,
        url: url,
        policyNumber: policyNumber,
        startDate: startDate,
        endDate: endDate,
      },
    };
    await this.sendGridClient.send(mail);
  }
}
