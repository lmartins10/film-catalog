import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { SortParams } from '@/core/repositories/sort-params'
import { FetchRecentAdminsUseCase } from '@/domain/application/use-cases/admins/fetch-recent-admins'

import { AdminPresenter } from '../../presenters/admin-presenter'
import {
  AllQueryParamSchema,
  allQueryValidationPipe,
  PageQueryParamSchema,
  pageQueryValidationPipe,
  PerPageQueryParamSchema,
  perPageQueryValidationPipe,
  SortQueryParamSchema,
  sortQueryValidationPipe,
} from './fetch-recent-admins-controller-schema'

@Controller('/admins')
export class FetchRecentAdminsController {
  constructor(private fetchRecentAdmins: FetchRecentAdminsUseCase) {}

  @Get()
  async handle(
    @Query('page', pageQueryValidationPipe) page: PageQueryParamSchema,
    @Query('per_page', perPageQueryValidationPipe)
    perPage: PerPageQueryParamSchema,
    @Query('sort', sortQueryValidationPipe) sort: SortQueryParamSchema,
    @Query('all', allQueryValidationPipe) all: AllQueryParamSchema,
  ) {
    const searchParams = []
    all && searchParams.push({ searchField: 'all', searchValue: all })

    const sortArray = sort?.split('.') || []
    const [sortField, sortDirection] = sortArray

    const sortParams: SortParams = sort
      ? {
          sortField,
          sortDirection: sortDirection === 'asc' ? 'asc' : 'desc',
        }
      : undefined

    const result = await this.fetchRecentAdmins.execute({
      pagination: {
        page,
        perPage,
      },
      searchParams,
      sort: sortParams,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { admins, count } = result.value

    return {
      admins: admins.map(AdminPresenter.toHTTP),
      count,
    }
  }
}
