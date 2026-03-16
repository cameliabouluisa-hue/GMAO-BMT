'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, FolderPlus, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Famille = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
  parent_id: number | null;
};

export default function NouvelleFamillePage() {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [parentId, setParentId] = useState('');
  const [familles, setFamilles] = useState<Famille[]>([]);

  const [loadingParents, setLoadingParents] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamilles() {
      try {
        setLoadingParents(true);
        const response = await fetch('http://localhost:3001/familles');

        if (!response.ok) {
          throw new Error('Impossible de charger les familles parentes.');
        }

        const data = await response.json();
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!code.trim() || !libelle.trim()) {
      setError('Le code et le libellé sont obligatoires.');
      setSuccess(null);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = {
        code: code.trim(),
        libelle: libelle.trim(),
        parent_id: parentId ? Number(parentId) : null,
      };

      const response = await fetch('http://localhost:3001/familles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Impossible d'ajouter la famille.";

        try {
          const data = await response.json();
          if (data?.message) {
            message = Array.isArray(data.message)
              ? data.message.join(', ')
              : data.message;
          }
        } catch {
          // on garde le message par défaut
        }

        throw new Error(message);
      }

      setSuccess('La famille a été ajoutée avec succès.');
      setCode('');
      setLibelle('');
      setParentId('');

      setTimeout(() => {
        router.push('/familles');
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'ajout.",
      );
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="min-h-full p-5"
      style={{
        background: 'linear-gradient(180deg, #F7FAFC 0%, #EEF4F7 100%)',
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.26em]"
              style={{ color: '#6E8CA0' }}
            >
              BMT · Module équipement
            </p>

            <div className="mt-2 flex items-center gap-3">
              <h1
                className="text-[28px] font-bold leading-tight"
                style={{ color: '#183B56' }}
              >
                Nouvelle famille
              </h1>

              <span
                className="rounded-full px-3 py-1 text-[12px] font-medium"
                style={{
                  backgroundColor: '#EDF3F7',
                  color: '#48667B',
                  border: '1px solid #E2EAF0',
                }}
              >
                Formulaire d’ajout
              </span>
            </div>

            <p className="mt-2 text-[14px]" style={{ color: '#6B8596' }}>
              Créez une nouvelle famille et rattachez-la à une famille parente si
              nécessaire.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/familles')}
            className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-slate-50"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            <ChevronLeft size={16} />
            <span>Retour</span>
          </button>
        </div>

        <div
          className="overflow-hidden rounded-[20px] border"
          style={{
            borderColor: '#E4EBF0',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(15, 35, 55, 0.05)',
          }}
        >
          <div
            className="border-b px-6 py-5"
            style={{
              borderColor: '#EEF3F6',
              backgroundColor: '#FAFCFD',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[14px]"
                style={{
                  backgroundColor: '#EEF4F7',
                  color: '#183B56',
                }}
              >
                <FolderPlus size={20} />
              </div>

              <div>
                <h2
                  className="text-[18px] font-semibold"
                  style={{ color: '#183B56' }}
                >
                  Informations de la famille
                </h2>
                <p className="text-[13px]" style={{ color: '#6B8596' }}>
                  Renseignez les champs nécessaires avant l’enregistrement.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Code famille <span style={{ color: '#B75B5B' }}>*</span>
                </label>

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex : FAM006"
                  className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Libellé <span style={{ color: '#B75B5B' }}>*</span>
                </label>

                <input
                  type="text"
                  value={libelle}
                  onChange={(e) => setLibelle(e.target.value)}
                  placeholder="Ex : Moteurs"
                  className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Famille parente
                </label>

                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  disabled={loadingParents}
                  className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                >
                  <option value="">Aucune (famille racine)</option>
                  {familles.map((famille) => (
                    <option key={famille.idFamille} value={famille.idFamille}>
                      {famille.libelle} {famille.code ? `(${famille.code})` : ''}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-[12px]" style={{ color: '#8AA0AF' }}>
                  Laissez vide si la famille doit être créée à la racine.
                </p>
              </div>
            </div>

            {error && (
              <div
                className="mt-5 rounded-[12px] border px-4 py-3 text-[13px]"
                style={{
                  borderColor: '#F0D7D7',
                  backgroundColor: '#FFF8F8',
                  color: '#B75B5B',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="mt-5 rounded-[12px] border px-4 py-3 text-[13px]"
                style={{
                  borderColor: '#D6EBDD',
                  backgroundColor: '#F6FCF8',
                  color: '#2F7A4F',
                }}
              >
                {success}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push('/familles')}
                className="inline-flex h-[44px] items-center rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-slate-50"
                style={{
                  borderColor: '#E6EDF2',
                  backgroundColor: '#FFFFFF',
                  color: '#183B56',
                }}
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-[44px] items-center gap-2 rounded-[12px] px-5 text-[13px] font-semibold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  backgroundColor: '#183B56',
                  color: '#FFFFFF',
                  border: '1px solid #183B56',
                }}
              >
                <Save size={15} />
                <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
