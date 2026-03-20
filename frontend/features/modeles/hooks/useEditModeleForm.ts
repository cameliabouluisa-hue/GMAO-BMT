'use client';

import { useEffect, useState } from 'react';

import { getFamilles } from '@/features/familles/services/famille.service';
import type { FamilleApi } from '@/features/familles/types/famille';
import {
  getEtatsModele,
  getModeleById,
  updateModele,
} from '@/features/modeles/services/modele.service';
import type {
  ModeleEtat,
  ModeleFormValues,
} from '@/features/modeles/types/modele';

type UseEditModeleFormOptions = {
  modeleId: string;
  onSuccess?: () => void;
};

export function useEditModeleForm({
  modeleId,
  onSuccess,
}: UseEditModeleFormOptions) {
  const [values, setValues] = useState<ModeleFormValues>({
    code: '',
    libelle: '',
    idFamille: '',
    idEtat: '',
  });

  const [familles, setFamilles] = useState<FamilleApi[]>([]);
  const [etats, setEtats] = useState<ModeleEtat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFamilles, setLoadingFamilles] = useState(true);
  const [loadingEtats, setLoadingEtats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setLoadingFamilles(true);
        setLoadingEtats(true);
        setError(null);

        const [modele, famillesData, etatsData] = await Promise.all([
          getModeleById(modeleId),
          getFamilles(),
          getEtatsModele(),
        ]);

        setValues({
          code: modele.code || '',
          libelle: modele.libelle || '',
          idFamille: modele.idFamille ? String(modele.idFamille) : '',
          idEtat: modele.idEtat ? String(modele.idEtat) : '',
        });

        setFamilles(famillesData);
        setEtats(etatsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
        setLoadingFamilles(false);
        setLoadingEtats(false);
      }
    }

    if (modeleId) {
      fetchData();
    }
  }, [modeleId]);

  function setCode(value: string) {
    setValues((prev) => ({ ...prev, code: value }));
  }

  function setLibelle(value: string) {
    setValues((prev) => ({ ...prev, libelle: value }));
  }

  function setIdFamille(value: string) {
    setValues((prev) => ({ ...prev, idFamille: value }));
  }

  function setIdEtat(value: string) {
    setValues((prev) => ({ ...prev, idEtat: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!values.idEtat) {
      setError("L'état du modèle est obligatoire.");
      setSuccess(null);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateModele(modeleId, {
        code: values.code.trim() || undefined,
        libelle: values.libelle.trim() || undefined,
        idFamille: values.idFamille ? Number(values.idFamille) : null,
        idEtat: Number(values.idEtat),
      });

      setSuccess('Le modèle a été modifié avec succès.');

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
    etats,
    loading,
    loadingFamilles,
    loadingEtats,
    saving,
    error,
    success,
    setCode,
    setLibelle,
    setIdFamille,
    setIdEtat,
    handleSubmit,
  };
}