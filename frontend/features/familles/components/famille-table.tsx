

import type {
  FamilleApi,
  FamilleFlatRow,
} from '@/features/familles/types/famille';
import FamilleRow from '@/features/familles/components/famille-row';

type FamilleTableProps = {
  visibleRows: FamilleFlatRow[];
  famillesMap: Map<number, FamilleApi>;
  expanded: Record<number, boolean>;
  showModeles: Record<number, boolean>;
  onToggleRow: (id: number) => void;
  onToggleModeles: (id: number) => void;
  onViewFamille: (idFamille: number) => void;
  onEditFamille: (idFamille: number) => void;
  onDeleteFamille: (idFamille: number) => void;
  onViewModele: (modeleId: number) => void;
  onEditModele: (modeleId: number) => void;
  onDeleteModele: (modeleId: number) => void;
};

export default function FamilleTable({
  visibleRows,
  famillesMap,
  expanded,
  showModeles,
  onToggleRow,
  onToggleModeles,
  onViewFamille,
  onEditFamille,
  onDeleteFamille,
  onViewModele,
  onEditModele,
  onDeleteModele,
}: FamilleTableProps) {
  return (
    <>
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
          {visibleRows.map(({ node, level }) => (
            <FamilleRow
              key={node.idFamille}
              node={node}
              level={level}
              famillesMap={famillesMap}
              expanded={expanded}
              showModeles={showModeles}
              onToggleRow={onToggleRow}
              onToggleModeles={onToggleModeles}
              onViewFamille={onViewFamille}
              onEditFamille={onEditFamille}
              onDeleteFamille={onDeleteFamille}
              onViewModele={onViewModele}
              onEditModele={onEditModele}
              onDeleteModele={onDeleteModele}
            />
          ))}
        </div>
      )}
    </>
  );
}