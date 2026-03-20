import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateModeleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  libelle?: string;

  @IsOptional()
  @IsInt()
  idFamille?: number | null;

  @IsInt()
  idEtat: number;
}