'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Archive,
  Boxes,
  Clock3,
  Download,
  History,
  PackagePlus,
  RefreshCw,
  Search,
  ShoppingCart,
} from 'lucide-react';

import {
  getMouvementsStock,
  getStockActuel,
} from '@/features/stock-entrees/services/stock.service';

import type {
  MouvementStock,
  StockArticleMagasin,
} from '@/features/stock-entrees/types/stock';

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function getArticleLabel(stock: StockArticleMagasin) {
  const reference = stock.article?.reference;
  const designation = stock.article?.designation;

  if (reference && designation) return `${reference} — ${designation}`;
  if (reference) return reference;
  if (designation) return designation;

  return `Article #${stock.idArticle}`;
}

function getMagasinLabel(stock: StockArticleMagasin) {
  const code = stock.magasin?.code;
  const libelle = stock.magasin?.libelle;

  if (code && libelle) return `${code} — ${libelle}`;
  if (code) return code;
  if (libelle) return libelle;

  return `Magasin #${stock.idMagasin}`;
}

export default function StockPage() {
  const router = useRouter();

  const [stocks, setStocks] = useState<StockArticleMagasin[]>([]);
  const [mouvements, setMouvements] = useState<MouvementStock[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      setLoading(true);
      setError('');

      const [stockResult, mouvementsResult] = await Promise.all([
        getStockActuel(),
        getMouvementsStock(),
      ]);

      setStocks(stockResult);
      setMouvements(mouvementsResult);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement du stock.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredStocks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return stocks;

    return stocks.filter((stock) => {
      const article = getArticleLabel(stock).toLowerCase();
      const magasin = getMagasinLabel(stock).toLowerCase();

      return article.includes(value) || magasin.includes(value);
    });
  }, [stocks, search]);

  const totalArticles = useMemo(() => {
    return new Set(stocks.map((stock) => stock.idArticle)).size;
  }, [stocks]);

  const totalQuantite = useMemo(() => {
    return stocks.reduce(
      (total, stock) => total + toNumber(stock.quantitePhysique),
      0,
    );
  }, [stocks]);

  const totalMagasins = useMemo(() => {
    return new Set(stocks.map((stock) => stock.idMagasin)).size;
  }, [stocks]);

  const totalMouvements = mouvements.length;

  const menuItems = [
    {
      title: 'Entrées stock',
      description: 'Consulter les bons d’entrée stock.',
      icon: Download,
      href: '/stock/entrees',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    {
      title: 'Nouvelle entrée',
      description: 'Réceptionner des articles en magasin.',
      icon: PackagePlus,
      href: '/stock/entrees/nouvelle',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    {
      title: 'Mouvements',
      description: 'Voir l’historique des mouvements stock.',
      icon: History,
      href: '/stock/mouvements',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
    },
    {
      title: 'Sorties stock',
      description: 'Préparer les sorties du magasin.',
      icon: Archive,
      href: '/stock/sorties/nouvelle',
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
  ];

  const cards = [
    {
      label: 'Articles',
      value: totalArticles,
      icon: Boxes,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    {
      label: 'Quantité',
      value: totalQuantite,
      icon: Archive,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
    },
    {
      label: 'Magasins',
      value: totalMagasins,
      icon: ShoppingCart,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
    },
    {
      label: 'Mouvements',
      value: totalMouvements,
      icon: Clock3,
      bg: 'bg-violet-50',
      text: 'text-violet-700',
    },
  ];

  return (
    <div className="min-w-0 bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Module stock
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Stock actuel
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Consultez les quantités disponibles par article et par magasin.
                </p>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-3 xl:w-auto xl:min-w-[460px]">
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCw
                    size={18}
                    className={loading ? 'animate-spin' : ''}
                  />
                  Actualiser
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/stock/mouvements')}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <History size={18} />
                  Mouvements
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/stock/entrees/nouvelle')}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0f3d56] px-4 text-sm font-semibold text-white transition hover:bg-[#0c3248]"
                >
                  <PackagePlus size={18} />
                  Nouvelle entrée
                </button>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Stat cards */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.text}`}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Quick menu */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Accès rapide
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Menu du module stock
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => router.push(item.href)}
                    className="group flex min-h-[180px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  >
                    <div
                      className={`flex h-11 w-full items-center justify-center rounded-xl ${item.bg} ${item.text}`}
                    >
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-5 text-xl font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Table section */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Boxes size={22} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Quantités par magasin
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filteredStocks.length} ligne(s) de stock affichée(s)
                  </p>
                </div>
              </div>

              <div className="relative w-full lg:max-w-md">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher article ou magasin..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0f3d56] focus:bg-white focus:ring-4 focus:ring-[#0f3d56]/10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Article
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Magasin
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Quantité
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Réservée
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                      Disponible
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm font-medium text-slate-500"
                      >
                        Chargement du stock...
                      </td>
                    </tr>
                  ) : filteredStocks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm font-medium text-slate-500"
                      >
                        Aucun stock trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredStocks.map((stock) => (
                      <tr
                        key={stock.idStock}
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 align-middle">
                          <p className="text-sm font-semibold text-slate-900">
                            {getArticleLabel(stock)}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID article : {stock.idArticle}
                          </p>
                        </td>

                        <td className="px-6 py-4 align-middle">
                          <p className="text-sm font-medium text-slate-700">
                            {getMagasinLabel(stock)}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            ID magasin : {stock.idMagasin}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-center align-middle">
                          <span className="inline-flex min-w-[44px] items-center justify-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                            {toNumber(stock.quantitePhysique)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center align-middle">
                          <span className="inline-flex min-w-[44px] items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                            {toNumber(stock.quantiteReservee)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center align-middle">
                          <span className="inline-flex min-w-[44px] items-center justify-center rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                            {toNumber(stock.quantiteDisponible)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}