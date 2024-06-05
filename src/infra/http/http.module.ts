import { Module } from '@nestjs/common'

import { AuthenticateAdminUseCase } from '@/domain/application/use-cases/admins/authenticate-admin'
import { CreateResetTokenAdminUseCase } from '@/domain/application/use-cases/admins/create-reset-token'
import { DeleteAdminUseCase } from '@/domain/application/use-cases/admins/delete-admin'
import { EditAdminUseCase } from '@/domain/application/use-cases/admins/edit-admin'
import { FetchRecentAdminsUseCase } from '@/domain/application/use-cases/admins/fetch-recent-admins'
import { GetAdminByIdUseCase } from '@/domain/application/use-cases/admins/get-admin-by-id'
import { RegisterAdminUseCase } from '@/domain/application/use-cases/admins/register-admin'
import { ResetPasswordUseCase } from '@/domain/application/use-cases/admins/reset-password'
import { ToggleAdminIsInactiveUseCase } from '@/domain/application/use-cases/admins/toggle-admin-is-inactive'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { AuthenticateController } from './controllers/admins/authenticate.controller'
import { CheckSessionController } from './controllers/admins/check-session.controller'
import { CreateAccountController } from './controllers/admins/create-account.controller'
import { DeleteAdminController } from './controllers/admins/delete-admin.controller'
import { EditAdminController } from './controllers/admins/edit-admin.controller'
import { FetchRecentAdminsController } from './controllers/admins/fetch-recent-admins.controller'
import { ForgotPasswordController } from './controllers/admins/forgot-password.controller'
import { GetAdminByIdController } from './controllers/admins/get-admin-by-id.controller'
import { ResetPasswordController } from './controllers/admins/reset-password.controller'
import { ToggleAdminIsInactiveController } from './controllers/admins/toggle-admin-is-inactive.controller'
import { HelloWorldController } from './controllers/hello-world.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, EnvModule],
  controllers: [
    HelloWorldController,
    CheckSessionController,
    AuthenticateController,
    CreateAccountController,
    EditAdminController,
    DeleteAdminController,
    FetchRecentAdminsController,
    ToggleAdminIsInactiveController,
    ForgotPasswordController,
    ResetPasswordController,
    GetAdminByIdController,
  ],
  providers: [
    AuthenticateAdminUseCase,
    RegisterAdminUseCase,
    EditAdminUseCase,
    DeleteAdminUseCase,
    FetchRecentAdminsUseCase,
    ToggleAdminIsInactiveUseCase,
    CreateResetTokenAdminUseCase,
    ResetPasswordUseCase,
    GetAdminByIdUseCase,
  ],
})
export class HttpModule {}
