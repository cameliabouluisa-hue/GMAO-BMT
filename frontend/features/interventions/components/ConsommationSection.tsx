'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

import {
  AppSection,
  appInputClassName,
  appPrimaryButtonClassName,
  appSecondaryButtonClassName,
  appSelectClassName,
} from '@/components/app-section-layout';

import {
  getApiErrorMessage,
  getInterventionReferenceData,
} from '../services/intervention.service';
import type {
  ConsommationIntervention,
  CreateConsommationInterventionDto,
  InterventionReferenceData,
} from '../types/intervention.types';
import { Badge, formatDateTime, formatNumber } from './InterventionTable';

type Props = {
  interventionEtat?: string | null;
  consommations?: ConsommationIntervention[];
  loading?: boolean;
  onCreate: (data: CreateConsommationInterventionDto) => void;
  onCancel: (idConsommation: number) => void;
};

const emptyReferences: InterventionReferenceData = {
  materiels: [],
  pointsStructure: [],
  demandes: [],
  plansPreventifs: [],
  declencheurs: [],
  gammes: [],
  equipes: [],
  techniciens: [],
  articles: [],
  magasins: [],
};

export function ConsommationSection({
  interventionEtat,
  consommations = [],
  loading = false,
  onCreate,
  onCancel,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [idArticle, setIdArticle] = useState('');
  const [idMagasin, setIdMagasin] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [references, setReferences] =
    useState<InterventionReferenceData>(emptyReferences);
  const [referenceError, setReferenceError] = useState('');

  const canAdd = interventionEtat === 'EN_COURS';
  const articles = useMemo(
    () =>
      references.articles.filter(
        (article) => article.actif !== false && article.gereEnStock !== false,
      ),
    [references.articles],
  );
  const magasins = useMemo(
    () => references.magasins.filter((magasin) => magasin.actif !== false),
    [references.magasins],
  );

  useEffect(() => {
    let mounted = true;

    getInterventionReferenceData()
      .then((data) => {
        if (mounted) {
          setReferences(data);
          setReferenceError('');
        }
      })
      .catch((error) => {
        if (mounted) {
          setReferenceError(
            getApiErrorMessage(
              error,
              'Impossible de charger les articles ou magasins.',
            ),
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreate({
      idArticle: Number(idArticle),
      idMagasin: Number(idMagasin),
      quantite: Number(quantite),
      prixUnitaire: parseOptionalNumber(prixUnitaire),
      commentaire: commentaire || undefined,
      createdBy: 'Admin',
    });

    setShowForm(false);
    setIdArticle('');
    setIdMagasin('');
    setQuantite('');
    setPrixUnitaire('');
    setCommentaire('');
  }

  return (
    <AppSection title="Consommations stock">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-bold text-slate-500">
          La consommation est autorisee seulement lorsque l&apos;intervention est EN_COURS.
        </p>
        <button
          type="button"
          disabled={!canAdd || loading}
          onClick={() => setShowForm((current) => !current)}
          className={appSecondaryButtonClassName}
        >
          <Plus size={17} />
          Ajouter consommation
        </button>
      </div>

      {referenceError && (
        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {referenceError}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="mb-5 grid min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_130px_130px_auto]"
        >
          <select
            value={idArticle}
            onChange={(event) => setIdArticle(event.target.value)}
            className={`${appSelectClassName} min-w-0 truncate`}
            required
          >
            <option value="">Selectionner un article</option>
            {articles.map((article) => (
              <option key={article.idArticle} value={article.idArticle}>
                {formatArticle(article)}
              </option>
            ))}
          </select>
          <select
            value={idMagasin}
            onChange={(event) => setIdMagasin(event.target.value)}
            className={`${appSelectClassName} min-w-0 truncate`}
            required
          >
            <option value="">Selectionner un magasin</option>
            {magasins.map((magasin) => (
              <option key={magasin.idMagasin} value={magasin.idMagasin}>
                {formatCodeLibelle(magasin.code, magasin.libelle, magasin.idMagasin)}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={quantite}
            onChange={(event) => setQuantite(event.target.value)}
            className={appInputClassName}
            placeholder="Quantite"
            required
          />
          <input
            type="number"
            step="0.01"
            value={prixUnitaire}
            onChange={(event) => setPrixUnitaire(event.target.value)}
            className={appInputClassName}
            placeholder="Prix unitaire"
          />
          <button
            type="submit"
            disabled={loading}
            className={appPrimaryButtonClassName}
          >
            Consommer
          </button>
          <input
            value={commentaire}
            onChange={(event) => setCommentaire(event.target.value)}
            className={`${appInputClassName} min-w-0 md:col-span-2 xl:col-span-5`}
            placeholder="Commentaire"
          />
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Article</th>
              <th className="py-3 pr-4">Magasin</th>
              <th className="py-3 pr-4">Quantite</th>
              <th className="py-3 pr-4">Cout</th>
              <th className="py-3 pr-4">Statut</th>
              <th className="py-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {consommations.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm font-bold text-slate-500"
                >
                  Aucune consommation enregistree.
                </td>
              </tr>
            ) : (
              consommations.map((consommation) => (
                <tr key={consommation.idConsommation} className="text-sm">
                  <td className="py-3 pr-4 font-bold text-slate-700">
                    {formatDateTime(consommation.createdAt)}
                  </td>
                  <td className="py-3 pr-4 font-black text-slate-950">
                    {consommation.article?.reference ||
                      consommation.article?.designation ||
                      consommation.idArticle}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-600">
                    {consommation.magasin?.code ||
                      consommation.magasin?.libelle ||
                      consommation.idMagasin ||
                      '-'}
                  </td>
                  <td className="py-3 pr-4 font-bold text-slate-700">
                    {formatNumber(consommation.quantite)}
                  </td>
                  <td className="py-3 pr-4 font-bold text-slate-700">
                    {formatNumber(consommation.coutTotal)}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      tone={
                        consommation.statut === 'ANNULEE'
                          ? 'danger'
                          : 'success'
                      }
                    >
                      {consommation.statut || 'ACTIVE'}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      type="button"
                      disabled={
                        loading ||
                        consommation.statut === 'ANNULEE'
                      }
                      onClick={() => onCancel(consommation.idConsommation)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                      title="Annuler et restaurer le stock"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppSection>
  );
}

function formatArticle(article: {
  idArticle: number;
  reference?: string | null;
  designation?: string | null;
  libelle?: string | null;
}) {
  return (
    [article.reference, article.designation || article.libelle]
      .filter(Boolean)
      .join(' - ') || `Article #${article.idArticle}`
  );
}

function formatCodeLibelle(
  code?: string | null,
  libelle?: string | null,
  id?: number | null,
) {
  return [code, libelle].filter(Boolean).join(' - ') || `#${id ?? ''}`;
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
