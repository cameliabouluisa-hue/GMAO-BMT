'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Play,
  Plus,
  RefreshCcw,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';

import { Select } from '@/components/select';
import { InterventionTable } from '@/features/interventions/components/InterventionTable';
import {
  deleteIntervention,
  getInterventions,
} from '@/features/interventions/services/intervention.service';
import type { Intervention } from '@/features/interventions/types/intervention.types';

type EtatFilter =
  | 'TOUS'
  | 'EN_PREPARATION'
  | 'ATTENTE_VALIDATION'
  | 'VALIDEE'
  | 'ATTENTE_FOURNITURE'
  | 'EN_COURS'
  | 'TERMINE'
  | 'TRAVAUX_ACCEPTES'
  | 'TRAVAUX_REFUSES'
  | 'SOLDE'
  | 'ARCHIVE'
  | 'ANNULE';

type TypeFilter = 'TOUS' | 'CORRECTIF' | 'PREVENTIF' | 'CONDITIONNEL';

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [etatFilter, setEtatFilter] = useState<EtatFilter>('TOUS');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('TOUS');

  const loadInterventions = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getInterventions();
      setInterventions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des interventions.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  const filteredInterventions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return interventions.filter((intervention) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          intervention.code,
          intervention.libelle,
          intervention.description,
          intervention.typeMaintenance,
          intervention.etat,
          intervention.priorite,
          intervention.materiel?.code,
          intervention.materiel?.libelle,
          intervention.equipe_maintenance?.libelle,
          intervention.idIntervention
            ? `OT-${intervention.idIntervention}`
            : undefined,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch),
          );

      const matchesEtat =
        etatFilter === 'TOUS' || intervention.etat === etatFilter;
      const matchesType =
        typeFilter === 'TOUS' || intervention.typeMaintenance === typeFilter;

      return matchesSearch && matchesEtat && matchesType;
    });
  }, [interventions, search, etatFilter, typeFilter]);

  const stats = useMemo(
    () => ({
      total: interventions.length,
      preparation: interventions.filter((item) => item.etat === 'EN_PREPARATION')
        .length,
      enCours: interventions.filter((item) => item.etat === 'EN_COURS').length,
      terminees: interventions.filter((item) => item.etat === 'TERMINE').length,
      annulees: interventions.filter((item) => item.etat === 'ANNULE').length,
    }),
    [interventions],
  );

  async function handleDelete(intervention: Intervention) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'intervention ${
        intervention.code || intervention.idIntervention
      } ?`,
    );

    if (!confirmed) return;

    try {
      setActionLoadingId(intervention.idIntervention);
      setError('');
      await deleteIntervention(intervention.idIntervention);
      await loadInterventions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer cette intervention.",
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  function resetFilters() {
    setSearch('');
    setEtatFilter('TOUS');
    setTypeFilter('TOUS');
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
      <section className="mx-auto max-w-[1450px] space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
              Module maintenance
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Interventions
            </h1>
            <p className="mt-1 text-base text-slate-500">
              Consultez et pilotez les ordres de travail correctifs,
              preventifs et conditionnels.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadInterventions}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw
                size={18}
                className={loading ? 'animate-spin' : ''}
              />
              Actualiser
            </button>
            <Link
              href="/maintenance/interventions/nouveau"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#06475a] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#043747]"
            >
              <Plus size={18} />
              Nouvelle intervention
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          <MiniStat icon={<ClipboardList size={18} />} label="Total" value={stats.total} tone="blue" />
          <MiniStat icon={<ClipboardList size={18} />} label="Preparation" value={stats.preparation} tone="slate" />
          <MiniStat icon={<Play size={18} />} label="En cours" value={stats.enCours} tone="indigo" />
          <MiniStat icon={<CheckCircle2 size={18} />} label="Terminees" value={stats.terminees} tone="green" />
          <MiniStat icon={<XCircle size={18} />} label="Annulees" value={stats.annulees} tone="red" />
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 xl:grid-cols-[1.5fr_0.75fr_0.75fr_auto]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par code, libelle, materiel, equipe..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#06475a] focus:bg-white focus:ring-4 focus:ring-[#06475a]/10"
              />
            </div>

            <Select
              value={etatFilter}
              onValueChange={(value: string) =>
                setEtatFilter(value as EtatFilter)
              }
              items={[
                { label: 'Tous les etats', value: 'TOUS' },
                { label: 'En preparation', value: 'EN_PREPARATION' },
                { label: 'Attente validation', value: 'ATTENTE_VALIDATION' },
                { label: 'Validee', value: 'VALIDEE' },
                { label: 'Attente fourniture', value: 'ATTENTE_FOURNITURE' },
                { label: 'En cours', value: 'EN_COURS' },
                { label: 'Termine', value: 'TERMINE' },
                { label: 'Travaux acceptes', value: 'TRAVAUX_ACCEPTES' },
                { label: 'Travaux refuses', value: 'TRAVAUX_REFUSES' },
                { label: 'Solde', value: 'SOLDE' },
                { label: 'Archive', value: 'ARCHIVE' },
                { label: 'Annule', value: 'ANNULE' },
              ]}
            />

            <Select
              value={typeFilter}
              onValueChange={(value: string) =>
                setTypeFilter(value as TypeFilter)
              }
              items={[
                { label: 'Tous les types', value: 'TOUS' },
                { label: 'Correctif', value: 'CORRECTIF' },
                { label: 'Preventif', value: 'PREVENTIF' },
                { label: 'Conditionnel', value: 'CONDITIONNEL' },
              ]}
            />

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw size={17} />
              Reinitialiser
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <InterventionTable
          interventions={filteredInterventions}
          total={interventions.length}
          loading={loading}
          actionLoadingId={actionLoadingId}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}

function MiniStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'red' | 'slate' | 'indigo';
}) {
  const tones: Record<typeof tone, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-600',
    indigo: 'bg-indigo-50 text-indigo-700',
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
        <p className="text-2xl font-black text-slate-950">{value}</p>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
