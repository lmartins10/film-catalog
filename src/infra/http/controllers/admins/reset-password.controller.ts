import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'

import { ResetPasswordUseCase } from '@/domain/admin-panel/application/use-cases/admins/reset-password'
import { Public } from '@/infra/auth/public'
import { EnvService } from '@/infra/env/env.service'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const resetPasswordBodySchema = z.object({
  newPassword: z.string(),
  resetToken: z.string(),
})

type ResetPasswordBodySchema = z.infer<typeof resetPasswordBodySchema>

const bodyValidationPipe = new ZodValidationPipe(resetPasswordBodySchema)

const resetTokenPayloadSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
})

type ResetTokenPayload = z.infer<typeof resetTokenPayloadSchema>

@Controller('/reset-password')
@Public()
export class ResetPasswordController {
  constructor(
    private resetPassword: ResetPasswordUseCase,
    private jwt: JwtService,
    private env: EnvService,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: ResetPasswordBodySchema) {
    const { newPassword, resetToken } = body

    const jwtPublicKey = Buffer.from(this.env.get('JWT_PUBLIC_KEY'), 'base64')

    try {
      const resetTokenPayload = this.jwt.verify<ResetTokenPayload>(resetToken, {
        publicKey: jwtPublicKey,
        algorithms: ['RS256'],
      })

      const { sub: id, exp } = resetTokenPayloadSchema.parse(resetTokenPayload)

      const result = await this.resetPassword.execute({
        id,
        exp,
        newPassword,
        resetToken,
      })

      if (result.isLeft()) {
        const error = result.value
        throw new BadRequestException(error.message)
      }
    } catch (error) {
      console.error('catch error: ', error)
      if (error instanceof BadRequestException || error instanceof Error) {
        throw new BadRequestException(error.message)
      }

      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}
