import { Boxes, Save } from 'lucide-react';
import type { FamilleApi } from '@/features/familles/types/famille';
import type { ModeleEtat } from '@/features/modeles/types/modele';

type ModeleFormProps = {
  title: string;
  subtitle: string;
  badge?: string;
  submitLabel: string;
  values: {
    code: string;
    libelle: string;
    idFamille: string;
    idEtat: string;
  };
  familles: FamilleApi[];
  etats: ModeleEtat[];
  loadingFamilles: boolean;
  loadingEtats: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  onCodeChange: (value: string) => void;
  onLibelleChange: (value: string) => void;
  onFamilleChange: (value: string) => void;
  onEtatChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function ModeleForm({
  title,
  subtitle,
  badge,
  submitLabel,
  values,
  familles,
  etats,
  loadingFamilles,
  loadingEtats,
  saving,
  error,
  success,
  onCodeChange,
  onLibelleChange,
  onFamilleChange,
  onEtatChange,
  onSubmit,
  onCancel,
}: ModeleFormProps) {
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
            <div className="flex flex-wrap items-center gap-3">
              <h2
                className="text-[18px] font-semibold"
                style={{ color: '#183B56' }}
              >
                {title}
              </h2>

              {badge && (
                <span
                  className="rounded-full px-3 py-1 text-[12px] font-medium"
                  style={{
                    backgroundColor: '#EDF3F7',
                    color: '#48667B',
                    border: '1px solid #E2EAF0',
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            <p className="text-[13px]" style={{ color: '#6B8596' }}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="px-6 py-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: '#6E8CA0' }}
            >
              Code modèle
            </label>

            <input
              type="text"
              value={values.code}
              onChange={(e) => onCodeChange(e.target.value)}
              placeholder="Ex : MOD-001"
              className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
              style={{
                borderColor: '#E6EDF2',
                backgroundColor: '#FFFFFF',
                color: '#183B56',
              }}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: '#6E8CA0' }}
            >
              Libellé
            </label>

            <input
              type="text"
              value={values.libelle}
              onChange={(e) => onLibelleChange(e.target.value)}
              placeholder="Ex : Pompe standard"
              className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
              style={{
                borderColor: '#E6EDF2',
                backgroundColor: '#FFFFFF',
                color: '#183B56',
              }}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: '#6E8CA0' }}
            >
              Famille
            </label>

            <select
              value={values.idFamille}
              onChange={(e) => onFamilleChange(e.target.value)}
              disabled={loadingFamilles}
              className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
              style={{
                borderColor: '#E6EDF2',
                backgroundColor: '#FFFFFF',
                color: '#183B56',
              }}
            >
              <option value="">Aucune</option>
              {familles.map((famille) => (
                <option key={famille.idFamille} value={famille.idFamille}>
                  {famille.libelle || 'Sans libellé'}
                  {famille.code ? ` (${famille.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em]"
              style={{ color: '#6E8CA0' }}
            >
              État <span style={{ color: '#B75B5B' }}>*</span>
            </label>

            <select
              value={values.idEtat}
              onChange={(e) => onEtatChange(e.target.value)}
              disabled={loadingEtats}
              className="h-[46px] w-full rounded-[12px] border px-4 text-[14px] outline-none transition"
              style={{
                borderColor: '#E6EDF2',
                backgroundColor: '#FFFFFF',
                color: '#183B56',
              }}
            >
              <option value="">Sélectionner un état</option>
              {etats.map((etat) => (
                <option key={etat.idEtat} value={etat.idEtat}>
                  {etat.libelle || 'Sans libellé'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            className="mt-5 rounded-[12px] border px-4 py-3 text-[13px]"
            style={{
              borderColor: '#F0D7D7',
              backgroundColor: '#FFF8F8',
              color: '#B75B5B',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="mt-5 rounded-[12px] border px-4 py-3 text-[13px]"
            style={{
              borderColor: '#D6EBDD',
              backgroundColor: '#F6FCF8',
              color: '#2F7A4F',
            }}
          >
            {success}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-[44px] items-center rounded-[12px] border px-4 text-[13px] font-medium transition hover:bg-slate-50"
            style={{
              borderColor: '#E6EDF2',
              backgroundColor: '#FFFFFF',
              color: '#183B56',
            }}
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-[44px] items-center gap-2 rounded-[12px] px-5 text-[13px] font-semibold transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              backgroundColor: '#183B56',
              color: '#FFFFFF',
              border: '1px solid #183B56',
            }}
          >
            <Save size={15} />
            <span>{saving ? 'Enregistrement...' : submitLabel}</span>
          </button>
        </div>
      </form>
    </div>
  );
}