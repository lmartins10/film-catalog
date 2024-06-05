import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'

import { GetAdminByIdUseCase } from '@/domain/admin-panel/application/use-cases/admins/get-admin-by-id'

import { AdminPresenter } from '../../presenters/admin-presenter'

@Controller('/admins/:id')
export class GetAdminByIdController {
  constructor(private getAdminById: GetAdminByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.getAdminById.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const admin = result.value.admin

    return { admin: AdminPresenter.toHTTP(admin) }
  }
}
