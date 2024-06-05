import { Prisma, User as PrismaUser } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique.entity-id'
import { Admin } from '@/domain/enterprise/entities/admin'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        inactivatedAt: raw.inactivatedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        passwordResetToken: raw.passwordResetToken,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      email: admin.email,
      name: admin.name,
      role: 'ADMIN',
      password: admin.password,
      inactivatedAt: admin.inactivatedAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      passwordResetToken: admin.passwordResetToken,
    }
  }
}
