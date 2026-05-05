'use client';

import { useEffect, useState } from 'react';
import { Calendar, HardDrive, Save, X } from 'lucide-react';

import {
  Article,
  CreateMaterielDto,
  EtatMateriel,
  Materiel,
  Modele,
  PointStructure,
  TypeMateriel,
} from '../types/materiel';

import {
  getArticles,
  getEtatsMateriel,
  getModeles,
  getPointsStructure,
  getTypesMateriel,
} from '../services/materiel-referentiel.service';

type Props = {
  initialData?: Materiel;
  onSubmit: (data: CreateMaterielDto) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
};

function formatDateForInput(date?: string | null) {
  if (!date) return '';
  return date.slice(0, 10);
}

function toNumberOrNull(value: string): number | null {
  if (!value) return null;

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return null;
  }

  return numericValue;
}

export function MaterielForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);
  const [etats, setEtats] = useState<EtatMateriel[]>([]);
  const [types, setTypes] = useState<TypeMateriel[]>([]);
  const [pointsStructure, setPointsStructure] = useState<PointStructure[]>([]);

  const [loadingReferentiel, setLoadingReferentiel] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateMaterielDto>({
    code: initialData?.code ?? '',
    numeroSerie: initialData?.numeroSerie ?? '',
    dateMiseService: formatDateForInput(initialData?.dateMiseService),

    idArticle: initialData?.idArticle ?? null,
    idModele: initialData?.idModele ?? null,
    idEtat: initialData?.idEtat ?? null,
    idType: initialData?.idType ?? null,
    idPointStructure: initialData?.idPointStructure ?? null,

    actif: initialData?.actif ?? true,
  });

  useEffect(() => {
    async function loadReferentiels() {
      try {
        setLoadingReferentiel(true);

        const [
          articlesData,
          modelesData,
          etatsData,
          typesData,
          pointsStructureData,
        ] = await Promise.all([
          getArticles(),
          getModeles(),
          getEtatsMateriel(),
          getTypesMateriel(),
          getPointsStructure(),
        ]);

        setArticles(articlesData);
        setModeles(modelesData);
        setEtats(etatsData);
        setTypes(typesData);
        setPointsStructure(pointsStructureData);
      } catch (error) {
        console.error(error);
        setError('Erreur lors du chargement des listes.');
      } finally {
        setLoadingReferentiel(false);
      }
    }

    loadReferentiels();
  }, []);

  function handleChange<K extends keyof CreateMaterielDto>(
    key: K,
    value: CreateMaterielDto[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.code || !form.code.trim()) {
      setError('Le code du matériel est obligatoire.');
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        code: form.code.trim(),
        numeroSerie: form.numeroSerie?.trim() || null,
        dateMiseService: form.dateMiseService || null,

        idArticle: form.idArticle ?? null,
        idModele: form.idModele ?? null,
        idEtat: form.idEtat ?? null,
        idType: form.idType ?? null,
        idPointStructure: form.idPointStructure ?? null,

        actif: form.actif ?? true,
      });
    } catch (error) {
      console.error(error);
      setError("Erreur lors de l'enregistrement du matériel.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
    >
      <div className="p-6 lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <HardDrive size={30} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
                Fiche matériel
              </p>

              <h2 className="mt-1 text-3xl font-black text-slate-900">
                {initialData ? 'Modifier le matériel' : 'Créer un matériel'}
              </h2>

              <p className="mt-1 text-slate-500">
                Renseignez les informations du matériel, son modèle, son article
                et son emplacement.
              </p>
            </div>
          </div>
        </div>

        {loadingReferentiel && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 font-medium text-blue-700">
            Chargement des listes...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Code matériel <span className="text-red-500">*</span>
            </label>

            <input
              value={form.code ?? ''}
              onChange={(event) => handleChange('code', event.target.value)}
              placeholder="Exemple : MAT-001"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Numéro de série
            </label>

            <input
              value={form.numeroSerie ?? ''}
              onChange={(event) =>
                handleChange('numeroSerie', event.target.value)
              }
              placeholder="Exemple : SN-GE-001"
              className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Date de mise en service
            </label>

            <div className="relative">
              <input
                type="date"
                value={form.dateMiseService ?? ''}
                onChange={(event) =>
                  handleChange('dateMiseService', event.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

              <Calendar
                size={19}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Article lié
            </label>

            <select
              value={form.idArticle ?? ''}
              onChange={(event) =>
                handleChange('idArticle', toNumberOrNull(event.target.value))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Aucun article</option>

              {articles.map((article) => (
                <option key={article.idArticle} value={article.idArticle}>
                  {article.reference ||
                    article.code ||
                    article.designation ||
                    article.libelle ||
                    `Article ${article.idArticle}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Modèle lié
            </label>

            <select
              value={form.idModele ?? ''}
              onChange={(event) =>
                handleChange('idModele', toNumberOrNull(event.target.value))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Aucun modèle</option>

              {modeles.map((modele) => (
                <option key={modele.idModele} value={modele.idModele}>
                  {modele.code || `MOD-${modele.idModele}`}
                  {modele.libelle ? ` - ${modele.libelle}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              État du matériel
            </label>

            <select
              value={form.idEtat ?? ''}
              onChange={(event) =>
                handleChange('idEtat', toNumberOrNull(event.target.value))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Aucun état</option>

              {etats.map((etat) => (
                <option key={etat.idEtat} value={etat.idEtat}>
                  {etat.code ? `${etat.code} - ` : ''}
                  {etat.libelle || `État ${etat.idEtat}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Type de matériel
            </label>

            <select
              value={form.idType ?? ''}
              onChange={(event) =>
                handleChange('idType', toNumberOrNull(event.target.value))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Aucun type</option>

              {types.map((type) => (
                <option key={type.idType} value={type.idType}>
                  {type.code ? `${type.code} - ` : ''}
                  {type.libelle || `Type ${type.idType}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Emplacement / Point de structure
            </label>

            <select
              value={form.idPointStructure ?? ''}
              onChange={(event) =>
                handleChange(
                  'idPointStructure',
                  toNumberOrNull(event.target.value),
                )
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Aucun emplacement</option>

              {pointsStructure.map((point) => (
                <option key={point.idPoint} value={point.idPoint}>
                  {point.code || `POINT-${point.idPoint}`} -{' '}
                  {point.libelle || 'Sans libellé'} ({point.typePoint || '-'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={form.actif ?? true}
            onChange={(event) => handleChange('actif', event.target.checked)}
            className="h-5 w-5 accent-pink-600"
          />

          Matériel actif
        </label>
      </div>

      <div className="sticky bottom-0 z-20 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white/95 p-5 backdrop-blur sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <X size={20} />
          Annuler
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#123d5a] px-6 py-4 font-bold  shadow-sm transition hover:bg-[#0f3148] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={20} />
          {isSubmitting ? 'Enregistrement...' : submitLabel}
        </button>
      </div>
    </form>
  );
}