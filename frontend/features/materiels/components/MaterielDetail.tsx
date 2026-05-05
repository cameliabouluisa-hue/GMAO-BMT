import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  FileText,
  HardDrive,
  MapPin,
  Package,
  Pencil,
  XCircle,
} from 'lucide-react';
import { Materiel } from '../types/materiel';

type Props = {
  materiel: Materiel;
  onBack: () => void;
  onEdit: () => void;
};

function getArticleLabel(materiel: Materiel) {
  return (
    materiel.article?.reference ||
    materiel.article?.code ||
    materiel.article?.designation ||
    materiel.article?.libelle ||
    '-'
  );
}

function getModeleLabel(materiel: Materiel) {
  if (!materiel.modele) return '-';

  if (materiel.modele.code && materiel.modele.libelle) {
    return `${materiel.modele.code} - ${materiel.modele.libelle}`;
  }

  return materiel.modele.code || materiel.modele.libelle || '-';
}

function formatDate(date?: string | null) {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('fr-FR');
}

function getEmplacementLabel(materiel: Materiel) {
  const point = materiel.point_structure;

  if (!point) return 'Non affecté';

  if (point.code && point.libelle) {
    return `${point.code} - ${point.libelle}`;
  }

  return point.code || point.libelle || 'Non affecté';
}

export function MaterielDetail({ materiel, onBack, onEdit }: Props) {
  const point = materiel.point_structure;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#123d5a] px-5 py-3 font-semibold  shadow-sm transition hover:bg-[#0f3148]"
        >
          <Pencil size={18} />
          Modifier
        </button>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-50 text-sky-700">
              <HardDrive size={30} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                Fiche matériel
              </p>

              <h1 className="mt-1 text-4xl font-black text-slate-900">
                {materiel.code || 'Sans code'}
              </h1>

              <p className="mt-2 text-slate-500">
                Numéro de série : {materiel.numeroSerie || '-'}
              </p>
            </div>
          </div>

          {materiel.actif ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700">
              <CheckCircle2 size={18} />
              Actif
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-500">
              <XCircle size={18} />
              Inactif
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard
          icon={<Package size={22} />}
          title="Article lié"
          lines={[
            `Référence : ${getArticleLabel(materiel)}`,
            `Identifiant article : ${materiel.idArticle || '-'}`,
          ]}
        />

        <InfoCard
          icon={<FileText size={22} />}
          title="Modèle lié"
          lines={[
            `Modèle : ${getModeleLabel(materiel)}`,
            `Identifiant modèle : ${materiel.idModele || '-'}`,
          ]}
        />

        <InfoCard
          icon={<Calendar size={22} />}
          title="Cycle de vie"
          lines={[
            `Date mise en service : ${formatDate(
              materiel.dateMiseService,
            )}`,
            `État : ${
              materiel.etat_materiel?.libelle ||
              materiel.etat_materiel?.code ||
              '-'
            }`,
            `Type : ${
              materiel.type_materiel?.libelle ||
              materiel.type_materiel?.code ||
              '-'
            }`,
          ]}
        />

        <InfoCard
          icon={<MapPin size={22} />}
          title="Emplacement actuel"
          lines={[
            `Emplacement : ${getEmplacementLabel(materiel)}`,
            `Type point : ${point?.typePoint || '-'}`,
            `Identifiant point : ${materiel.idPointStructure || '-'}`,
          ]}
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
          {icon}
        </div>

        <h2 className="text-xl font-black text-slate-900">{title}</h2>
      </div>

      <div className="space-y-3">
        {lines.map((line, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-600"
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}