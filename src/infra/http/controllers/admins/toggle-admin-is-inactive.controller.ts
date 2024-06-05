import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { ToggleAdminIsInactiveUseCase } from '@/domain/admin-panel/application/use-cases/admins/toggle-admin-is-inactive'

@Controller('/admins/:id/inactive')
export class ToggleAdminIsInactiveController {
  constructor(private toggleAdminIsInactive: ToggleAdminIsInactiveUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.toggleAdminIsInactive.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
