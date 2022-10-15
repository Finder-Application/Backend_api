/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from 'shared/services/api-config.service';
import { NodeMailgun } from 'ts-mailgun';
import { templateOtp } from './constants';

@Injectable()
export class MailService {
  mailer: NodeMailgun;
  constructor(private configService: ApiConfigService) {
    this.mailer = new NodeMailgun();
    this.mailer.apiKey = this.configService.mailConfig.apiKey; // Set your API key
    this.mailer.domain = this.configService.mailConfig.domain; // Set the domain you registered earlier
    this.mailer.fromEmail = 'noreply@finder1.com'; // Set your from email
    this.mailer.fromTitle = 'Finder App'; // Set the name you would like to send from
    this.mailer.init();
  }
  async sendCodeOtp(mail: string, otpCode: string) {
    try {
      const to = mail;
      const subject = 'Otp code';
      const html = templateOtp(otpCode);
      await this.mailer.send(to, subject, html);
    } catch (error) {
      return error;
    }
  }
}
