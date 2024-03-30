import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail'

@Injectable()
export class SendGridClient {
  private logger: Logger;
  constructor(private configService: ConfigService) {
    //Initialize the logger. This is done for simplicity. You can use a logger service instead
    this.logger = new Logger(SendGridClient.name);
    //Get the API key from config service or environment variable
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async send(mail: any): Promise<void> {
    try {
      await SendGrid.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
    } catch (error) {
      //You can do more with the error
      this.logger.error('Error while sending email', error);
      throw error;
    }
  }
}
