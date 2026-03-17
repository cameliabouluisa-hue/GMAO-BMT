

import { Eye, Pencil, Trash2 } from 'lucide-react';
import type {
  FamilleApi,
  FamilleNode,
} from '@/features/familles/types/famille';
import ModeleList from '@/features/familles/components/modele-list';

type FamilleRowProps = {
  node: FamilleNode;
  level: number;
  expanded: Record<number, boolean>;
  showModeles: Record<number, boolean>;
  famillesMap: Map<number, FamilleApi>;
  onToggleRow: (id: number) => void;
  onToggleModeles: (id: number) => void;
  onViewFamille: (idFamille: number) => void;
  onEditFamille: (idFamille: number) => void;
  onDeleteFamille: (idFamille: number) => void;
  onViewModele: (modeleId: number) => void;
  onEditModele: (modeleId: number) => void;
  onDeleteModele: (modeleId: number) => void;
};

export default function FamilleRow({
  node,
  level,
  expanded,
  showModeles,
  famillesMap,
  onToggleRow,
  onToggleModeles,
  onViewFamille,
  onEditFamille,
  onDeleteFamille,
  onViewModele,
  onEditModele,
  onDeleteModele,
}: FamilleRowProps) {
  const parentFamille =
    node.parent_id && famillesMap.has(node.parent_id)
      ? famillesMap.get(node.parent_id)
      : null;

  const hasChildren = node.children.length > 0;
  const hasModeles = (node.modele?.length || 0) > 0;
  const canToggle = hasChildren || hasModeles;

  return (
    <div
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

              if (hasChildren) onToggleRow(node.idFamille);
              if (hasModeles) onToggleModeles(node.idFamille);
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
              <span className="font-medium" style={{ color: '#183B56' }}>
                {node.libelle || 'Sans libellé'}
              </span>

              {hasModeles && (
                <button
                  type="button"
                  onClick={() => onToggleModeles(node.idFamille)}
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
            onClick={() => onViewFamille(node.idFamille)}
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
            onClick={() => onEditFamille(node.idFamille)}
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
            onClick={() => onDeleteFamille(node.idFamille)}
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
        <ModeleList
          modeles={node.modele || []}
          level={level}
          onViewModele={onViewModele}
          onEditModele={onEditModele}
          onDeleteModele={onDeleteModele}
        />
      )}
    </div>
  );
}