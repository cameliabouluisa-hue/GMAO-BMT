import { Boxes, Pencil, Trash2 } from 'lucide-react';
import type { ModeleApi } from '@/features/modeles/types/modele';

type ModeleDetailCardProps = {
  modele: ModeleApi;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ModeleDetailCard({
  modele,
  deleting = false,
  onEdit,
  onDelete,
}: ModeleDetailCardProps) {
  const etatLabel = modele.etat_modele?.libelle || 'Non défini';

  return (
    <div
      className="overflow-hidden rounded-[20px] border"
      style={{
        borderColor: '#E4EBF0',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(15, 35, 55, 0.05)',
      }}
    >
      <div
        className="border-b px-6 py-5"
        style={{
          borderColor: '#EEF3F6',
          backgroundColor: '#FAFCFD',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-[14px]"
            style={{
              backgroundColor: '#EEF4F7',
              color: '#183B56',
            }}
          >
            <Boxes size={20} />
          </div>

          <div>
            <h2
              className="text-[20px] font-semibold"
              style={{ color: '#183B56' }}
            >
              {modele.libelle || 'Sans libellé'}
            </h2>
            <p className="text-[13px]" style={{ color: '#6B8596' }}>
              Code : {modele.code || '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            ID modèle
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {modele.idModele}
          </div>
        </div>

        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            Code
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {modele.code || '—'}
          </div>
        </div>

        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            Libellé
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {modele.libelle || '—'}
          </div>
        </div>

        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            Famille
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {modele.famille?.libelle || 'Aucune'}
          </div>
        </div>

        <div className="md:col-span-2">
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            État
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {etatLabel}
          </div>
        </div>
      </div>

      <div
        className="flex flex-wrap items-center justify-end gap-3 border-t px-6 py-4"
        style={{
          borderColor: '#EEF3F6',
          backgroundColor: '#FFFFFF',
        }}
      >
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-slate-50"
          style={{
            borderColor: '#E6EDF2',
            backgroundColor: '#FFFFFF',
            color: '#183B56',
          }}
        >
          <Pencil size={15} />
          <span>Modifier</span>
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            borderColor: '#F0D7D7',
            backgroundColor: '#FFF8F8',
            color: '#B75B5B',
          }}
        >
          <Trash2 size={15} />
          <span>{deleting ? 'Suppression...' : 'Supprimer'}</span>
        </button>
      </div>
    </div>
  );
}