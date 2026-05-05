import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MaterielReceptionDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsOptional()
  @IsString()
  numeroSerie?: string;
}

class LigneEntreeStockDto {
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
  numeroLot?: string;

  @IsOptional()
  @IsDateString()
  datePeremption?: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterielReceptionDto)
  materiels?: MaterielReceptionDto[];
}

export class EntreeStockDto {
  @IsOptional()
  @IsString()
  numero?: string;

  @IsDateString()
  dateReception!: string;

  @IsOptional()
  @IsString()
  commentaire?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LigneEntreeStockDto)
  lignes!: LigneEntreeStockDto[];
}