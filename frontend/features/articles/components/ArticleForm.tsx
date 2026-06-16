

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Package, Save, X } from 'lucide-react';

import { Select } from '@/components/select';
import {
  AppFieldGrid,
  AppFormField,
  AppSection,
  appInputClassName,
  appPrimaryButtonClassName,
  appSecondaryButtonClassName,
  appTextareaClassName,
} from '@/components/app-section-layout';

import {
  getFamilles,
  getUnitesArticles,
} from '@/features/articles/services/article-referentiel.service';

import type {
  Article,
  CategorieArticle,
  CreateArticleDto,
  Famille,
  UniteArticle,
  UpdateArticleDto,
} from '@/features/articles/types/article';

type ArticleFormData = {
  reference: string;
  designation: string;
  description: string;

  categorie: CategorieArticle | string;
  actif: boolean;

  idFamille: string;
  idUniteArticle: string;

  fournisseurPrincipal: string;
  fabricantArticle: string;
  referenceFabricant: string;
  nbDecimales: string;
  codeBarres: string;

  centreCout: string;
  budget: string;
  codeComptable: string;
  natureAchat: string;
  taxe: string;
  prixStandard: string;
  prixMoyenPondere: string;

  gereEnStock: boolean;
  gereParLot: boolean;
  serialise: boolean;
  estModele: boolean;
  reparable: boolean;
};

type Props = {
  mode?: 'create' | 'edit';
  article?: Article | null;
  initialData?: Article | null;
  loading?: boolean;
  submitting?: boolean;
  onSubmit: (data: CreateArticleDto | UpdateArticleDto) => void | Promise<void>;
  onCancel?: () => void;
};

const CATEGORIE_OPTIONS = [
  { label: 'Pièce de rechange', value: 'PIECE_RECHANGE' },
  { label: 'Consommable', value: 'CONSOMMABLE' },
  { label: 'Fourniture', value: 'FOURNITURE' },
  { label: 'Outillage', value: 'OUTILLAGE' },
  { label: 'Équipement stocké', value: 'EQUIPEMENT_STOCKE' },
  { label: 'Service', value: 'SERVICE' },
  { label: 'Autre', value: 'AUTRE' },
];

const BOOLEAN_OPTIONS = [
  { label: 'Oui', value: 'true' },
  { label: 'Non', value: 'false' },
];

function toStringValue(value?: string | number | null) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function toNumberOrUndefined(value: string) {
  if (!value.trim()) return undefined;

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? undefined : numberValue;
}

function toTextOrUndefined(value: string) {
  const cleaned = value.trim();
  return cleaned || undefined;
}

function buildInitialForm(article?: Article | null): ArticleFormData {
  return {
    reference: article?.reference ?? '',
    designation: article?.designation ?? '',
    description: article?.description ?? '',

    categorie: article?.categorie ?? 'PIECE_RECHANGE',
    actif: article?.actif !== false && article?.etatArticle !== 'INACTIF',

    idFamille: article?.idFamille ? String(article.idFamille) : '',
    idUniteArticle: article?.idUniteArticle
      ? String(article.idUniteArticle)
      : '',

    fournisseurPrincipal: article?.fournisseurPrincipal ?? '',
    fabricantArticle: article?.fabricantArticle ?? '',
    referenceFabricant: article?.referenceFabricant ?? '',
    nbDecimales: toStringValue(article?.nbDecimales ?? 0),
    codeBarres: article?.codeBarres ?? '',

    centreCout: article?.centreCout ?? '',
    budget: article?.budget ?? '',
    codeComptable: article?.codeComptable ?? '',
    natureAchat: article?.natureAchat ?? '',
    taxe: article?.taxe ?? '',
    prixStandard: toStringValue(article?.prixStandard),
    prixMoyenPondere: toStringValue(article?.prixMoyenPondere),

    gereEnStock: article?.gereEnStock ?? true,
    gereParLot: article?.gereParLot ?? false,
    serialise: article?.serialise ?? false,
    estModele: article?.estModele ?? false,
    reparable: article?.reparable ?? false,
  };
}

function getFamilleLabel(famille: Famille) {
  if (famille.code && famille.libelle) {
    return `${famille.code} - ${famille.libelle}`;
  }

  return famille.code || famille.libelle || `Famille ${famille.idFamille}`;
}

function getUniteLabel(unite: UniteArticle) {
  if (unite.code && unite.libelle) {
    return `${unite.code} - ${unite.libelle}`;
  }

  return unite.code || unite.libelle || `Unité ${unite.idUniteArticle}`;
}

export function ArticleForm({
  mode = 'create',
  article,
  initialData,
  loading = false,
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const currentArticle = initialData ?? article ?? null;
  const isEdit = mode === 'edit';

  const [form, setForm] = useState<ArticleFormData>(() =>
    buildInitialForm(currentArticle),
  );

  const [familles, setFamilles] = useState<Famille[]>([]);
  const [unites, setUnites] = useState<UniteArticle[]>([]);
  const [referentielsLoading, setReferentielsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(buildInitialForm(currentArticle));
  }, [currentArticle]);

  useEffect(() => {
    async function loadReferentiels() {
      try {
        setReferentielsLoading(true);
        setError('');

        const [famillesData, unitesData] = await Promise.all([
          getFamilles(),
          getUnitesArticles(),
        ]);

        setFamilles(famillesData);
        setUnites(unitesData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Erreur lors du chargement des référentiels.',
        );
      } finally {
        setReferentielsLoading(false);
      }
    }

    loadReferentiels();
  }, []);

  function updateField<K extends keyof ArticleFormData>(
    key: K,
    value: ArticleFormData[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSerialiseChange(value: string) {
    const serialise = value === 'true';

    setForm((prev) => ({
      ...prev,
      serialise,
      gereEnStock: serialise ? true : prev.gereEnStock,
      gereParLot: serialise ? false : prev.gereParLot,
      estModele: serialise ? true : prev.estModele,
      categorie: serialise ? 'EQUIPEMENT_STOCKE' : prev.categorie,
    }));
  }

  function handleGereEnStockChange(value: string) {
    const nextValue = value === 'true';

    setForm((prev) => ({
      ...prev,
      gereEnStock: prev.serialise ? true : nextValue,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const reference = form.reference.trim();
    const designation = form.designation.trim();

    if (!reference) {
      setError('La référence de l’article est obligatoire.');
      return;
    }

    if (!designation) {
      setError('La désignation de l’article est obligatoire.');
      return;
    }

    setError('');

    const payload: CreateArticleDto | UpdateArticleDto = {
      reference,
      designation,
      description: toTextOrUndefined(form.description),

      etatArticle: form.actif ? 'ACTIF' : 'INACTIF',
      categorie: form.categorie as CategorieArticle,

      idFamille:
        form.idFamille && form.idFamille !== 'NONE_FAMILLE'
          ? Number(form.idFamille)
          : undefined,

      idUniteArticle:
        form.idUniteArticle && form.idUniteArticle !== 'NONE_UNITE'
          ? Number(form.idUniteArticle)
          : undefined,

      fournisseurPrincipal: toTextOrUndefined(form.fournisseurPrincipal),
      fabricantArticle: toTextOrUndefined(form.fabricantArticle),
      referenceFabricant: toTextOrUndefined(form.referenceFabricant),
      nbDecimales: toNumberOrUndefined(form.nbDecimales),
      codeBarres: toTextOrUndefined(form.codeBarres),

      centreCout: toTextOrUndefined(form.centreCout),
      budget: toTextOrUndefined(form.budget),
      codeComptable: toTextOrUndefined(form.codeComptable),
      natureAchat: toTextOrUndefined(form.natureAchat),
      taxe: toTextOrUndefined(form.taxe),
      prixStandard: toNumberOrUndefined(form.prixStandard),
      prixMoyenPondere: toNumberOrUndefined(form.prixMoyenPondere),

      gereEnStock: form.serialise ? true : form.gereEnStock,
      gereParLot: form.serialise ? false : form.gereParLot,
      serialise: form.serialise,
      estModele: form.serialise ? true : form.estModele,
      reparable: form.reparable,
      actif: form.actif,
    };

    await onSubmit(payload);
  }

  const disabled = loading || submitting || referentielsLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#06475a] to-[#0b5d73] px-6 py-5 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Package size={29} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/60">
                  {isEdit ? 'Modification article' : 'Nouvel article'}
                </p>

                <h1 className="mt-1 min-w-0 break-words text-3xl font-black tracking-tight">
                  {isEdit
                    ? currentArticle?.reference || 'Modifier l’article'
                    : 'Créer un article'}
                </h1>

                <p className="mt-2 min-w-0 break-words text-sm font-semibold text-white/75">
                  {isEdit
                    ? 'Modifiez les informations et les paramètres de stock de cet article.'
                    : 'Renseignez les informations nécessaires pour créer un article de stock.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={disabled}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-bold text-white transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={16} />
                  Annuler
                </button>
              )}

              <button
                type="submit"
                disabled={disabled}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-[#0b3d4f] shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {submitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
              {error}
            </div>
          )}

          <AppSection title="Généralités">
            <AppFieldGrid>
              <AppFormField label="Référence" required>
                <input
                  value={form.reference}
                  onChange={(event) =>
                    updateField('reference', event.target.value)
                  }
                  className={appInputClassName}
                  placeholder="Ex : 02010008"
                />
              </AppFormField>

              <AppFormField label="Désignation" required>
                <input
                  value={form.designation}
                  onChange={(event) =>
                    updateField('designation', event.target.value)
                  }
                  className={appInputClassName}
                  placeholder="Ex : Batterie 8V / 60A"
                />
              </AppFormField>

              <AppFormField label="Catégorie">
                <Select
                  value={form.categorie}
                  onValueChange={(value) =>
                    updateField('categorie', value as CategorieArticle)
                  }
                  items={CATEGORIE_OPTIONS}
                />
              </AppFormField>

              <AppFormField label="État">
                <Select
                  value={form.actif ? 'true' : 'false'}
                  onValueChange={(value) =>
                    updateField('actif', value === 'true')
                  }
                  items={[
                    { label: 'Actif', value: 'true' },
                    { label: 'Inactif', value: 'false' },
                  ]}
                />
              </AppFormField>

              <AppFormField label="Famille">
                <Select
                  value={form.idFamille || 'NONE_FAMILLE'}
                  onValueChange={(value) =>
                    updateField(
                      'idFamille',
                      value === 'NONE_FAMILLE' ? '' : value,
                    )
                  }
                  items={[
                    { label: 'Aucune famille', value: 'NONE_FAMILLE' },
                    ...familles.map((famille) => ({
                      label: getFamilleLabel(famille),
                      value: String(famille.idFamille),
                    })),
                  ]}
                />
              </AppFormField>

              <AppFormField label="Unité">
                <Select
                  value={form.idUniteArticle || 'NONE_UNITE'}
                  onValueChange={(value) =>
                    updateField(
                      'idUniteArticle',
                      value === 'NONE_UNITE' ? '' : value,
                    )
                  }
                  items={[
                    { label: 'Aucune unité', value: 'NONE_UNITE' },
                    ...unites.map((unite) => ({
                      label: getUniteLabel(unite),
                      value: String(unite.idUniteArticle),
                    })),
                  ]}
                />
              </AppFormField>
            </AppFieldGrid>
          </AppSection>

          <AppSection title="Gestion stock">
            <AppFieldGrid>
              <AppFormField label="Géré en stock">
                <Select
                  value={form.gereEnStock ? 'true' : 'false'}
                  onValueChange={handleGereEnStockChange}
                  items={BOOLEAN_OPTIONS}
                />
              </AppFormField>

              <AppFormField label="Sérialisé">
                <Select
                  value={form.serialise ? 'true' : 'false'}
                  onValueChange={handleSerialiseChange}
                  items={BOOLEAN_OPTIONS}
                />
              </AppFormField>

              <AppFormField label="Géré par lot">
                <Select
                  value={form.gereParLot ? 'true' : 'false'}
                  onValueChange={(value) =>
                    updateField('gereParLot', value === 'true')
                  }
                  items={BOOLEAN_OPTIONS}
                />
              </AppFormField>

              <AppFormField label="Réparable">
                <Select
                  value={form.reparable ? 'true' : 'false'}
                  onValueChange={(value) =>
                    updateField('reparable', value === 'true')
                  }
                  items={BOOLEAN_OPTIONS}
                />
              </AppFormField>

              <AppFormField label="Est modèle">
                <Select
                  value={form.estModele ? 'true' : 'false'}
                  onValueChange={(value) =>
                    updateField('estModele', value === 'true')
                  }
                  items={BOOLEAN_OPTIONS}
                />
              </AppFormField>

              <AppFormField label="Nombre de décimales">
                <input
                  type="number"
                  min={0}
                  value={form.nbDecimales}
                  onChange={(event) =>
                    updateField('nbDecimales', event.target.value)
                  }
                  className={appInputClassName}
                  placeholder="Ex : 0"
                />
              </AppFormField>
            </AppFieldGrid>
          </AppSection>

          <AppSection title="Fournisseur et fabricant">
            <AppFieldGrid>
              <AppFormField label="Fournisseur principal">
                <input
                  value={form.fournisseurPrincipal}
                  onChange={(event) =>
                    updateField('fournisseurPrincipal', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Fabricant">
                <input
                  value={form.fabricantArticle}
                  onChange={(event) =>
                    updateField('fabricantArticle', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Référence fabricant">
                <input
                  value={form.referenceFabricant}
                  onChange={(event) =>
                    updateField('referenceFabricant', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Code-barres">
                <input
                  value={form.codeBarres}
                  onChange={(event) =>
                    updateField('codeBarres', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>
            </AppFieldGrid>
          </AppSection>

          <AppSection title="Valorisation">
            <AppFieldGrid>
              <AppFormField label="Prix standard">
                <input
                  type="number"
                  step="0.01"
                  value={form.prixStandard}
                  onChange={(event) =>
                    updateField('prixStandard', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="PMP">
                <input
                  type="number"
                  step="0.01"
                  value={form.prixMoyenPondere}
                  onChange={(event) =>
                    updateField('prixMoyenPondere', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Taxe">
                <input
                  value={form.taxe}
                  onChange={(event) => updateField('taxe', event.target.value)}
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Nature achat">
                <input
                  value={form.natureAchat}
                  onChange={(event) =>
                    updateField('natureAchat', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>
            </AppFieldGrid>
          </AppSection>

          <AppSection title="Comptabilité">
            <AppFieldGrid>
              <AppFormField label="Centre de coût">
                <input
                  value={form.centreCout}
                  onChange={(event) =>
                    updateField('centreCout', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Budget">
                <input
                  value={form.budget}
                  onChange={(event) => updateField('budget', event.target.value)}
                  className={appInputClassName}
                />
              </AppFormField>

              <AppFormField label="Code comptable">
                <input
                  value={form.codeComptable}
                  onChange={(event) =>
                    updateField('codeComptable', event.target.value)
                  }
                  className={appInputClassName}
                />
              </AppFormField>
            </AppFieldGrid>
          </AppSection>

          <AppSection title="Description">
            <AppFormField label="Description">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                className={appTextareaClassName}
              />
            </AppFormField>
          </AppSection>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={disabled}
                className={appSecondaryButtonClassName}
              >
                <X size={16} />
                Annuler
              </button>
            )}

            <button
              type="submit"
              disabled={disabled}
              className={appPrimaryButtonClassName}
            >
              <Save size={16} />
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ArticleForm;