import { Controller, Get, HttpCode } from '@nestjs/common'

@Controller('/sessions/check')
export class CheckSessionController {
  @Get()
  @HttpCode(200)
  async handle() {
    return {
      ok: true,
    }
  }
}
