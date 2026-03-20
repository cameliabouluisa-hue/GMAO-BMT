'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ModeleForm, useModeleForm } from '@/features/modeles';

export default function NouveauModelePage() {
  const router = useRouter();

  const {
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
  } = useModeleForm({
    onSuccess: () => router.push('/modeles'),
  });

  function handleBack() {
    router.push('/modeles');
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
                Nouveau modèle
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
              Créez un nouveau modèle et rattachez-le à une famille et à un état.
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
          subtitle="Renseignez les champs nécessaires avant l’enregistrement."
          badge="Formulaire d’ajout"
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