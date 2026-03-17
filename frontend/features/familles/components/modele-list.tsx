

import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Modele } from '@/types/modele';

type ModeleListProps = {
  modeles: Modele[];
  level: number;
  onViewModele: (modeleId: number) => void;
  onEditModele: (modeleId: number) => void;
  onDeleteModele: (modeleId: number) => void;
};

export default function ModeleList({
  modeles,
  level,
  onViewModele,
  onEditModele,
  onDeleteModele,
}: ModeleListProps) {
  return (
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
          {modeles.length}
        </span>
      </div>

      <div
        className="flex flex-col gap-2"
        style={{ paddingLeft: `${level * 18 + 38}px` }}
      >
        {modeles.map((modele) => (
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
                onClick={() => onViewModele(modele.idModele)}
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
                onClick={() => onEditModele(modele.idModele)}
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
                onClick={() => onDeleteModele(modele.idModele)}
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
  );
}