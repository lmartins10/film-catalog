import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'

import { Encrypter } from '../../cryptography/encrypter'
import { HashComparer } from '../../cryptography/hash-comparer'
import { AdminsRepository } from '../../repositories/admins-repository'
import { ForbiddenError } from '../_errors/forbidden-error'
import { WrongCredentialError } from '../_errors/wrong-credential-error'

interface AuthenticateAdminUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return left(new WrongCredentialError())
    }

    if (admin.inactivatedAt) {
      return left(new ForbiddenError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      user: {
        id: admin.id.toString(),
        name: admin.name,
        email: admin.email,
        inactivatedAt: admin.inactivatedAt ?? undefined,
      },
      iat: Date.now(),
    })

    return right({
      accessToken,
    })
  }
}
