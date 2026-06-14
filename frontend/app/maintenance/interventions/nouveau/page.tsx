'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

import { InterventionForm } from '@/features/interventions/components/InterventionForm';
import { createIntervention } from '@/features/interventions/services/intervention.service';
import type { CreateInterventionDto } from '@/features/interventions/types/intervention.types';

export default function NouvelleInterventionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(data: CreateInterventionDto) {
    try {
      setLoading(true);
      setError('');
      const created = await createIntervention(data);
      router.push(`/maintenance/interventions/${created.idIntervention}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de creer l'intervention.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
      <section className="mx-auto max-w-[1250px] space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
              Module maintenance
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Nouvelle intervention
            </h1>
            <p className="mt-1 text-base text-slate-500">
              Creation directe d'un ordre de travail.
            </p>
          </div>
          <Link
            href="/maintenance/interventions"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <InterventionForm
          loading={loading}
          submitLabel="Creer intervention"
          onCancel={() => router.push('/maintenance/interventions')}
          onSubmit={(data) => handleSubmit(data as CreateInterventionDto)}
        />
      </section>
    </main>
  );
}
