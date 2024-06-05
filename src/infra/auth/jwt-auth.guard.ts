import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { UserPayload } from './jwt.strategy'
import { IS_PUBLIC_KEY } from './public'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const result = (await super.canActivate(context)) as boolean

    const request = context.switchToHttp().getRequest()

    const { user: currentUser } = request.user as UserPayload

    if (currentUser.inactivatedAt) {
      return false
    }

    return result
  }
}
