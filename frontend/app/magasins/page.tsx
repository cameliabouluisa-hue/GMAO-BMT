'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MagasinTable } from '@/features/magasins/components/MagasinTable';
import {
  deleteMagasin,
  getMagasins,
} from '@/features/magasins/services/magasin.service';
import { Magasin } from '@/features/magasins/types/magasin';

export default function MagasinsPage() {
  const router = useRouter();
  const [data, setData] = useState<Magasin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      const result = await getMagasins();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement.',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer ce magasin ?',
    );

    if (!confirmed) return;

    try {
      await deleteMagasin(id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Suppression impossible.');
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
              BMT · Module stock
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#0f3d56]">
              Magasins
            </h1>
            <p className="mt-2 text-slate-500">
              Gestion des magasins de stockage et de réception.
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

        {loading && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Chargement des magasins...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <MagasinTable
            data={data}
            onCreate={() => router.push('/magasins/nouveau')}
            onEdit={(id) => router.push(`/magasins/${id}/modifier`)}
            onRemove={handleDelete}
          />
        )}
      </div>
    </main>
  );
}