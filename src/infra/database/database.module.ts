import { Module } from '@nestjs/common'

import { AdminsRepository } from '@/domain/application/repositories/admins-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
  ],
  exports: [PrismaService, AdminsRepository],
})
export class DatabaseModule {}
