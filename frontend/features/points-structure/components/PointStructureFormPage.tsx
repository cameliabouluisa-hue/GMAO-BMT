'use client';

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Check,
  GitBranch,
  MapPin,
  Save,
  Wand2,
} from 'lucide-react';

import {
  CreatePointStructureDto,
  PointStructureListItem,
  TypePointStructure,
  UpdatePointStructureDto,
} from '../types/point-structure.type';

type Props = {
  mode: 'create' | 'edit';
  initialData?: PointStructureListItem | null;
  onSubmit: (
    data: CreatePointStructureDto | UpdatePointStructureDto,
  ) => Promise<void>;
};

export function PointStructureFormPage({
  mode,
  initialData,
  onSubmit,
}: Props) {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [description, setDescription] = useState('');
  const [typePoint, setTypePoint] =
    useState<TypePointStructure>('GEOGRAPHIQUE');
  const [actif, setActif] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isEdit && initialData) {
      setCode(initialData.code || '');
      setLibelle(initialData.libelle || '');
      setDescription(initialData.description || '');
      setTypePoint(initialData.typePoint || 'GEOGRAPHIQUE');
      setActif(Boolean(initialData.actif));
    }
  }, [isEdit, initialData]);

  const completion = useMemo(() => {
    let value = 0;
    if (code.trim()) value += 35;
    if (libelle.trim()) value += 35;
    if (typePoint) value += 20;
    if (description.trim()) value += 10;
    return value;
  }, [code, libelle, typePoint, description]);

  const generateCode = () => {
    setError('');

    if (!libelle.trim()) {
      setError('Saisissez un libellé avant de générer le code.');
      return;
    }

    const prefix = typePoint === 'GEOGRAPHIQUE' ? 'GEO' : 'TEC';

    const cleaned = libelle
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .toUpperCase()
      .slice(0, 24)
      .replace(/-$/g, '');

    setCode(`${prefix}-${cleaned}`);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    const payload = {
      code: code.trim().toUpperCase(),
      libelle: libelle.trim(),
      description: description.trim() || null,
      typePoint,
      actif,
    };

    if (!payload.code) {
      setError('Le code est obligatoire.');
      return;
    }

    if (!payload.libelle) {
      setError('Le libellé est obligatoire.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(payload);
      router.push('/points-structure');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de l’enregistrement.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-96px)] overflow-hidden bg-[#f5f7fb] px-5 py-6">
      <section className="mx-auto max-w-[980px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <div className="relative overflow-hidden rounded-[34px] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
          <div className="absolute -left-28 -top-28 h-64 w-64 rounded-full bg-cyan-100/70" />
          <div className="absolute -right-24 bottom-[-90px] h-72 w-72 rounded-full bg-blue-100/70" />

          <div className="relative px-8 py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b3d4f] text-white shadow-lg shadow-[#0b3d4f]/20">
              <Building2 size={28} />
            </div>

            <div className="mt-4 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                {isEdit
                  ? 'Modifier un point de structure'
                  : 'Créer un point de structure'}
              </h1>

              <p className="mt-1 text-sm font-semibold text-slate-400">
                Module équipements
              </p>
            </div>

            <div className="mt-7">
              <Stepper />
            </div>

            <div className="mx-auto mt-5 max-w-[620px]">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#0b3d4f] transition-all duration-300"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            {error && (
              <div className="mx-auto mt-6 max-w-[720px] rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mx-auto mt-7 max-w-[760px]">
              <FormBox title="Informations principales">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Code du point" required>
                    <div className="flex gap-2">
                      <input
                        value={code}
                        onChange={(e) =>
                          setCode(e.target.value.toUpperCase())
                        }
                        placeholder="GEO-ZONE-1"
                        className="h-11 flex-1 rounded-xl border border-transparent bg-[#f4f7fb] px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#0b3d4f] focus:bg-white focus:ring-4 focus:ring-[#0b3d4f]/10"
                      />

                      <button
                        type="button"
                        onClick={generateCode}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f7fb] text-slate-600 transition hover:bg-slate-200"
                        title="Générer le code"
                      >
                        <Wand2 size={18} />
                      </button>
                    </div>
                  </Field>

                  <Field label="Libellé" required>
                    <input
                      value={libelle}
                      onChange={(e) => setLibelle(e.target.value)}
                      placeholder="Zone principale"
                      className="h-11 w-full rounded-xl border border-transparent bg-[#f4f7fb] px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-[#0b3d4f] focus:bg-white focus:ring-4 focus:ring-[#0b3d4f]/10"
                    />
                  </Field>
                </div>
              </FormBox>

              <FormBox title="Type du point">
                <div className="grid gap-3 rounded-2xl bg-[#f4f7fb] p-2 md:grid-cols-2">
                  <TypeButton
                    active={typePoint === 'GEOGRAPHIQUE'}
                    icon={<MapPin size={19} />}
                    title="Géographique"
                    onClick={() => setTypePoint('GEOGRAPHIQUE')}
                  />

                  <TypeButton
                    active={typePoint === 'TECHNIQUE'}
                    icon={<GitBranch size={19} />}
                    title="Technique"
                    onClick={() => setTypePoint('TECHNIQUE')}
                  />
                </div>
              </FormBox>

              <FormBox title="État">
                <button
                  type="button"
                  onClick={() => setActif((prev) => !prev)}
                  className="flex h-12 w-full items-center justify-between rounded-2xl bg-[#f4f7fb] px-4 transition hover:bg-slate-100"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {actif ? 'Point actif' : 'Point inactif'}
                  </span>

                  <span
                    className={`relative h-7 w-14 rounded-full transition ${
                      actif ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        actif ? 'left-8' : 'left-1'
                      }`}
                    />
                  </span>
                </button>
              </FormBox>

              <FormBox title="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Ajouter une description..."
                  className="w-full resize-none rounded-2xl border border-transparent bg-[#f4f7fb] px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-[#0b3d4f] focus:bg-white focus:ring-4 focus:ring-[#0b3d4f]/10"
                />
              </FormBox>

              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="h-11 rounded-xl bg-slate-100 px-6 text-sm font-bold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0b3d4f] px-7 text-sm font-bold text-white shadow-lg shadow-[#0b3d4f]/20 transition hover:bg-[#082f3d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={17} />
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stepper() {
  return (
    <div className="mx-auto grid max-w-[600px] grid-cols-[1fr_60px_1fr_60px_1fr] items-start">
      <Step number="1" label="Informations" />
      <div className="mt-4 h-px bg-slate-200" />
      <Step number="2" label="Type" />
      <div className="mt-4 h-px bg-slate-200" />
      <Step number="3" label="Validation" />
    </div>
  );
}

function Step({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b3d4f] text-xs font-extrabold text-white">
        {number}
      </div>

      <span className="text-xs font-bold text-slate-500">{label}</span>
    </div>
  );
}

function FormBox({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 rounded-[22px] bg-white">
      <h2 className="mb-3 text-sm font-extrabold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

function TypeButton({
  active,
  icon,
  title,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 items-center justify-between rounded-xl px-4 text-sm font-extrabold transition ${
        active
          ? 'bg-white text-[#0b3d4f] shadow-sm'
          : 'text-slate-400 hover:bg-white/70 hover:text-slate-700'
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {title}
      </span>

      {active && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0b3d4f] text-white">
          <Check size={13} />
        </span>
      )}
    </button>
  );
}