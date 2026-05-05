import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateModeleDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  libelle?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idFamille?: number | null;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  idEtat!:number ;
}