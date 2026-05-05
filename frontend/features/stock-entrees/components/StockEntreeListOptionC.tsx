'use client';

import {
  CalendarDays,
  Eye,
  FileText,
  Layers,
  Package,
  Warehouse,
} from 'lucide-react';

import type {
  StockEntree,
  StockEntreeLigne,
} from '../types/stock-entree';

type Props = {
  entrees: StockEntree[];
  loading: boolean;
  onView?: (id: number) => void;
};

function formatDate(date?: string | null): string {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('fr-FR');
}

function getTotalQuantite(entree: StockEntree): number {
  return (
    entree.lignes?.reduce<number>(
      (total: number, ligne: StockEntreeLigne) => {
        return total + Number(ligne.quantite ?? 0);
      },
      0,
    ) ?? 0
  );
}

function getArticlesLabel(entree: StockEntree): string {
  const articles =
    entree.lignes
      ?.map((ligne: StockEntreeLigne) => {
        const article = ligne.article;

        return (
          article?.reference ||
          article?.designation ||
          `Article #${ligne.idArticle}`
        );
      })
      .filter((value): value is string => Boolean(value)) ?? [];

  const uniqueArticles = Array.from(new Set(articles));

  if (uniqueArticles.length === 0) return '-';

  const firstArticle = uniqueArticles[0] ?? '-';

  if (uniqueArticles.length === 1) return firstArticle;

  return `${firstArticle} +${uniqueArticles.length - 1}`;
}

function getMagasinsLabel(entree: StockEntree): string {
  const magasins =
    entree.lignes
      ?.map((ligne: StockEntreeLigne) => {
        const magasin = ligne.magasin;

        if (!magasin) {
          return `Magasin #${ligne.idMagasin}`;
        }

        if (magasin.code && magasin.libelle) {
          return `${magasin.code} — ${magasin.libelle}`;
        }

        return magasin.code || magasin.libelle || `Magasin #${ligne.idMagasin}`;
      })
      .filter((value): value is string => Boolean(value)) ?? [];

  const uniqueMagasins = Array.from(new Set(magasins));

  if (uniqueMagasins.length === 0) return '-';

  const firstMagasin = uniqueMagasins[0] ?? '-';

  if (uniqueMagasins.length === 1) return firstMagasin;

  return `${firstMagasin} +${uniqueMagasins.length - 1}`;
}

function getMaterielsCount(entree: StockEntree): number {
  return (
    entree.lignes?.reduce<number>(
      (total: number, ligne: StockEntreeLigne) => {
        return total + (ligne.materiels?.length ?? 0);
      },
      0,
    ) ?? 0
  );
}

export function StockEntreeListOptionC({
  entrees,
  loading,
  onView,
}: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <FileText size={22} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Liste des bons d’entrée
          </h2>

          <p className="text-sm text-slate-500">
            {entrees.length} bon(s) d’entrée enregistré(s)
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">
          Chargement des bons d’entrée...
        </div>
      ) : entrees.length === 0 ? (
        <div className="p-8 text-slate-500">
          Aucun bon d’entrée enregistré.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {entrees.map((entree: StockEntree) => (
            <article
              key={entree.idEntreeStock}
              className="grid gap-4 px-6 py-5 transition hover:bg-slate-50 xl:grid-cols-[240px_1fr_180px_60px]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">
                    {entree.numero || `BE-${entree.idEntreeStock}`}
                  </h3>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
                    {entree.statut || 'VALIDEE'}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-400">
                  ID : {entree.idEntreeStock}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    <CalendarDays size={15} />
                    Date
                  </div>

                  <p className="font-bold text-slate-800">
                    {formatDate(entree.dateReception)}
                  </p>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    <Package size={15} />
                    Article
                  </div>

                  <p className="truncate font-bold text-slate-800">
                    {getArticlesLabel(entree)}
                  </p>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    <Warehouse size={15} />
                    Magasin
                  </div>

                  <p className="truncate font-bold text-slate-800">
                    {getMagasinsLabel(entree)}
                  </p>
                </div>

                <div>
                  <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    <Layers size={15} />
                    Lignes
                  </div>

                  <p className="font-bold text-slate-800">
                    {entree.lignes?.length ?? 0} ligne(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 xl:justify-end">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                  + {getTotalQuantite(entree)}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-700">
                  {getMaterielsCount(entree)} mat.
                </span>
              </div>

              <div className="flex items-center xl:justify-end">
                <button
                  type="button"
                  onClick={() => onView?.(entree.idEntreeStock)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-900 hover:text-white"
                  title="Voir détail"
                >
                  <Eye size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}