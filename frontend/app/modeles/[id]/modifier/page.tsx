'use client';

import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { ModeleForm, useEditModeleForm } from '@/features/modeles';

export default function ModifierModelePage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  const {
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
  } = useEditModeleForm({
    modeleId: id,
    onSuccess: () => router.push(`/modeles/${id}`),
  });

  function handleBack() {
    router.push(`/modeles/${id}`);
  }

  if (loading) {
    return <div className="p-5">Chargement...</div>;
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
                Modifier modèle
              </h1>

              <span
                className="rounded-full px-3 py-1 text-[12px] font-medium"
                style={{
                  backgroundColor: '#EDF3F7',
                  color: '#48667B',
                  border: '1px solid #E2EAF0',
                }}
              >
                Mise à jour
              </span>
            </div>

            <p className="mt-2 text-[14px]" style={{ color: '#6B8596' }}>
              Modifiez les informations du modèle sélectionné.
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

        <ModeleForm
          title="Informations du modèle"
          subtitle="Modifiez les champs nécessaires avant l’enregistrement."
          badge="Mise à jour"
          submitLabel="Enregistrer"
          values={values}
          familles={familles}
          etats={etats}
          loadingFamilles={loadingFamilles}
          loadingEtats={loadingEtats}
          saving={saving}
          error={error}
          success={success}
          onCodeChange={setCode}
          onLibelleChange={setLibelle}
          onFamilleChange={setIdFamille}
          onEtatChange={setIdEtat}
          onSubmit={handleSubmit}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
}