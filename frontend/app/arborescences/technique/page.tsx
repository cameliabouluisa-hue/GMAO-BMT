import ArborescenceHeader from '@/features/arborescences/components/ArborescenceHeader';
import TreeView from '@/features/arborescences/components/TreeView';
import { getArborescenceTechnique } from '@/features/arborescences/services/arborescence.service';

export default async function ArborescenceTechniquePage() {
  const data = await getArborescenceTechnique();

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <ArborescenceHeader
          title="Arborescence technique"
          description="Visualisez les points techniques et les matériels associés à la structure technique."
        />

        <TreeView data={data} />
      </div>
    </main>
  );
}