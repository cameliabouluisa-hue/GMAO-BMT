import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PointStructureService } from './point-structure.service';
import { CreatePointStructureDto } from './dto/create-point-structure.dto';
import { UpdatePointStructureDto } from './dto/update-point-structure.dto';

@Controller('point-structure')
export class PointStructureController {
  constructor(private readonly pointStructureService: PointStructureService) {}

  @Post()
  create(@Body() createPointStructureDto: CreatePointStructureDto) {
    return this.pointStructureService.create(createPointStructureDto);
  }

  @Get()
  findAll(@Query('typePoint') typePoint?: string) {
    return this.pointStructureService.findAll(typePoint);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pointStructureService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePointStructureDto: UpdatePointStructureDto,
  ) {
    return this.pointStructureService.update(id, updatePointStructureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pointStructureService.remove(id);
  }
}