import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StockService } from './stock.service';
import { EntreeStockDto } from './dto/entree-stock.dto';
import { SortieStockDto } from './dto/sortie-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('entrees')
  entreeStock(@Body() dto: EntreeStockDto) {
    return this.stockService.entreeStock(dto);
  }

  @Get()
  findAllStock() {
    return this.stockService.findAllStock();
  }

  @Get('mouvements')
  findAllMouvements() {
    return this.stockService.findAllMouvements();
  }

  @Get('entrees')
  findEntrees() {
    return this.stockService.findEntrees();
  }

  @Get('entrees/:id')
  findEntreeById(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.findEntreeById(id);
  }

  @Post('sorties')
  sortieStock(@Body() dto: SortieStockDto) {
    return this.stockService.sortieStock(dto);
  }
}