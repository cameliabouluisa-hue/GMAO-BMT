'use client';

import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { FamilleDetailCard, useFamilleDetail } from '@/features/familles';

export default function DetailFamillePage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const { famille, parentFamille, loading, deleting, error, handleDelete } =
    useFamilleDetail({
      familleId: id,
      onDeleteSuccess: () => router.push('/familles'),
    });

  function handleBack() {
    router.push('/familles');
  }

  function handleEdit() {
    router.push(`/familles/${id}/modifier`);
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
            onClick={handleBack}
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
          <FamilleDetailCard
            famille={famille}
            parentFamille={parentFamille}
            deleting={deleting}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}