'use client';

import { useEffect, useState } from 'react';

import { getFamilles } from '@/features/familles/services/famille.service';
import type { FamilleApi } from '@/features/familles/types/famille';
import {
  createModele,
  getEtatsModele,
} from '@/features/modeles/services/modele.service';
import type {
  ModeleEtat,
  ModeleFormValues,
} from '@/features/modeles/types/modele';

type UseModeleFormOptions = {
  onSuccess?: () => void;
};

export function useModeleForm(options?: UseModeleFormOptions) {
  const [values, setValues] = useState<ModeleFormValues>({
    code: '',
    libelle: '',
    idFamille: '',
    idEtat: '',
  });

  const [familles, setFamilles] = useState<FamilleApi[]>([]);
  const [etats, setEtats] = useState<ModeleEtat[]>([]);
  const [loadingFamilles, setLoadingFamilles] = useState(true);
  const [loadingEtats, setLoadingEtats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingFamilles(true);
        setLoadingEtats(true);
        setError(null);

        const [famillesData, etatsData] = await Promise.all([
          getFamilles(),
          getEtatsModele(),
        ]);

        setFamilles(famillesData);
        setEtats(etatsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement des données.',
        );
      } finally {
        setLoadingFamilles(false);
        setLoadingEtats(false);
      }
    }

    fetchData();
  }, []);

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

      await createModele({
        code: values.code.trim() || undefined,
        libelle: values.libelle.trim() || undefined,
        idFamille: values.idFamille ? Number(values.idFamille) : null,
        idEtat: Number(values.idEtat),
      });

      setSuccess('Le modèle a été ajouté avec succès.');
      setValues({
        code: '',
        libelle: '',
        idFamille: '',
        idEtat: '',
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
    etats,
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