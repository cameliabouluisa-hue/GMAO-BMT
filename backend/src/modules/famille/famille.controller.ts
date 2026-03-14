import { Body, Controller, Get, Post } from '@nestjs/common';
import { FamilleService } from './famille.service';

@Controller('familles')
export class FamilleController {
  constructor(private readonly familleService: FamilleService) {}

  @Get()
  findAll() {
    return this.familleService.findAll();
  }

  @Post()
  create(@Body() body: { code?: string; libelle?: string }) {
    return this.familleService.create(body);
  }
}