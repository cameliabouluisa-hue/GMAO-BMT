'use client';

import { useRouter } from 'next/navigation';

import { ModeleTable, ModeleToolbar, useModeles } from '@/features/modeles';

export default function ModelesPage() {
  const router = useRouter();

  const {
    loading,
    error,
    search,
    setSearch,
    familleId,
    setFamilleId,
    etatId,
    setEtatId,
    filteredModeles,
    famillesOptions,
    etatsOptions,
    handleDeleteModele,
    handleExport,
  } = useModeles();

  function handleCreate() {
    router.push('/modeles/nouveau');
  }

  function handleView(idModele: number) {
    router.push(`/modeles/${idModele}`);
  }

  function handleEdit(idModele: number) {
    router.push(`/modeles/${idModele}/modifier`);
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
              Liste des modèles
            </h1>
          </div>

          <p className="mt-2 text-[14px]" style={{ color: '#6B8596' }}>
            Gestion des modèles, de leur famille de rattachement et de leur état.
          </p>
        </div>

        {loading && (
          <div className="py-6 text-[13px]" style={{ color: '#5F7C90' }}>
            Chargement des modèles...
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
            <ModeleToolbar
              search={search}
              familleId={familleId}
              etatId={etatId}
              famillesOptions={famillesOptions}
              etatsOptions={etatsOptions}
              onSearchChange={setSearch}
              onClearSearch={() => setSearch('')}
              onFamilleChange={setFamilleId}
              onEtatChange={setEtatId}
              onExport={handleExport}
              onCreate={handleCreate}
            />

            <ModeleTable
              modeles={filteredModeles}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteModele}
            />
          </div>
        )}
      </div>
    </div>
  );
}