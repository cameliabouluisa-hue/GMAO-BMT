

import { useState } from 'react';
import { Save, X, Warehouse } from 'lucide-react';
import { CreateMagasinDto, Magasin } from '../types/magasin';

type Props = {
  initialData?: Magasin;
  onSubmit: (data: CreateMagasinDto) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
};

export function MagasinForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
}: Props) {
  const [code, setCode] = useState(initialData?.code ?? '');
  const [libelle, setLibelle] = useState(initialData?.libelle ?? '');
  const [actif, setActif] = useState(initialData?.actif ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!code.trim() || !libelle.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        code: code.trim(),
        libelle: libelle.trim(),
        actif,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 bg-slate-50/70 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-[#0f3d56]">
            <Warehouse size={26} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
              Référentiel stock
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Informations du magasin
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Renseignez le magasin utilisé pour les entrées et sorties de stock.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Code magasin *
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex : MAG-001"
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Libellé *
          </label>
          <input
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            placeholder="Ex : Magasin principal"
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div>
              <p className="font-semibold text-slate-800">Magasin actif</p>
              <p className="text-sm text-slate-500">
                Un magasin inactif ne sera pas utilisé dans les nouvelles opérations.
              </p>
            </div>

            <input
              type="checkbox"
              checked={actif}
              onChange={(e) => setActif(e.target.checked)}
              className="h-5 w-5 accent-[#0f3d56]"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mx-8 mb-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-8 py-5">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <X size={18} />
          Annuler
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0f3d56] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0b3044] disabled:opacity-60"
        >
          <Save size={18} />
          {loading ? 'Enregistrement...' : submitLabel}
        </button>
      </div>
    </form>
  );
}