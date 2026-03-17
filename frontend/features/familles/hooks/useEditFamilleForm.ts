'use client';

import { useEffect, useState } from 'react';

import {
  getFamilleById,
  getFamilles,
  updateFamille,
} from '@/features/familles/services/famille.service';
import type {
  FamilleApi,
  FamilleFormValues,
} from '@/features/familles/types/famille';

type UseEditFamilleFormOptions = {
  familleId: string;
  onSuccess?: () => void;
};

export function useEditFamilleForm({
  familleId,
  onSuccess,
}: UseEditFamilleFormOptions) {
  const [values, setValues] = useState<FamilleFormValues>({
    code: '',
    libelle: '',
    parentId: '',
  });

  const [familles, setFamilles] = useState<FamilleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingParents, setLoadingParents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setLoadingParents(true);
        setError(null);

        const [famille, allFamilles] = await Promise.all([
          getFamilleById(familleId),
          getFamilles(),
        ]);

        setValues({
          code: famille.code || '',
          libelle: famille.libelle || '',
          parentId: famille.parent_id ? String(famille.parent_id) : '',
        });

        setFamilles(
          allFamilles.filter(
            (f) => String(f.idFamille) !== String(familleId),
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
        setLoadingParents(false);
      }
    }

    if (familleId) {
      fetchData();
    }
  }, [familleId]);

  function setCode(value: string) {
    setValues((prev) => ({ ...prev, code: value }));
  }

  function setLibelle(value: string) {
    setValues((prev) => ({ ...prev, libelle: value }));
  }

  function setParentId(value: string) {
    setValues((prev) => ({ ...prev, parentId: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!values.code.trim() || !values.libelle.trim()) {
      setError('Le code et le libellé sont obligatoires.');
      setSuccess(null);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateFamille(familleId, {
        code: values.code.trim(),
        libelle: values.libelle.trim(),
        parent_id: values.parentId ? Number(values.parentId) : null,
      });

      setSuccess('La famille a été modifiée avec succès.');

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 700);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  }

  return {
    values,
    familles,
    loading,
    loadingParents,
    saving,
    error,
    success,
    setCode,
    setLibelle,
    setParentId,
    handleSubmit,
  };
}