import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FamilleService } from './famille.service';

@Controller('familles')
export class FamilleController {
  constructor(private readonly familleService: FamilleService) {}

  @Get()
  findAll() {
    return this.familleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familleService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: { code?: string; libelle?: string; parent_id?: number | null },
  ) {
    return this.familleService.create({
      code: body.code,
      libelle: body.libelle,
      parent_id: body.parent_id ?? null,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: { code?: string; libelle?: string; parent_id?: number | null },
  ) {
    return this.familleService.update(id, {
      code: body.code,
      libelle: body.libelle,
      parent_id: body.parent_id ?? null,
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familleService.remove(id);
  }
}
