'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { StockEntreeForm } from '@/features/stock-entrees/components/StockEntreeForm';
import { createStockEntree } from '@/features/stock-entrees/services/stock-entree.service';
import { CreateStockEntreeDto } from '@/features/stock-entrees/types/stock-entree';

export default function NouvelleEntreeStockPage() {
  const router = useRouter();

  async function handleSubmit(data: CreateStockEntreeDto) {
    await createStockEntree(data);
    router.push('/stock/entrees');
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
              Module stock
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Nouvelle entrée stock
            </h1>

            <p className="mt-2 text-slate-500">
              Créez un bon d’entrée et ajoutez les matériels sérialisés si
              nécessaire.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/stock/entrees')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>

        <StockEntreeForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}