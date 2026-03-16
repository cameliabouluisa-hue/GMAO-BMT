'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, FolderTree, Pencil, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Modele = {
  idModele: number;
  code: string | null;
  libelle: string | null;
  idFamille: number | null;
};

type Famille = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
  parent_id: number | null;
  modele?: Modele[];
};

export default function DetailFamillePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [famille, setFamille] = useState<Famille | null>(null);
  const [parentFamille, setParentFamille] = useState<Famille | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFamille() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/familles');

        if (!response.ok) {
          throw new Error('Impossible de charger les familles.');
        }

        const data: Famille[] = await response.json();
        const current = data.find((item) => String(item.idFamille) === String(id));

        if (!current) {
          throw new Error('Famille introuvable.');
        }

        setFamille(current);

        if (current.parent_id) {
          const parent = data.find((item) => item.idFamille === current.parent_id) || null;
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

    if (id) {
      fetchFamille();
    }
  }, [id]);

  function handleEdit() {
  router.push(`/familles/${id}/modifier`);
}


 async function handleDelete() {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer cette famille ?',
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`http://localhost:3001/familles/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Impossible de supprimer la famille.');
    }

    router.push('/familles');
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erreur inconnue');
  }
} 

  return (
    <div
      className="min-h-full p-5"
      style={{
        background: 'linear-gradient(180deg, #F7FAFC 0%, #EEF4F7 100%)',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.26em]"
              style={{ color: '#6E8CA0' }}
            >
              BMT · Module équipement
            </p>

            <h1
              className="mt-2 text-[28px] font-bold leading-tight"
              style={{ color: '#183B56' }}
            >
              Détail famille
            </h1>

            <p className="mt-2 text-[14px]" style={{ color: '#6B8596' }}>
              Consultation des informations d’une famille et de ses modèles liés.
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

        {loading && (
          <div className="py-6 text-[13px]" style={{ color: '#5F7C90' }}>
            Chargement...
          </div>
        )}

        {error && (
          <div
            className="rounded-xl border px-4 py-3 text-[13px]"
            style={{
              borderColor: '#E8B4B4',
              color: '#8A1F1F',
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && famille && (
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
                  <FolderTree size={20} />
                </div>

                <div>
                  <h2
                    className="text-[20px] font-semibold"
                    style={{ color: '#183B56' }}
                  >
                    {famille.libelle || 'Sans libellé'}
                  </h2>
                  <p className="text-[13px]" style={{ color: '#6B8596' }}>
                    Code : {famille.code || '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
              <div>
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  ID famille
                </p>
                <div
                  className="rounded-[12px] border px-4 py-3 text-[14px]"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                >
                  {famille.idFamille}
                </div>
              </div>

              <div>
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Code
                </p>
                <div
                  className="rounded-[12px] border px-4 py-3 text-[14px]"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                >
                  {famille.code || '—'}
                </div>
              </div>

              <div>
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Libellé
                </p>
                <div
                  className="rounded-[12px] border px-4 py-3 text-[14px]"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                >
                  {famille.libelle || '—'}
                </div>
              </div>

              <div>
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Famille parente
                </p>
                <div
                  className="rounded-[12px] border px-4 py-3 text-[14px]"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                >
                  {parentFamille?.libelle || 'Aucune'}
                </div>
              </div>
            </div>

            <div
              className="border-t px-6 py-5"
              style={{
                borderColor: '#EEF3F6',
                backgroundColor: '#FCFDFE',
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3
                  className="text-[14px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: '#6E8CA0' }}
                >
                  Modèles associés
                </h3>

                <span
                  className="rounded-full px-3 py-1 text-[12px] font-medium"
                  style={{
                    backgroundColor: '#EDF3F7',
                    color: '#48667B',
                    border: '1px solid #E2EAF0',
                  }}
                >
                  {famille.modele?.length || 0} modèle{(famille.modele?.length || 0) > 1 ? 's' : ''}
                </span>
              </div>

              {!famille.modele || famille.modele.length === 0 ? (
                <div
                  className="rounded-[12px] border px-4 py-3 text-[13px]"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#6B8596',
                  }}
                >
                  Aucun modèle associé.
                </div>
              ) : (
                <div className="space-y-2">
                  {famille.modele.map((modele) => (
                    <div
                      key={modele.idModele}
                      className="flex items-center justify-between rounded-[12px] border px-4 py-3"
                      style={{
                        borderColor: '#E6EDF2',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <div>
                        <p className="text-[14px] font-medium" style={{ color: '#183B56' }}>
                          {modele.libelle || 'Sans libellé'}
                        </p>
                        <p className="text-[12px]" style={{ color: '#6B8596' }}>
                          {modele.code || 'Sans code'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="flex flex-wrap items-center justify-end gap-3 border-t px-6 py-4"
              style={{
                borderColor: '#EEF3F6',
                backgroundColor: '#FFFFFF',
              }}
            >
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-slate-50"
                style={{
                  borderColor: '#E6EDF2',
                  backgroundColor: '#FFFFFF',
                  color: '#183B56',
                }}
              >
                <Pencil size={15} />
                <span>Modifier</span>
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-red-50"
                style={{
                  borderColor: '#F0D7D7',
                  backgroundColor: '#FFF8F8',
                  color: '#B75B5B',
                }}
              >
                <Trash2 size={15} />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
