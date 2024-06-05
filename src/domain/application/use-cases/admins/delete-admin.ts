import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Admin } from '@/domain/enterprise/entities/admin'

import { AdminsRepository } from '../../repositories/admins-repository'
import { AdminAlreadyExistsError } from '../_errors/admin-already-exists-error'

interface DeleteAdminUseCaseRequest {
  id: string
}

type DeleteAdminUseCaseResponse = Either<
  ResourceNotFoundError | AdminAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class DeleteAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    id,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(id)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    await this.adminsRepository.delete(admin)

    return right(null)
  }
}
