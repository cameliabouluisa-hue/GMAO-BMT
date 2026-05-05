import { PartialType } from '@nestjs/mapped-types';
import { CreatePointStructureDto } from './create-point-structure.dto';

export class UpdatePointStructureDto extends PartialType(
  CreatePointStructureDto,
) {}