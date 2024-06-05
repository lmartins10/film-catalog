import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

import { Either, left, right } from '@/core/either'

interface EmailHandler {
  name: string
  email: string
  subject: string
  template: string
  context: unknown
}

type EmailServiceResponse = Either<
  {
    message: string
    error: unknown
  },
  {
    message: string
  }
>

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async handler({
    name,
    email,
    subject,
    template,
    context,
  }: EmailHandler): Promise<EmailServiceResponse> {
    try {
      await this.mailService.sendMail({
        to: `"${name}" <${email}>`,
        subject,
        template,
        context,
      })

      console.log('Email sent successfully')
      return right({ message: 'Email sent successfully' })
    } catch (error) {
      console.error('Error sending email', error)
      return left({ message: 'Error sending email', error })
    }
  }
}
