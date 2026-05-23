'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PointStructureFormPage } from '@/features/points-structure/components/PointStructureFormPage';
import {
  getPointStructure,
  updatePointStructure,
} from '@/features/points-structure/services/point-structure.service';
import {
  CreatePointStructureDto,
  PointStructureDetail,
  UpdatePointStructureDto,
} from '@/features/points-structure/types/point-structure.type';

export default function ModifierPointStructurePage() {
  const params = useParams();
  const id = Number(params.id);

  const [point, setPoint] = useState<PointStructureDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPoint() {
      try {
        setLoading(true);
        setError('');

        const data = await getPointStructure(id);
        setPoint(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement du point de structure.',
        );
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(id) && id > 0) {
      loadPoint();
    } else {
      setError('Identifiant du point invalide.');
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async (
    data: CreatePointStructureDto | UpdatePointStructureDto,
  ): Promise<void> => {
    await updatePointStructure(id, data as UpdatePointStructureDto);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
        <p className="font-semibold text-slate-500">Chargement...</p>
      </main>
    );
  }

  if (error || !point) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
        <p className="font-semibold text-red-600">
          {error || 'Point de structure introuvable.'}
        </p>
      </main>
    );
  }

  return (
    <PointStructureFormPage
      mode="edit"
      initialData={point}
      onSubmit={handleSubmit}
    />
  );
}