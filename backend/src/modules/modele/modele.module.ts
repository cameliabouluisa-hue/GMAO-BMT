import { Module } from '@nestjs/common';
import { ModeleController } from './modele.controller';
import { ModeleService } from './modele.service';

@Module({
  controllers: [ModeleController],
  providers: [ModeleService],
})
export class ModeleModule {}