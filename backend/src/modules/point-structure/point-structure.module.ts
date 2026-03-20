import { Module } from '@nestjs/common';
import { PointStructureController } from './point-structure.controller';
import { PointStructureService } from './point-structure.service';

@Module({
  controllers: [PointStructureController],
  providers: [PointStructureService]
})
export class PointStructureModule {}
