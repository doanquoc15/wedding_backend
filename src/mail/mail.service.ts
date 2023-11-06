import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: {
    to: string;
    from: string;
    subject: string;
    template: string;
    context: Record<string, any>;
  }): Promise<void> {
    try {
      const { to, subject, template, context, from } = options;

      await this.mailerService.sendMail({
        to,
        from,
        subject,
        template: template,
        context,
      });
    } catch (error) {
      throw error;
    }
  }
}
