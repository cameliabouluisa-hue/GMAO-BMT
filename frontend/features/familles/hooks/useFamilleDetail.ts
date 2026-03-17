'use client';

import { useEffect, useState } from 'react';

import {
  deleteFamille,
  getFamilleById,
  getFamilles,
} from '@/features/familles/services/famille.service';
import type { FamilleApi } from '@/features/familles/types/famille';

type UseFamilleDetailOptions = {
  familleId: string;
  onDeleteSuccess?: () => void;
};

export function useFamilleDetail({
  familleId,
  onDeleteSuccess,
}: UseFamilleDetailOptions) {
  const [famille, setFamille] = useState<FamilleApi | null>(null);
  const [parentFamille, setParentFamille] = useState<FamilleApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamilleDetail() {
      try {
        setLoading(true);
        setError(null);

        const [currentFamille, allFamilles] = await Promise.all([
          getFamilleById(familleId),
          getFamilles(),
        ]);

        setFamille(currentFamille);

        if (currentFamille.parent_id) {
          const parent =
            allFamilles.find(
              (item) => item.idFamille === currentFamille.parent_id,
            ) || null;
          setParentFamille(parent);
        } else {
          setParentFamille(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    if (familleId) {
      fetchFamilleDetail();
    }
  }, [familleId]);

  async function handleDelete() {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer cette famille ?',
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteFamille(Number(familleId));
      onDeleteSuccess?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setDeleting(false);
    }
  }

  return {
    famille,
    parentFamille,
    loading,
    deleting,
    error,
    handleDelete,
  };
}