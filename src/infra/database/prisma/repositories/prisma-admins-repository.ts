import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { QueryParams } from '@/core/repositories/query-params'
import { AdminsRepository } from '@/domain/application/repositories/admins-repository'
import { Admin } from '@/domain/enterprise/entities/admin'

import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Admin> | null {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findByEmail(email: string): Promise<Admin> | null {
    const admin = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findManyRecent({
    pagination: { page, perPage = 10 },
    sort,
    searchParams,
  }: QueryParams): Promise<{ admins: Admin[]; count: number }> {
    const sortField = sort?.sortField
    const sortDirection = sort?.sortDirection
    const orderBy: Prisma.UserOrderByWithAggregationInput = {}
    let where: Prisma.UserWhereInput = {}
    const searchableFields: Prisma.UserScalarFieldEnum[] = ['name', 'email']

    if (sort) {
      orderBy[sortField] =
        sortDirection.toLowerCase() === 'asc' ? 'asc' : 'desc'
    } else {
      orderBy.createdAt = 'desc'
    }

    if (searchParams && searchParams.length > 0) {
      const searchParamsOr = []
      const searchParamsWhere = []

      searchParams.forEach((searchParam) => {
        const { searchField, searchValue } = searchParam
        if (searchField === 'all') {
          const allSearches = searchableFields.map((field) => {
            return {
              [field]: {
                contains: searchValue,
                mode: 'insensitive',
              },
            }
          })
          searchParamsOr.push(...allSearches)
        } else {
          searchParamsWhere.push({
            [searchField]: {
              in: searchValue && searchValue.split('.'),
            },
          })
        }
      })

      searchParamsWhere.length > 0 &&
        (where = searchParamsWhere.reduce((a, b) => ({ ...a, ...b })))

      searchParamsOr.length > 0 && (where.OR = searchParamsOr)
    } else {
      where = undefined
    }

    const admins = await this.prisma.user.findMany({
      orderBy,
      where: {
        ...where,
        role: 'ADMIN',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    const count = await this.prisma.user.count({
      where: {
        ...where,
        role: 'ADMIN',
      },
    })

    return { admins: admins.map(PrismaAdminMapper.toDomain), count }
  }

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({ data })
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(admin: Admin): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: admin.id.toString(),
      },
    })
  }
}
