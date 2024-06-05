import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Admin } from '@/domain/enterprise/entities/admin'

import { HashGenerator } from '../../cryptography/hash-generator'
import { AdminsRepository } from '../../repositories/admins-repository'
import { AdminAlreadyExistsError } from '../_errors/admin-already-exists-error'

interface EditAdminUseCaseRequest {
  id: string
  name: string
  email: string
  password?: string
}

type EditAdminUseCaseResponse = Either<
  ResourceNotFoundError | AdminAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class EditAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    name,
    email,
    password,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(id)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const adminWithSameEmail = await this.adminsRepository.findByEmail(email)

    if (adminWithSameEmail && adminWithSameEmail.id.toString() !== id) {
      return left(new AdminAlreadyExistsError(email))
    }

    admin.name = name
    admin.email = email

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password)
      admin.password = hashedPassword
    }

    await this.adminsRepository.save(admin)

    return right({
      admin,
    })
  }
}
