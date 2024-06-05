import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateResetTokenAdminUseCase } from '@/domain/application/use-cases/admins/create-reset-token'
import { Public } from '@/infra/auth/public'
import { SendMailProducerService } from '@/infra/email/jobs/send-email-queue/send-email-queue-producer.service'
import { EnvService } from '@/infra/env/env.service'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>

@Controller('/forgot-password')
@Public()
export class ForgotPasswordController {
  constructor(
    private readonly createResetTokenAdmin: CreateResetTokenAdminUseCase,
    private readonly sendMailProducerService: SendMailProducerService,
    private readonly envService: EnvService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(forgotPasswordBodySchema))
  async handle(@Body() body: ForgotPasswordBodySchema) {
    const { email } = body

    const result = await this.createResetTokenAdmin.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value
      console.log(error)
      throw new BadRequestException(error.message)
    }

    const {
      admin: { name, passwordResetToken },
    } = result.value

    const emailUserTest = this.envService.get('EMAIL_USER_TEST')
    const frontendUrl = this.envService.get('FRONTEND_URL')
    const testSendEmail = this.envService.get('TEST_SEND_EMAIL')
    const sendEmail = this.envService.get('SEND_EMAIL')
    const isTestEnv = process.env.NODE_ENV === 'test'

    if (isTestEnv) {
      if (testSendEmail) {
        await this.sendMailProducerService.execute({
          name,
          email: emailUserTest,
          subject: 'Solicitação de alteração de senha',
          template: 'reset-password',
          context: {
            token: passwordResetToken,
            name,
            frontendUrl,
            logoUrl: this.envService.get('EMAIL_LOGO_URL'),
          },
        })
      }

      return {
        message: 'Password reset link has been sent to your email',
        reset_token: passwordResetToken,
      }
    }

    if (sendEmail) {
      await this.sendMailProducerService.execute({
        name,
        email,
        subject: 'Solicitação de alteração de senha',
        template: 'reset-password',
        context: {
          token: passwordResetToken,
          name,
          frontendUrl,
          logoUrl: this.envService.get('EMAIL_LOGO_URL'),
        },
      })
    } else {
      console.log(
        'Reset link: ',
        `${frontendUrl}/reset-password/${passwordResetToken}`,
      )
    }

    return {
      message: 'Password reset link has been sent to your email',
    }
  }
}
