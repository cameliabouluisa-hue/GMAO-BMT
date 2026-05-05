

import { useEffect, useState } from 'react';
import { Boxes, Save, X } from 'lucide-react';
import {
  Article,
  CreateArticleDto,
  Famille,
  Modele,
  UniteArticle,
} from '../types/article';
import {
  getFamilles,
  getModeles,
  getUnitesArticles,
} from '../services/article-referentiel.service';

type Props = {
  initialData?: Article;
  onSubmit: (data: CreateArticleDto) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

export function ArticleForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}: Props) {
  const [reference, setReference] = useState(initialData?.reference ?? '');
  const [designation, setDesignation] = useState(initialData?.designation ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [prixUnitaire, setPrixUnitaire] = useState(
    initialData?.prixUnitaire ? String(initialData.prixUnitaire) : '',
  );

  const [idFamille, setIdFamille] = useState(initialData?.idFamille ?? '');
  const [idUniteArticle, setIdUniteArticle] = useState(
    initialData?.idUniteArticle ?? '',
  );
  const [idModele, setIdModele] = useState(initialData?.idModele ?? '');

  const [gereEnStock, setGereEnStock] = useState(
    initialData?.gereEnStock ?? true,
  );
  const [serialise, setSerialise] = useState(initialData?.serialise ?? false);
  const [reparable, setReparable] = useState(initialData?.reparable ?? false);
  const [actif, setActif] = useState(initialData?.actif ?? true);

  const [familles, setFamilles] = useState<Famille[]>([]);
  const [unites, setUnites] = useState<UniteArticle[]>([]);
  const [modeles, setModeles] = useState<Modele[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRefs() {
      try {
        const [famillesData, unitesData, modelesData] = await Promise.all([
          getFamilles(),
          getUnitesArticles(),
          getModeles(),
        ]);

        setFamilles(famillesData);
        setUnites(unitesData);
        setModeles(modelesData);
      } catch {
        setError('Erreur lors du chargement des référentiels.');
      } finally {
        setLoadingRefs(false);
      }
    }

    loadRefs();
  }, []);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!reference.trim() || !designation.trim()) {
      setError('Veuillez remplir la référence et la désignation.');
      return;
    }

    if (serialise && !gereEnStock) {
      setError('Un article sérialisé doit être géré en stock.');
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        reference: reference.trim(),
        designation: designation.trim(),
        description: description.trim() || undefined,
        prixUnitaire: prixUnitaire ? Number(prixUnitaire) : undefined,
        idFamille: idFamille ? Number(idFamille) : undefined,
        idUniteArticle: idUniteArticle ? Number(idUniteArticle) : undefined,
        idModele: idModele ? Number(idModele) : undefined,
        gereEnStock,
        serialise,
        reparable,
        actif,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-slate-50/70 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-[#0f3d56]">
            <Boxes size={26} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
              Module stock
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Informations de l’article
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Définissez la fiche article, son unité, sa famille et son modèle.
            </p>
          </div>
        </div>
      </div>

      {loadingRefs ? (
        <div className="p-8 text-slate-500">Chargement des référentiels...</div>
      ) : (
        <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Référence *
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex : GE-001"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Désignation *
            </label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Ex : Groupe électrogène MR"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Famille
            </label>
            <select
              value={idFamille}
              onChange={(e) => setIdFamille(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">Aucune</option>
              {familles.map((famille) => (
                <option key={famille.idFamille} value={famille.idFamille}>
                  {famille.code} - {famille.libelle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Unité article
            </label>
            <select
              value={idUniteArticle}
              onChange={(e) => setIdUniteArticle(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">Aucune</option>
              {unites.map((unite) => (
                <option
                  key={unite.idUniteArticle}
                  value={unite.idUniteArticle}
                >
                  {unite.code} - {unite.libelle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Modèle associé
            </label>
            <select
              value={idModele}
              onChange={(e) => setIdModele(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">Aucun</option>
              {modeles.map((modele) => (
                <option key={modele.idModele} value={modele.idModele}>
                  {modele.code} - {modele.libelle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Prix unitaire
            </label>
            <input
              type="number"
              value={prixUnitaire}
              onChange={(e) => setPrixUnitaire(e.target.value)}
              placeholder="Ex : 250000"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Description
            </label>
            <textarea
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l’article..."
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="grid gap-4 md:col-span-2 md:grid-cols-4">
            {[
              ['Géré en stock', gereEnStock, setGereEnStock],
              ['Sérialisé', serialise, setSerialise],
              ['Réparable', reparable, setReparable],
              ['Actif', actif, setActif],
            ].map(([label, value, setter]) => (
              <label
                key={label as string}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <span className="font-semibold text-slate-700">
                  {label as string}
                </span>
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) =>
                    (setter as React.Dispatch<React.SetStateAction<boolean>>)(
                      e.target.checked,
                    )
                  }
                  className="h-5 w-5 accent-[#0f3d56]"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mx-8 mb-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-8 py-5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <X size={18} />
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading || loadingRefs}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0f3d56] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0b3044] disabled:opacity-60"
        >
          <Save size={18} />
          {loading ? 'Enregistrement...' : submitLabel}
        </button>
      </div>
    </form>
  );
}