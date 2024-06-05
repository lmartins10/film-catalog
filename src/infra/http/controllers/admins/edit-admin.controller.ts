import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { EditAdminUseCase } from '@/domain/admin-panel/application/use-cases/admins/edit-admin'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const editAdminBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editAdminBodySchema)

type EditAdminBodySchema = z.infer<typeof editAdminBodySchema>

@Controller('/admins/:id')
export class EditAdminController {
  constructor(private editAdmin: EditAdminUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAdminBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const { name, email, password } = body

    const result = await this.editAdmin.execute({
      id,
      name,
      email,
      password: password || undefined,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
