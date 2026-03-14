import { Body, Controller, Get, Post } from '@nestjs/common';
import { ModeleService } from './modele.service';

@Controller('modeles')
export class ModeleController {
  constructor(private readonly modeleService: ModeleService) {}

  @Get()
  findAll() {
    return this.modeleService.findAll();
  }

  @Post()
  create(@Body() body: { code?: string; libelle?: string; idFamille?: number }) {
    return this.modeleService.create(body);
  }
}