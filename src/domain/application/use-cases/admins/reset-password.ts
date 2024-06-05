import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Admin } from '@/domain/enterprise/entities/admin'

import { HashGenerator } from '../../cryptography/hash-generator'
import { AdminsRepository } from '../../repositories/admins-repository'
import { InvalidTokenError } from '../_errors/invalid-token'
import { WrongCredentialError } from '../_errors/wrong-credential-error'

interface ResetPasswordUseCaseRequest {
  id: string
  exp: number
  newPassword: string
  resetToken: string
}

type ResetPasswordUseCaseResponse = Either<
  WrongCredentialError | InvalidTokenError | NotAllowedError,
  { admin: Admin }
>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    exp,
    newPassword,
    resetToken,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(id)

    if (!admin) {
      return left(new WrongCredentialError())
    }

    if (!admin.passwordResetToken) {
      return left(new NotAllowedError())
    }

    if (admin.passwordResetToken !== resetToken) {
      return left(new InvalidTokenError())
    }

    if (exp < Date.now()) {
      return left(new InvalidTokenError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    admin.password = hashedPassword
    admin.passwordResetToken = null

    await this.adminsRepository.save(admin)

    return right({
      admin,
    })
  }
}
