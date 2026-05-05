import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePointStructureDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  libelle!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['GEOGRAPHIQUE', 'TECHNIQUE'])
  typePoint!: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}