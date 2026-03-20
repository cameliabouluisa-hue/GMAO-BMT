'use client';

import { deleteModele } from '@/features/modeles/services/modele.service';
import { useRouter } from 'next/navigation';

import {
  FamilleTable,
  FamilleToolbar,
  useFamilles,
} from '@/features/familles';

export default function FamillesPage() {
  const router = useRouter();

  const {
    loading,
    error,
    search,
    setSearch,
    filterType,
    setFilterType,
    expanded,
    showModeles,
    famillesMap,
    visibleRows,
    toggleRow,
    toggleModeles,
    handleDeleteFamille,
    handleExport,
  } = useFamilles();

  function handleCreateFamille() {
    router.push('/familles/nouvelle');
  }

  function handleViewFamille(idFamille: number) {
    router.push(`/familles/${idFamille}`);
  }

  function handleEditFamille(idFamille: number) {
    router.push(`/familles/${idFamille}/modifier`);
  }

  function handleViewModele(modeleId: number) {
    router.push(`/modeles/${modeleId}`);
  }

  function handleEditModele(modeleId: number) {
    router.push(`/modeles/${modeleId}/modifier`);
  }

  async function handleDeleteModele(modeleId: number) {
    const confirmed = window.confirm(
      'Voulez-vous vraiment supprimer ce modèle ?',
    );

    if (!confirmed) return;

    try {
      await deleteModele(modeleId);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur inconnue');
    }
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
            <FamilleToolbar
              search={search}
              filterType={filterType}
              onSearchChange={setSearch}
              onClearSearch={() => setSearch('')}
              onFilterChange={setFilterType}
              onExport={handleExport}
              onCreate={handleCreateFamille}
            />

            <FamilleTable
              visibleRows={visibleRows}
              famillesMap={famillesMap}
              expanded={expanded}
              showModeles={showModeles}
              onToggleRow={toggleRow}
              onToggleModeles={toggleModeles}
              onViewFamille={handleViewFamille}
              onEditFamille={handleEditFamille}
              onDeleteFamille={handleDeleteFamille}
              onViewModele={handleViewModele}
              onEditModele={handleEditModele}
              onDeleteModele={handleDeleteModele}
            />
          </div>
        )}
      </div>
    </div>
  );
}