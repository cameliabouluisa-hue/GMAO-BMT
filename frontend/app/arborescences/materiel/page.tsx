import ArborescenceHeader from '@/features/arborescences/components/ArborescenceHeader';
import TreeView from '@/features/arborescences/components/TreeView';
import { getArborescenceMateriel } from '@/features/arborescences/services/arborescence.service';

export default async function ArborescenceMaterielPage() {
  const data = await getArborescenceMateriel();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <ArborescenceHeader
          title="Arborescence matériel"
          description="Visualisez la hiérarchie des matériels et sous-matériels."
        />

        <TreeView data={data} />
      </div>
    </main>
  );
}