'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { StockEntreeForm } from '@/features/stock-entrees/components/StockEntreeForm';
import { createStockEntree } from '@/features/stock-entrees/services/stock-entree.service';

import type { CreateStockEntreeDto } from '@/features/stock-entrees/types/stock-entree';

export default function NouvelleEntreeStockPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(data: CreateStockEntreeDto) {
    try {
      setError('');

      const created = await createStockEntree(data);

      router.push(`/stock/entrees/${created.idEntreeStock}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de l'entrée stock.",
      );
    }
  }

  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#f5f7fb] px-5 py-6">
      <section className="mx-auto max-w-[1180px] space-y-5">
        <BackButton onClick={() => router.push('/stock/entrees')} />

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
            {error}
          </div>
        )}

        <StockEntreeForm onSubmit={handleSubmit} />
      </section>
    </main>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-[#06475a]"
    >
      <ArrowLeft size={18} />
      Retour
    </button>
  );
}