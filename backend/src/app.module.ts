import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FamilleModule } from './modules/famille/famille.module';
import { ModeleModule } from './modules/modele/modele.module';

@Module({
  imports: [PrismaModule, FamilleModule, ModeleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}