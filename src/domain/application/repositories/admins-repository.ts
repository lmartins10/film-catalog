import { QueryParams } from '@/core/repositories/query-params'

import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract findById(id: string): Promise<Admin | null>
  abstract findByEmail(email: string): Promise<Admin | null>
  abstract findManyRecent(
    params: QueryParams,
  ): Promise<{ admins: Admin[]; count: number }>

  abstract create(admin: Admin): Promise<void>
  abstract save(admin: Admin): Promise<void>
  abstract delete(admin: Admin): Promise<void>
}
