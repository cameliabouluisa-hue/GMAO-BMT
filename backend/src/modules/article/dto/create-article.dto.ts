import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  reference: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  designation: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  prixUnitaire?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idFamille?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idUniteArticle?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idModele?: number;

  @IsOptional()
  @IsBoolean()
  gereEnStock?: boolean;

  @IsOptional()
  @IsBoolean()
  serialise?: boolean;

  @IsOptional()
  @IsBoolean()
  reparable?: boolean;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}