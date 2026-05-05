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
import { MagasinService } from './magasin.service';
import { CreateMagasinDto } from './dto/create-magasin.dto';
import { UpdateMagasinDto } from './dto/update-magasin.dto';

@Controller('magasins')
export class MagasinController {
  constructor(private readonly magasinService: MagasinService) {}

  @Post()
  create(@Body() dto: CreateMagasinDto) {
    return this.magasinService.create(dto);
  }

  @Get()
  findAll() {
    return this.magasinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.magasinService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMagasinDto,
  ) {
    return this.magasinService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.magasinService.remove(id);
  }
}