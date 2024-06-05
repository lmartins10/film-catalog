import { Admin } from '@/domain/enterprise/entities/admin'

export class AdminPresenter {
  static toHTTP(admin: Admin) {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      inactivatedAt: admin.inactivatedAt,
      password: admin.password,
      passwordResetToken: admin.passwordResetToken,
    }
  }
}
