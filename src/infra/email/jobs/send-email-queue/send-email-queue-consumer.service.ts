import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'

import { EmailService } from '../../email.service'

type SendEmailConsumerServiceType = {
  name: string
  email: string
  subject: string
  template: string
  context: unknown
}

@Processor('send-email-queue')
export class SendEmailConsumerService {
  constructor(private emailService: EmailService) {}

  @Process('send-email-job')
  async execute(job: Job<SendEmailConsumerServiceType>) {
    const { name, email, subject, template, context } = job.data

    await this.emailService.handler({
      name,
      email,
      subject,
      template,
      context,
    })
  }

  @OnQueueActive()
  async onActive(job: Job<SendEmailConsumerService>) {
    console.log(
      `[${new Date()}] Processing job "${job.id}" of type "${job.name}"...`,
    )
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<SendEmailConsumerService>, err: Error) {
    console.log(
      `[${new Date()}] Fail processing job "${job.id}" of type "${
        job.name
      }", error: ${err}`,
    )
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job<SendEmailConsumerService>) {
    console.log(`[${new Date()}] Job "${job.id}" completed.`)
  }
}
