'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';

import { MaterielTable } from '@/features/materiels/components/MaterielTable';
import {
  deleteMateriel,
  getMateriels,
} from '@/features/materiels/services/materiel.service';
import { Materiel } from '@/features/materiels/types/materiel';

export default function MaterielsPage() {
  const router = useRouter();

  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMateriels() {
    try {
      setLoading(true);
      setError(null);

      const result = await getMateriels();
      setMateriels(result);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des matériels.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMateriels();
  }, []);

  function handleView(materiel: Materiel) {
    router.push(`/materiels/${materiel.idMateriel}`);
  }

  function handleEdit(materiel: Materiel) {
    router.push(`/materiels/${materiel.idMateriel}/modifier`);
  }

  async function handleDelete(materiel: Materiel) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le matériel ${
        materiel.code || materiel.idMateriel
      } ?`,
    );

    if (!confirmed) return;

    try {
      await deleteMateriel(materiel.idMateriel);
      await loadMateriels();
    } catch (err) {
      console.error(err);
      alert(
        "Impossible de supprimer ce matériel. Il est peut-être utilisé dans une autre partie de l'application.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
              Module équipements
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Matériels
            </h1>

            <p className="mt-2 text-slate-500">
              Gérez les matériels, leurs articles liés, leurs modèles et leurs
              emplacements.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadMateriels}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={18} />
              Actualiser
            </button>

            <button
              type="button"
              onClick={() => router.push('/materiels/nouveau')}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#123d5a] px-5 py-3 font-semibold  shadow-sm transition hover:bg-[#0f3148]"
            >
              <Plus size={18} />
              Nouveau matériel
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 font-medium text-red-700">
            {error}
          </div>
        )}

        <MaterielTable
          materiels={materiels}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}