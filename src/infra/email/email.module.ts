import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { EmailService } from './email.service'
import { SendEmailConsumerService } from './jobs/send-email-queue/send-email-queue-consumer.service'
import { SendMailProducerService } from './jobs/send-email-queue/send-email-queue-producer.service'

@Module({
  imports: [
    EnvModule,
    BullModule.registerQueue({
      name: 'send-email-queue',
    }),
    MailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        transport: `smtps://${env.get('EMAIL_USER')}:${env.get(
          'EMAIL_PASSWORD',
        )}@${env.get('EMAIL_HOST')}:${env.get('EMAIL_PORT')}`,
        defaults: {
          from: env.get('EMAIL_USER'),
        },
        preview: env.get('PREVIEW_EMAIL'),
        template: {
          dir: 'src\\infra\\email\\templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService, SendEmailConsumerService, SendMailProducerService],
  exports: [EmailService, SendMailProducerService],
})
export class EmailModule {}
