import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail(options: { email: string; subject: string; html: string }) {
    try {
      const message = {
        to: options.email,
        subject: options.subject,
        html: options.html,
      };
      const emailSend = await this.mailerService.sendMail({
        ...message,
      });
      return emailSend;
    } catch (error) {
      Logger.error('ERROR SEND MAIL');
      console.error(error);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
