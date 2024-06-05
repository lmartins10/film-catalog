import { Controller, Get, HttpCode } from '@nestjs/common'

import { Public } from '@/infra/auth/public'

@Controller('/hello')
@Public()
export class HelloWorldController {
  @Get()
  @HttpCode(200)
  async handle() {
    return { message: 'Hello World!' }
  }
}
