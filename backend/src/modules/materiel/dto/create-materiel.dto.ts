import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMaterielDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  numeroSerie?: string;

  @IsOptional()
  @IsDateString()
  dateMiseService?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idArticle?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idModele?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idEtat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idType?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idPointStructure?: number;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}