import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FamilleModule } from './modules/famille/famille.module';
import { ModeleModule } from './modules/modele/modele.module';
import { EtatModeleModule } from './modules/etat-modele/etat-modele.module';
import { PointStructureModule } from './modules/point-structure/point-structure.module';

@Module({
  imports: [PrismaModule, FamilleModule, ModeleModule,EtatModeleModule, PointStructureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}