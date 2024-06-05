import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ForbiddenError } from '@/domain/admin-panel/application/use-cases/_errors/forbidden-error'
import { WrongCredentialError } from '@/domain/admin-panel/application/use-cases/_errors/wrong-credential-error'
import { AuthenticateAdminUseCase } from '@/domain/admin-panel/application/use-cases/admins/authenticate-admin'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateAdmin.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message)
        case ForbiddenError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
