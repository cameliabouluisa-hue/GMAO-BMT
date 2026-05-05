import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LigneSortieStockDto {
  @Type(() => Number)
  @IsInt()
  idArticle!: number;

  @Type(() => Number)
  @IsInt()
  idMagasin!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idEmplacement?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idMateriel?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  quantite!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  prixUnitaire?: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}

export class SortieStockDto {
  @IsOptional()
  @IsString()
  numero?: string;

  @IsDateString()
  dateSortie!: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LigneSortieStockDto)
  lignes!: LigneSortieStockDto[];
}