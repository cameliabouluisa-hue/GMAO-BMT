'use client';

import { PointStructureFormPage } from '@/features/points-structure/components/PointStructureFormPage';
import { createPointStructure } from '@/features/points-structure/services/point-structure.service';
import {
  CreatePointStructureDto,
  UpdatePointStructureDto,
} from '@/features/points-structure/types/point-structure.type';

export default function NouveauPointStructurePage() {
  const handleSubmit = async (
    data: CreatePointStructureDto | UpdatePointStructureDto,
  ): Promise<void> => {
    await createPointStructure(data as CreatePointStructureDto);
  };

  return (
    <PointStructureFormPage
      mode="create"
      onSubmit={handleSubmit}
    />
  );
}