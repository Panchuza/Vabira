import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
// import {MailerModule} from '@nestjs-modules/mailer'

@Module({
  // imports: [MailerModule.forRoot({
  //   transport: {
  //     host: 'smtp.google.com',
  //     auth: {
  //       user: 'sheldonisthebest25@gmail.com',
  //       pass: 'EquiNet25',
  //     }
  //   }
  // })], 
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}