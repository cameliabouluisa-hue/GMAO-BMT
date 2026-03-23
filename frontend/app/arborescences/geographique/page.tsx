import ArborescenceHeader from '@/features/arborescences/components/ArborescenceHeader';
import TreeView from '@/features/arborescences/components/TreeView';
import { getArborescenceGeographique } from '@/features/arborescences/services/arborescence.service';

export default async function ArborescenceGeographiquePage() {
  const data = await getArborescenceGeographique();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <ArborescenceHeader
          title="Arborescence géographique"
          description="Visualisez les points géographiques, points techniques et matériels selon leur implantation."
        />

        <TreeView data={data} />
      </div>
    </main>
  );
}