'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { MaterielDetail } from '@/features/materiels/components/MaterielDetail';
import { getMaterielById } from '@/features/materiels/services/materiel.service';
import { Materiel } from '@/features/materiels/types/materiel';

export default function MaterielDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [materiel, setMateriel] = useState<Materiel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMateriel() {
      if (!id || Number.isNaN(id)) {
        setError('Identifiant matériel invalide.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getMaterielById(id);
        setMateriel(result);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement du matériel.');
      } finally {
        setLoading(false);
      }
    }

    loadMateriel();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-500">
              Chargement du matériel...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 shadow-sm">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => router.push('/materiels')}
              className="mt-5 rounded-2xl bg-[#123d5a] px-5 py-3 font-semibold text-white transition hover:bg-[#0f3148]"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!materiel) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-semibold text-slate-600">
              Matériel introuvable.
            </p>

            <button
              type="button"
              onClick={() => router.push('/materiels')}
              className="mt-5 rounded-2xl bg-[#123d5a] px-5 py-3 font-semibold text-white transition hover:bg-[#0f3148]"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <MaterielDetail
          materiel={materiel}
          onBack={() => router.push('/materiels')}
          onEdit={() => router.push(`/materiels/${materiel.idMateriel}/modifier`)}
        />
      </div>
    </main>
  );
}