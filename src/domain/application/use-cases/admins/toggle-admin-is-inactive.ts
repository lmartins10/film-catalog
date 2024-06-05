import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Admin } from '@/domain/enterprise/entities/admin'

import { AdminsRepository } from '../../repositories/admins-repository'
import { AdminAlreadyExistsError } from '../_errors/admin-already-exists-error'

interface ToggleAdminIsInactiveUseCaseRequest {
  id: string
}

type ToggleAdminIsInactiveUseCaseResponse = Either<
  ResourceNotFoundError | AdminAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class ToggleAdminIsInactiveUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    id,
  }: ToggleAdminIsInactiveUseCaseRequest): Promise<ToggleAdminIsInactiveUseCaseResponse> {
    const admin = await this.adminsRepository.findById(id)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    admin.inactivatedAt = admin.inactivatedAt ? null : new Date()

    await this.adminsRepository.save(admin)

    return right({
      admin,
    })
  }
}
