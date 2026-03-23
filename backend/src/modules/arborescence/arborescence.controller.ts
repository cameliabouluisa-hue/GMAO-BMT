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
import { ArborescenceService, TreeNode } from './arborescence.service';
import { CreateLienArborescenceDto } from './dto/create-lien-arborescence.dto';
import { MoveNodeDto } from './dto/move-node.dto';

@Controller('arborescence')
export class ArborescenceController {
  constructor(private readonly arborescenceService: ArborescenceService) {}

  @Post('liens')
  createLien(@Body() dto: CreateLienArborescenceDto) {
    return this.arborescenceService.createLien(dto);
  }

  @Delete('liens/:id')
  deleteLien(@Param('id', ParseIntPipe) id: number) {
    return this.arborescenceService.deleteLien(id);
  }

  @Patch('move')
  moveNode(@Body() dto: MoveNodeDto) {
    return this.arborescenceService.moveNode(dto);
  }

  @Get('geographique/tree')
  getGeographiqueTree(): Promise<TreeNode[]> {
    return this.arborescenceService.getGeographiqueTree();
  }

  @Get('technique/tree')
  getTechniqueTree(): Promise<TreeNode[]> {
    return this.arborescenceService.getTechniqueTree();
  }

  @Get('materiel/tree')
  getMaterielTree(): Promise<TreeNode[]> {
    return this.arborescenceService.getMaterielTree();
  }
}