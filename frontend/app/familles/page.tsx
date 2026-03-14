'use client';

import { useEffect, useMemo, useState } from 'react';

type Modele = {
  idModele: number;
  code: string | null;
  libelle: string | null;
  idFamille: number | null;
};

type FamilleApi = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
  parent_id: number | null;
  modele?: Modele[];
};

type FamilleNode = FamilleApi & {
  children: FamilleNode[];
};

function buildFamilleTree(familles: FamilleApi[]): FamilleNode[] {
  const map = new Map<number, FamilleNode>();

  for (const famille of familles) {
    map.set(famille.idFamille, {
      ...famille,
      children: [],
    });
  }

  const roots: FamilleNode[] = [];

  for (const famille of familles) {
    const node = map.get(famille.idFamille)!;

    if (famille.parent_id && map.has(famille.parent_id)) {
      map.get(famille.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function countAllChildren(node: FamilleNode): number {
  let total = node.children.length;

  for (const child of node.children) {
    total += countAllChildren(child);
  }

  return total;
}

function countAllModeles(node: FamilleNode): number {
  let total = node.modele?.length || 0;

  for (const child of node.children) {
    total += countAllModeles(child);
  }

  return total;
}

function FamilleCard({
  node,
  level = 0,
  famillesMap,
}: {
  node: FamilleNode;
  level?: number;
  famillesMap: Map<number, FamilleApi>;
}) {
  const [open, setOpen] = useState(true);

  const parentFamille =
    node.parent_id && famillesMap.has(node.parent_id)
      ? famillesMap.get(node.parent_id)
      : null;

  const totalSousFamilles = countAllChildren(node);
  const totalModeles = countAllModeles(node);

  return (
    <div className="relative">
      {level > 0 && (
        <div
          className="absolute left-4 top-0 h-full border-l-2 border-dashed"
          style={{ borderColor: '#81C3D7' }}
        />
      )}

      <div
        className="relative rounded-[28px] border p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          marginLeft: `${level * 28}px`,
          backgroundColor: '#FFFFFF',
          borderColor: '#D9DCD6',
        }}
      >
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-xl font-semibold transition hover:scale-105"
              style={{
                backgroundColor: open ? '#16425B' : '#2F6690',
                borderColor: '#16425B',
                color: '#FFFFFF',
              }}
            >
              {open ? '−' : '+'}
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: '#16425B' }}
                >
                  {node.libelle || 'Famille sans libellé'}
                </h2>

                <span
                  className="rounded-full px-4 py-1 text-sm font-semibold"
                  style={{
                    backgroundColor: '#D9DCD6',
                    color: '#16425B',
                  }}
                >
                  {node.code || 'Sans code'}
                </span>
              </div>

              <p className="mt-2 text-sm" style={{ color: '#3A7CA5' }}>
                Structure hiérarchique des familles du module équipement BMT.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: '#E9F6FA',
                color: '#16425B',
              }}
            >
              Niveau {level + 1}
            </span>

            <span
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: '#D6ECF5',
                color: '#16425B',
              }}
            >
              {totalSousFamilles} sous-famille{totalSousFamilles > 1 ? 's' : ''}
            </span>

            <span
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: '#DCEFF6',
                color: '#16425B',
              }}
            >
              {totalModeles} modèle{totalModeles > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div
          className="grid gap-3 rounded-[22px] border p-4 md:grid-cols-2 xl:grid-cols-4"
          style={{
            backgroundColor: '#F8FBFC',
            borderColor: '#D9DCD6',
          }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
              Code famille
            </p>
            <p className="mt-1 text-base font-semibold" style={{ color: '#16425B' }}>
              {node.code || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
              Libellé
            </p>
            <p className="mt-1 text-base font-semibold" style={{ color: '#16425B' }}>
              {node.libelle || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
              Parent famille
            </p>
            <p className="mt-1 text-base font-semibold" style={{ color: '#16425B' }}>
              {parentFamille?.libelle || 'Aucune (racine)'}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#3A7CA5' }}>
              Modèles directs
            </p>
            <p className="mt-1 text-base font-semibold" style={{ color: '#16425B' }}>
              {node.modele?.length || 0}
            </p>
          </div>
        </div>

        {open && (
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <section
              className="rounded-[24px] border p-5"
              style={{
                backgroundColor: '#F7FAFB',
                borderColor: '#D9DCD6',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: '#16425B' }}>
                  Modèles liés
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: '#81C3D7',
                    color: '#16425B',
                  }}
                >
                  {node.modele?.length || 0}
                </span>
              </div>

              {node.modele && node.modele.length > 0 ? (
                <div className="space-y-3">
                  {node.modele.map((modele) => (
                    <div
                      key={modele.idModele}
                      className="rounded-[20px] border p-4 transition hover:shadow-sm"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D9DCD6',
                      }}
                    >
                      <p className="text-base font-semibold" style={{ color: '#16425B' }}>
                        {modele.libelle || 'Modèle sans libellé'}
                      </p>
                      <p className="mt-1 text-sm" style={{ color: '#3A7CA5' }}>
                        Code : {modele.code || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[20px] border border-dashed p-4 text-sm"
                  style={{
                    borderColor: '#81C3D7',
                    color: '#3A7CA5',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  Aucun modèle lié à cette famille.
                </div>
              )}
            </section>

            <section
              className="rounded-[24px] border p-5"
              style={{
                backgroundColor: '#F7FAFB',
                borderColor: '#D9DCD6',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: '#16425B' }}>
                  Sous-familles
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: '#81C3D7',
                    color: '#16425B',
                  }}
                >
                  {node.children.length}
                </span>
              </div>

              {node.children.length > 0 ? (
                <div className="space-y-4">
                  {node.children.map((child) => (
                    <FamilleCard
                      key={child.idFamille}
                      node={child}
                      level={level + 1}
                      famillesMap={famillesMap}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-[20px] border border-dashed p-4 text-sm"
                  style={{
                    borderColor: '#81C3D7',
                    color: '#3A7CA5',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  Aucune sous-famille.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FamillesPage() {
  const [familles, setFamilles] = useState<FamilleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchFamilles() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('http://localhost:3001/familles');
        if (!response.ok) {
          throw new Error('Impossible de charger les familles.');
        }

        const data = await response.json();
        setFamilles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    fetchFamilles();
  }, []);

  const filteredFamilles = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return familles;

    return familles.filter((famille) => {
      const code = famille.code?.toLowerCase() || '';
      const libelle = famille.libelle?.toLowerCase() || '';
      const modeles = famille.modele || [];

      return (
        code.includes(term) ||
        libelle.includes(term) ||
        modeles.some((m) =>
          `${m.code || ''} ${m.libelle || ''}`.toLowerCase().includes(term),
        )
      );
    });
  }, [familles, search]);

  const famillesMap = useMemo(() => {
    const map = new Map<number, FamilleApi>();
    for (const famille of filteredFamilles) {
      map.set(famille.idFamille, famille);
    }
    return map;
  }, [filteredFamilles]);

  const tree = useMemo(() => buildFamilleTree(filteredFamilles), [filteredFamilles]);

  const totalFamilles = filteredFamilles.length;
  const totalModeles = filteredFamilles.reduce(
    (sum, famille) => sum + (famille.modele?.length || 0),
    0,
  );

  return (
    <main
      className="min-h-screen p-6"
      style={{
        background:
          'linear-gradient(180deg, #EEF5F8 0%, #D9DCD6 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <section
  className="mb-6 rounded-[32px] border px-8 py-7 shadow-sm"
          style={{
            background: 'linear-gradient(135deg, #16425B 0%, #2F6690 55%, #3A7CA5 100%)',
            borderColor: '#2F6690',
          }}
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p
                className="mb-2 text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ color: '#81C3D7' }}
              >
                BMT · Module Équipement
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white xl:text-4xl">
                Arborescence des familles
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 xl:text-base" style={{ color: '#D9DCD6' }}>
                Visualisation hiérarchique des familles, sous-familles et modèles
                du parc équipement du port BMT.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className="rounded-[24px] px-5 py-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <p className="text-xs uppercase tracking-wide" style={{ color: '#D9DCD6' }}>
                  Familles affichées
                </p>
                <p className="mt-1 text-2xl font-bold text-white">{totalFamilles}</p>
              </div>

              <div
                className="rounded-[24px] px-5 py-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <p className="text-xs uppercase tracking-wide" style={{ color: '#D9DCD6' }}>
                  Modèles visibles
                </p>
                <p className="mt-1 text-2xl font-bold text-white">{totalModeles}</p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mb-6 rounded-[28px] border p-5 shadow-sm"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#D9DCD6',
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#16425B' }}>
                Recherche dans l’arborescence
              </h2>
              <p className="mt-1 text-sm" style={{ color: '#3A7CA5' }}>
                Recherche par code famille, libellé ou modèle.
              </p>
            </div>

           <div className="flex w-full flex-col gap-3 lg:max-w-2xl lg:flex-row">
  <input
    type="text"
    placeholder="Ex. pompe, FAM001, centrifuge..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full rounded-2xl border px-4 py-3 outline-none transition"
    style={{
      borderColor: '#81C3D7',
      color: '#16425B',
      backgroundColor: '#F8FBFC',
    }}
  />

  <button
    type="button"
    className="rounded-2xl px-5 py-3 text-sm font-semibold transition hover:opacity-90"
    style={{
      backgroundColor: '#2F6690',
      color: '#FFFFFF',
    }}
  >
    + Ajouter une famille
  </button>
</div>
          </div>
        </section>

        {loading && (
          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#D9DCD6',
              color: '#16425B',
            }}
          >
            Chargement des familles...
          </div>
        )}

        {error && (
          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              backgroundColor: '#FFF4F4',
              borderColor: '#E8B4B4',
              color: '#8A1F1F',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && tree.length === 0 && (
          <div
            className="rounded-[28px] border p-6 shadow-sm"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#D9DCD6',
              color: '#16425B',
            }}
          >
            Aucune famille trouvée.
          </div>
        )}

        {!loading && !error && tree.length > 0 && (
          <div className="space-y-5">
            {tree.map((node) => (
              <FamilleCard
                key={node.idFamille}
                node={node}
                famillesMap={famillesMap}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}