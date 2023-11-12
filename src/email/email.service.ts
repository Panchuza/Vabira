// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import {MailerService} from '@nestjs-modules/mailer'

@Injectable()
export class EmailService {
  private transporter;
  // constructor( private readonly mailerService: MailerService){}
  
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'vabira.soluciones@gmail.com',
        pass: 'nkmjvugkkkxcpkhs',
      },
    });
  }


  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'vabira.soluciones@gmail.com',
      to: to,
      subject: subject,
      text: text,
    };

    return this.transporter.sendMail(mailOptions);
  }
}