import { Module } from '@nestjs/common';
import { PointStructureService } from './point-structure.service';
import { PointStructureController } from './point-structure.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PointStructureController],
  providers: [PointStructureService, PrismaService],
})
export class PointStructureModule {}