import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Admin } from '@/domain/enterprise/entities/admin'

import { Encrypter } from '../../cryptography/encrypter'
import { AdminsRepository } from '../../repositories/admins-repository'

interface CreateResetTokenAdminUseCaseRequest {
  email: string
}

type CreateResetTokenAdminUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    admin: Admin
  }
>

@Injectable()
export class CreateResetTokenAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
  }: CreateResetTokenAdminUseCaseRequest): Promise<CreateResetTokenAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const fiveMinutes = 5 * 60 * 1000 // 5 minutes
    const passwordResetTokenExpiresAt = new Date(Date.now() + fiveMinutes)
    const passwordResetToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      iat: Date.now(),
      exp: passwordResetTokenExpiresAt.getTime(),
    })

    admin.passwordResetToken = passwordResetToken

    await this.adminsRepository.save(admin)

    return right({
      admin,
    })
  }
}
