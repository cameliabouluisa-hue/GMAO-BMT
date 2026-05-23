'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Edit,
  GitBranch,
  MapPin,
  Package,
} from 'lucide-react';

import { getPointStructure } from '@/features/points-structure/services/point-structure.service';
import { PointStructureDetail } from '@/features/points-structure/types/point-structure.type';

export default function DetailPointStructurePage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [point, setPoint] = useState<PointStructureDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getPointStructure(id);
        setPoint(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement du point.',
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
        <p className="font-semibold text-slate-500">Chargement...</p>
      </main>
    );
  }

  if (error || !point) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
        <p className="font-semibold text-red-600">{error}</p>
      </main>
    );
  }

  const isGeo = point.typePoint === 'GEOGRAPHIQUE';

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
      <section className="mx-auto max-w-6xl space-y-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                  isGeo
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-orange-50 text-orange-700'
                }`}
              >
                {isGeo ? <MapPin size={26} /> : <GitBranch size={26} />}
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                  Fiche point de structure
                </p>

                <h1 className="mt-1 text-3xl font-black text-slate-950">
                  {point.libelle}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>Code : {point.code}</Badge>
                  <Badge>{isGeo ? 'Géographique' : 'Technique'}</Badge>
                  <Badge>{point.actif ? 'Actif' : 'Inactif'}</Badge>
                </div>
              </div>
            </div>

            <Link
              href={`/points-structure/${point.idPoint}/modifier`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0b3d4f] px-5 text-sm font-bold text-white hover:bg-[#082f3d]"
            >
              <Edit size={17} />
              Modifier
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<Building2 size={20} />}
            label="Type"
            value={isGeo ? 'Géographique' : 'Technique'}
          />

          <InfoCard
            icon={<Package size={20} />}
            label="Matériels"
            value={String(point.materiels?.length ?? 0)}
          />

          <InfoCard
            icon={<GitBranch size={20} />}
            label="Liens"
            value={String(point.liens?.length ?? 0)}
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Description</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {point.description || 'Aucune description renseignée.'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            Matériels rattachés
          </h2>

          {!point.materiels || point.materiels.length === 0 ? (
            <p className="mt-3 text-sm font-medium text-slate-500">
              Aucun matériel rattaché à ce point.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {point.materiels.map((materiel) => (
                <div
                  key={materiel.idMateriel}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-black text-slate-900">
                      {materiel.numeroSerie || materiel.code || '-'}
                    </p>
                    <p className="text-sm text-slate-500">
                      Code : {materiel.code || '-'}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {materiel.actif ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      {children}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
        {icon}
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}