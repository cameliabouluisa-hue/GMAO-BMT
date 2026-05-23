import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum TypePointStructure {
  GEOGRAPHIQUE = 'GEOGRAPHIQUE',
  TECHNIQUE = 'TECHNIQUE',
}

export class CreatePointStructureDto {
  @IsString()
  code?: string;

  @IsString()
  libelle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TypePointStructure)
  typePoint?: TypePointStructure;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}