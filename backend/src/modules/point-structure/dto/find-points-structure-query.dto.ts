import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindPointsStructureQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['GEOGRAPHIQUE', 'TECHNIQUE', 'TOUS'])
  typePoint?: 'GEOGRAPHIQUE' | 'TECHNIQUE' | 'TOUS';

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false', 'all'])
  actif?: 'true' | 'false' | 'all';
}   