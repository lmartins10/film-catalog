import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

type SendEmailQueueType = {
  name: string
  email: string
  subject: string
  template: string
  context: unknown
}

@Injectable()
export class SendMailProducerService {
  constructor(@InjectQueue('send-email-queue') private sendEmailQueue: Queue) {}

  async execute({
    name,
    email,
    subject,
    template,
    context,
  }: SendEmailQueueType) {
    await this.sendEmailQueue.add(
      'send-email-job',
      {
        name,
        email,
        subject,
        template,
        context,
      },
      { attempts: 3 },
    )
  }
}
