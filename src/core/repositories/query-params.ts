import { PaginationParams } from './pagination-params'
import { SearchParam } from './search-params'
import { SortParams } from './sort-params'

export interface QueryParams {
  pagination: PaginationParams
  sort?: SortParams
  searchParams?: SearchParam[]
}
