import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

import { DeleteAdminUseCase } from '@/domain/application/use-cases/admins/delete-admin'

@Controller('/admins/:id')
export class DeleteAdminController {
  constructor(private deleteAdmin: DeleteAdminUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.deleteAdmin.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
