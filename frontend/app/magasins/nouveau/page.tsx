'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MagasinForm } from '@/features/magasins/components/MagasinForm';
import { createMagasin } from '@/features/magasins/services/magasin.service';
import { CreateMagasinDto } from '@/features/magasins/types/magasin';

export default function NouveauMagasinPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateMagasinDto) {
    await createMagasin(data);
    router.push('/magasins');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
              BMT · Module stock
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#0f3d56]">
              Nouveau magasin
            </h1>
            <p className="mt-2 text-slate-500">
              Créez un magasin utilisé dans les opérations de stock.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>

        <MagasinForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/magasins')}
          submitLabel="Créer le magasin"
        />
      </div>
    </main>
  );
}