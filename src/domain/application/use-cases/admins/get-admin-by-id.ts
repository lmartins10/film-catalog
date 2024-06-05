import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Admin } from '@/domain/enterprise/entities/admin'

import { AdminsRepository } from '../../repositories/admins-repository'

interface GetAdminByIdUseCaseRequest {
  id: string
}

type GetAdminByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    admin: Admin
  }
>

@Injectable()
export class GetAdminByIdUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    id,
  }: GetAdminByIdUseCaseRequest): Promise<GetAdminByIdUseCaseResponse> {
    const admin = await this.adminsRepository.findById(id)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    return right({
      admin,
    })
  }
}
