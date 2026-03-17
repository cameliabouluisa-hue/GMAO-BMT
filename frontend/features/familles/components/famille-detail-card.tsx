import { FolderTree, Pencil, Trash2 } from 'lucide-react';
import type { FamilleApi } from '@/features/familles/types/famille';

type FamilleDetailCardProps = {
  famille: FamilleApi;
  parentFamille: FamilleApi | null;
  deleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function FamilleDetailCard({
  famille,
  parentFamille,
  deleting = false,
  onEdit,
  onDelete,
}: FamilleDetailCardProps) {
  const nombreModeles = famille.modele?.length || 0;

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
            <FolderTree size={20} />
          </div>

          <div>
            <h2
              className="text-[20px] font-semibold"
              style={{ color: '#183B56' }}
            >
              {famille.libelle || 'Sans libellé'}
            </h2>
            <p className="text-[13px]" style={{ color: '#6B8596' }}>
              Code : {famille.code || '—'}
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
            ID famille
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {famille.idFamille}
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
            {famille.code || '—'}
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
            {famille.libelle || '—'}
          </div>
        </div>

        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            Famille parente
          </p>
          <div
            className="rounded-[12px] border px-4 py-3 text-[14px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            {parentFamille?.libelle || 'Aucune'}
          </div>
        </div>
      </div>

      <div
        className="border-t px-6 py-5"
        style={{
          borderColor: '#EEF3F6',
          backgroundColor: '#FCFDFE',
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3
            className="text-[14px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: '#6E8CA0' }}
          >
            Modèles associés
          </h3>

          <span
            className="rounded-full px-3 py-1 text-[12px] font-medium"
            style={{
              backgroundColor: '#EDF3F7',
              color: '#48667B',
              border: '1px solid #E2EAF0',
            }}
          >
            {nombreModeles} modèle{nombreModeles > 1 ? 's' : ''}
          </span>
        </div>

        {nombreModeles === 0 ? (
          <div
            className="rounded-[12px] border px-4 py-3 text-[13px]"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#6B8596',
            }}
          >
            Aucun modèle associé.
          </div>
        ) : (
          <div className="space-y-2">
            {famille.modele?.map((modele) => (
              <div
                key={modele.idModele}
                className="flex items-center justify-between rounded-[12px] border px-4 py-3"
                style={{
                  borderColor: '#E6EDF2',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div>
                  <p
                    className="text-[14px] font-medium"
                    style={{ color: '#183B56' }}
                  >
                    {modele.libelle || 'Sans libellé'}
                  </p>
                  <p className="text-[12px]" style={{ color: '#6B8596' }}>
                    {modele.code || 'Sans code'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
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