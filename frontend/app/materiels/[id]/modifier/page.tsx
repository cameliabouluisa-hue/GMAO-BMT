'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { MaterielForm } from '@/features/materiels/components/MaterielForm';
import {
  getMaterielById,
  updateMateriel,
} from '@/features/materiels/services/materiel.service';
import {
  CreateMaterielDto,
  Materiel,
} from '@/features/materiels/types/materiel';

export default function ModifierMaterielPage() {
  const router = useRouter();
  const params = useParams();

  const id = Number(params.id);

  const [materiel, setMateriel] = useState<Materiel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  async function handleSubmit(data: CreateMaterielDto) {
    if (!id || Number.isNaN(id)) return;

    try {
      setSaving(true);
      setError(null);

      await updateMateriel(id, data);

      router.push(`/materiels/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'enregistrement des modifications.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
              BMT · Module équipements
            </p>

            <h1 className="mt-2 text-4xl font-black text-slate-900">
              Modifier matériel
            </h1>

            <p className="mt-2 text-slate-500">
              {materiel
                ? `Modification du matériel ${materiel.code || materiel.idMateriel}.`
                : 'Modifiez la fiche du matériel sélectionné.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              id && !Number.isNaN(id)
                ? router.push(`/materiels/${id}`)
                : router.push('/materiels')
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>

        {loading && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center font-semibold text-slate-500 shadow-sm">
            Chargement du matériel...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 font-semibold text-red-700">
            {error}
          </div>
        )}

        {materiel && !loading && (
          <div className={saving ? 'pointer-events-none opacity-70' : ''}>
            <MaterielForm
              initialData={materiel}
              onSubmit={handleSubmit}
              onCancel={() => router.push(`/materiels/${id}`)}
              submitLabel={saving ? 'Enregistrement...' : 'Enregistrer'}
            />
          </div>
        )}
      </div>
    </main>
  );
}