import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { Admin } from '@/domain/enterprise/entities/admin'

import { AdminsRepository } from '../../repositories/admins-repository'

interface FetchRecentAdminsUseCaseRequest {
  pagination: {
    page: number
    perPage: number
  }
  sort?: {
    sortField: string
    sortDirection: 'asc' | 'desc'
  }
  searchParams?: {
    searchField: string
    searchValue: string
  }[]
}

type FetchRecentAdminsUseCaseResponse = Either<
  null,
  {
    admins: Admin[]
    count: number
  }
>

@Injectable()
export class FetchRecentAdminsUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    pagination,
    sort,
    searchParams,
  }: FetchRecentAdminsUseCaseRequest): Promise<FetchRecentAdminsUseCaseResponse> {
    const { admins, count } = await this.adminsRepository.findManyRecent({
      pagination,
      sort,
      searchParams,
    })

    return right({
      admins,
      count,
    })
  }
}
