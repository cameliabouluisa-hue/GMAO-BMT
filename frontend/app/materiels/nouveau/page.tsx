'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MaterielForm } from '@/features/materiels/components/MaterielForm';
import { createMateriel } from '@/features/materiels/services/materiel.service';
import { CreateMaterielDto } from '@/features/materiels/types/materiel';

export default function NouveauMaterielPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateMaterielDto) {
    await createMateriel(data);
    router.push('/materiels');
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
              BMT · Module équipement
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Nouveau matériel
            </h1>

            <p className="mt-2 text-slate-500">
              Créez un matériel manuellement et affectez-le à un article, un
              modèle et un emplacement.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/materiels')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>

        <MaterielForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/materiels')}
          submitLabel="Créer le matériel"
        />
      </div>
    </main>
  );
}