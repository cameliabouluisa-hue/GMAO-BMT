'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  Download,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

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

function flattenTree(
  nodes: FamilleNode[],
  level = 0,
): Array<{ node: FamilleNode; level: number }> {
  const result: Array<{ node: FamilleNode; level: number }> = [];

  for (const node of nodes) {
    result.push({ node, level });

    if (node.children.length > 0) {
      result.push(...flattenTree(node.children, level + 1));
    }
  }

  return result;
}

export default function FamillesPage() {
  const router = useRouter();
  
  const [familles, setFamilles] = useState<FamilleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showModeles, setShowModeles] = useState<Record<number, boolean>>({});
  const [filterType, setFilterType] = useState<'all' | 'parents' | 'withModels'>(
    'all',
  );

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

        const initialExpandedState: Record<number, boolean> = {};
        const initialModelesState: Record<number, boolean> = {};

        for (const item of data) {
          initialExpandedState[item.idFamille] = true;
          initialModelesState[item.idFamille] = true;
        }

        setExpanded(initialExpandedState);
        setShowModeles(initialModelesState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    fetchFamilles();
  }, []);

  const famillesMap = useMemo(() => {
    const map = new Map<number, FamilleApi>();

    for (const famille of familles) {
      map.set(famille.idFamille, famille);
    }

    return map;
  }, [familles]);

  const filteredFamilles = useMemo(() => {
    const term = search.toLowerCase().trim();

    return familles.filter((famille) => {
      const parent = famille.parent_id ? famillesMap.get(famille.parent_id) : null;

      const matchesSearch =
        !term ||
        (famille.code || '').toLowerCase().includes(term) ||
        (famille.libelle || '').toLowerCase().includes(term) ||
        (parent?.libelle || '').toLowerCase().includes(term) ||
        (famille.modele || []).some(
          (m) =>
            (m.libelle || '').toLowerCase().includes(term) ||
            (m.code || '').toLowerCase().includes(term),
        );

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'parents' && famille.parent_id === null) ||
        (filterType === 'withModels' && (famille.modele?.length || 0) > 0);

      return matchesSearch && matchesFilter;
    });
  }, [familles, famillesMap, search, filterType]);

  const filteredIds = useMemo(
    () => new Set(filteredFamilles.map((f) => f.idFamille)),
    [filteredFamilles],
  );

  const tree = useMemo(() => {
    const fullTree = buildFamilleTree(familles);

    if (!search.trim() && filterType === 'all') return fullTree;

    function keepMatchingBranches(nodes: FamilleNode[]): FamilleNode[] {
      const result: FamilleNode[] = [];

      for (const node of nodes) {
        const filteredChildren = keepMatchingBranches(node.children);
        const selfMatches = filteredIds.has(node.idFamille);

        if (selfMatches || filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren,
          });
        }
      }

      return result;
    }

    return keepMatchingBranches(fullTree);
  }, [familles, filteredIds, search, filterType]);

  const flatRows = useMemo(() => flattenTree(tree), [tree]);

  function toggleRow(id: number) {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function toggleModeles(id: number) {
    setShowModeles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function isVisible(row: { node: FamilleNode; level: number }) {
    let currentParentId = row.node.parent_id;

    while (currentParentId) {
      if (!expanded[currentParentId]) return false;
      currentParentId = famillesMap.get(currentParentId)?.parent_id ?? null;
    }

    return true;
  }

  const visibleRows = flatRows.filter(isVisible);

  const exportData = visibleRows.map(({ node }) => ({
    famille: node.libelle || '',
    codeFamille: node.code || '',
    parentFamille:
      node.parent_id && famillesMap.has(node.parent_id)
        ? famillesMap.get(node.parent_id)?.libelle || ''
        : '',
    sousFamilles: node.children.length,
    modeles: (node.modele || []).map((m) => m.libelle || '').join(' | '),
  }));

  function handleExport() {
    const headers = [
      'Famille',
      'Code famille',
      'Parent famille',
      'Sous-familles',
      'Modèles',
    ];

    const rows = exportData.map((item) => [
      item.famille,
      item.codeFamille,
      item.parentFamille,
      String(item.sousFamilles),
      item.modeles,
    ]);

    const csv = [
      headers.join(';'),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'arborescence_familles_bmt.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleCreateFamille() {
    router.push('/familles/nouvelle');
  }

  function handleViewFamille(idFamille: number) {
  router.push(`/familles/${idFamille}`);
}

function handleEditFamille(idFamille: number) {
  router.push(`/familles/${idFamille}/modifier`);
}
  async function handleDeleteFamille(idFamille: number) {
  const confirmed = window.confirm(
    'Voulez-vous vraiment supprimer cette famille ?',
  );

  if (!confirmed) return;

  try {
    const response = await fetch(`http://localhost:3001/familles/${idFamille}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Impossible de supprimer la famille.');
    }

    setFamilles((prev) => prev.filter((f) => f.idFamille !== idFamille));
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Erreur inconnue');
  }
}


  function handleViewModele(modeleId: number) {
    console.log('Voir modèle', modeleId);
  }

  function handleEditModele(modeleId: number) {
    console.log('Modifier modèle', modeleId);
  }

  function handleDeleteModele(modeleId: number) {
    console.log('Supprimer modèle', modeleId);
  }

  return (
    <div
      className="min-h-full p-5"
      style={{
        background: 'linear-gradient(180deg, #F7FAFC 0%, #EEF4F7 100%)',
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: '#6E8CA0' }}
          >
            BMT · Module équipement
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1
              className="text-[28px] font-bold leading-tight"
              style={{ color: '#183B56' }}
            >
              Arborescence famille
            </h1>
          </div>

          <p className="mt-2 text-[14px]" style={{ color: '#6B8596' }}>
            Gestion des familles, sous-familles et modèles associés.
          </p>
        </div>

        {loading && (
          <div className="py-6 text-[13px]" style={{ color: '#5F7C90' }}>
            Chargement des familles...
          </div>
        )}

        {error && (
          <div
            className="rounded-xl border px-4 py-3 text-[13px]"
            style={{
              borderColor: '#E8B4B4',
              color: '#8A1F1F',
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div
            className="overflow-hidden rounded-[20px] border"
            style={{
              borderColor: '#E4EBF0',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(15, 35, 55, 0.05)',
            }}
          >
            <div
              className="flex flex-col gap-3 border-b px-4 py-3 xl:flex-row xl:items-center xl:justify-between"
              style={{
                borderColor: '#EEF3F6',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                <div
                  className="flex h-[42px] w-full items-center gap-2 rounded-[12px] border px-3 lg:max-w-[320px]"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <Search size={15} color="#8AA0AF" />
                  <input
                    type="text"
                    placeholder="Rechercher"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400"
                    style={{ color: '#183B56' }}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-slate-100"
                      title="Effacer"
                    >
                      <X size={14} color="#91A3B0" />
                    </button>
                  )}
                </div>

                <div
                  className="flex h-[42px] min-w-[220px] items-center rounded-[12px] border px-3"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <select
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(
                        e.target.value as 'all' | 'parents' | 'withModels',
                      )
                    }
                    className="w-full appearance-none bg-transparent text-[13px] font-medium outline-none"
                    style={{ color: '#183B56' }}
                  >
                    <option value="all">Toutes les familles</option>
                    <option value="parents">Familles parentes</option>
                    <option value="withModels">Familles avec modèles</option>
                  </select>
                  <ChevronDown size={15} color="#91A3B0" />
                </div>

                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:opacity-95"
                  style={{
                    borderColor: '#E6EDF2',
                    backgroundColor: '#FFFFFF',
                    color: '#183B56',
                  }}
                >
                  <Download size={14} />
                  <span>Exporter</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCreateFamille}
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] border transition hover:bg-slate-50"
                style={{
                  borderColor: '#E6EDF2',
                  backgroundColor: '#FFFFFF',
                  color: '#183B56',
                }}
                title="Nouvelle famille"
              >
                <Plus size={18} />
              </button>
            </div>

            <div
              className="grid grid-cols-12 gap-3 border-b px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{
                borderColor: '#EEF3F6',
                color: '#7B93A4',
                backgroundColor: '#FAFCFD',
              }}
            >
              <div className="col-span-3">Famille</div>
              <div className="col-span-2">Code famille</div>
              <div className="col-span-2">Libellé famille</div>
              <div className="col-span-2">Parent famille</div>
              <div className="col-span-1 text-center">Sous-familles</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            {visibleRows.length === 0 ? (
              <div className="px-5 py-4 text-[13px]" style={{ color: '#183B56' }}>
                Aucune famille trouvée.
              </div>
            ) : (
              <div>
                {visibleRows.map(({ node, level }) => {
                  const parentFamille =
                    node.parent_id && famillesMap.has(node.parent_id)
                      ? famillesMap.get(node.parent_id)
                      : null;

                  const hasChildren = node.children.length > 0;
                  const hasModeles = (node.modele?.length || 0) > 0;
                  const canToggle = hasChildren || hasModeles;

                  return (
                    <div
                      key={node.idFamille}
                      className="border-b last:border-b-0"
                      style={{ borderColor: '#F0F4F7' }}
                    >
                      <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[13px]">
                        <div
                          className="col-span-3 flex items-center gap-3"
                          style={{ paddingLeft: `${level * 18}px` }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (!canToggle) return;

                              if (hasChildren) {
                                toggleRow(node.idFamille);
                              }

                              if (hasModeles) {
                                toggleModeles(node.idFamille);
                              }
                            }}
                            className="flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold"
                            style={{
                              borderColor: canToggle ? '#DCE6EC' : '#E8EEF2',
                              backgroundColor: '#FFFFFF',
                              color: canToggle ? '#183B56' : '#9BB0BD',
                            }}
                            title={
                              canToggle
                                ? expanded[node.idFamille] !== false ||
                                  showModeles[node.idFamille] !== false
                                  ? 'Replier'
                                  : 'Déplier'
                                : 'Aucun contenu à afficher'
                            }
                          >
                            {canToggle &&
                            ((hasChildren && expanded[node.idFamille]) ||
                              (hasModeles && showModeles[node.idFamille]))
                              ? '−'
                              : canToggle
                              ? '+'
                              : '↳'}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="font-medium"
                                style={{ color: '#183B56' }}
                              >
                                {node.libelle || 'Sans libellé'}
                              </span>

                              {hasModeles && (
                                <button
                                  type="button"
                                  onClick={() => toggleModeles(node.idFamille)}
                                  className="rounded-full px-2 py-0.5 text-[10px] font-medium transition hover:bg-slate-100"
                                  style={{
                                    backgroundColor: '#F3F7F9',
                                    color: '#6B8596',
                                  }}
                                  title={
                                    showModeles[node.idFamille]
                                      ? 'Masquer les modèles'
                                      : 'Afficher les modèles'
                                  }
                                >
                                  {showModeles[node.idFamille]
                                    ? 'Masquer modèles'
                                    : 'Afficher modèles'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                            style={{
                              backgroundColor: '#F3F7F9',
                              color: '#48667B',
                            }}
                          >
                            {node.code || '—'}
                          </span>
                        </div>

                        <div
                          className="col-span-2 flex items-center"
                          style={{ color: '#48667B' }}
                        >
                          {node.libelle || '—'}
                        </div>

                        <div
                          className="col-span-2 flex items-center"
                          style={{ color: '#48667B' }}
                        >
                          {parentFamille?.libelle || 'Aucune'}
                        </div>

                        <div className="col-span-1 flex items-center justify-center">
                          <span
                            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                            style={{
                              backgroundColor: '#F3F7F9',
                              color: '#48667B',
                            }}
                          >
                            {node.children.length}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewFamille(node.idFamille)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border"
                            style={{
                              borderColor: '#E5EDF2',
                              backgroundColor: '#FFFFFF',
                              color: '#6B8596',
                            }}
                            title="Voir"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEditFamille(node.idFamille)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border"
                            style={{
                              borderColor: '#E5EDF2',
                              backgroundColor: '#FFFFFF',
                              color: '#6B8596',
                            }}
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteFamille(node.idFamille)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border"
                            style={{
                              borderColor: '#F0D7D7',
                              backgroundColor: '#FFF8F8',
                              color: '#B75B5B',
                            }}
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {hasModeles && showModeles[node.idFamille] && (
                        <div
                          className="border-t px-5 py-3"
                          style={{
                            borderColor: '#F4F7F9',
                            backgroundColor: '#FCFDFE',
                          }}
                        >
                          <div
                            className="mb-3 flex items-center gap-2"
                            style={{ paddingLeft: `${level * 18 + 38}px` }}
                          >
                            <span
                              className="text-[11px] font-semibold uppercase tracking-[0.08em]"
                              style={{ color: '#7B93A4' }}
                            >
                              Modèles
                            </span>

                            <span
                              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                              style={{
                                backgroundColor: '#EEF4F7',
                                color: '#48667B',
                              }}
                            >
                              {node.modele!.length}
                            </span>
                          </div>

                          <div
                            className="flex flex-col gap-2"
                            style={{ paddingLeft: `${level * 18 + 38}px` }}
                          >
                            {node.modele!.map((modele) => (
                              <div
                                key={modele.idModele}
                                className="flex items-center justify-between gap-3 rounded-[12px] border px-3 py-2.5 text-[12px]"
                                style={{
                                  borderColor: '#E8EEF2',
                                  backgroundColor: '#FFFFFF',
                                  color: '#48667B',
                                  width: '100%',
                                  maxWidth: '760px',
                                }}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span
                                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium"
                                    style={{
                                      backgroundColor: '#EFF4F7',
                                      color: '#48667B',
                                    }}
                                  >
                                    ◇
                                  </span>

                                  <span
                                    className="truncate text-[13px] font-medium"
                                    style={{ color: '#183B56' }}
                                  >
                                    {modele.libelle || 'Sans libellé'}
                                  </span>

                                  {modele.code && (
                                    <span
                                      className="rounded-full px-2 py-0.5 text-[11px]"
                                      style={{
                                        backgroundColor: '#F3F7F9',
                                        color: '#6B8596',
                                      }}
                                    >
                                      {modele.code}
                                    </span>
                                  )}
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleViewModele(modele.idModele)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-slate-50"
                                    style={{
                                      borderColor: '#E5EDF2',
                                      backgroundColor: '#FFFFFF',
                                      color: '#6B8596',
                                    }}
                                    title="Voir le modèle"
                                  >
                                    <Eye size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleEditModele(modele.idModele)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-slate-50"
                                    style={{
                                      borderColor: '#E5EDF2',
                                      backgroundColor: '#FFFFFF',
                                      color: '#6B8596',
                                    }}
                                    title="Modifier le modèle"
                                  >
                                    <Pencil size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteModele(modele.idModele)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border transition hover:bg-red-50"
                                    style={{
                                      borderColor: '#F0D7D7',
                                      backgroundColor: '#FFF8F8',
                                      color: '#B75B5B',
                                    }}
                                    title="Supprimer le modèle"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
