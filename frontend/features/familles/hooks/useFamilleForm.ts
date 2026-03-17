'use client';

import { useEffect, useState } from 'react';

import {
  createFamille,
  getFamilles,
} from '@/features/familles/services/famille.service';
import type {
  FamilleApi,
  FamilleFormValues,
} from '@/features/familles/types/famille';

type UseFamilleFormOptions = {
  onSuccess?: () => void;
};

export function useFamilleForm(options?: UseFamilleFormOptions) {
  const [values, setValues] = useState<FamilleFormValues>({
    code: '',
    libelle: '',
    parentId: '',
  });

  const [familles, setFamilles] = useState<FamilleApi[]>([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamilles() {
      try {
        setLoadingParents(true);
        setError(null);

        const data = await getFamilles();
        setFamilles(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement des familles.',
        );
      } finally {
        setLoadingParents(false);
      }
    }

    fetchFamilles();
  }, []);

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

      await createFamille({
        code: values.code.trim(),
        libelle: values.libelle.trim(),
        parent_id: values.parentId ? Number(values.parentId) : null,
      });

      setSuccess('La famille a été ajoutée avec succès.');
      setValues({
        code: '',
        libelle: '',
        parentId: '',
      });

      if (options?.onSuccess) {
        setTimeout(() => {
          options.onSuccess?.();
        }, 900);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'ajout.",
      );
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  }

  return {
    values,
    familles,
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