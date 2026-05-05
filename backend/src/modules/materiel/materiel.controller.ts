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
import { MaterielService } from './materiel.service';
import { CreateMaterielDto } from './dto/create-materiel.dto';
import { UpdateMaterielDto } from './dto/update-materiel.dto';

@Controller('materiels')
export class MaterielController {
  constructor(private readonly materielService: MaterielService) {}

  @Post()
  create(@Body() createDto: CreateMaterielDto) {
    return this.materielService.create(createDto);
  }

  @Get()
  findAll() {
    return this.materielService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materielService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMaterielDto,
  ) {
    return this.materielService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materielService.remove(id);
  }
}