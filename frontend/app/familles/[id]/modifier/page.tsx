'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Famille = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
  parent_id: number | null;
};

export default function ModifierFamillePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [code, setCode] = useState('');
  const [libelle, setLibelle] = useState('');
  const [parentId, setParentId] = useState('');
  const [familles, setFamilles] = useState<Famille[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [familleRes, famillesRes] = await Promise.all([
          fetch(`http://localhost:3001/familles/${id}`),
          fetch('http://localhost:3001/familles'),
        ]);

        if (!familleRes.ok) {
          throw new Error('Impossible de charger la famille.');
        }

        if (!famillesRes.ok) {
          throw new Error('Impossible de charger les familles.');
        }

        const famille = await familleRes.json();
        const allFamilles = await famillesRes.json();

        setCode(famille.code || '');
        setLibelle(famille.libelle || '');
        setParentId(famille.parent_id ? String(famille.parent_id) : '');
        setFamilles(allFamilles.filter((f: Famille) => String(f.idFamille) !== String(id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/familles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.trim(),
          libelle: libelle.trim(),
          parent_id: parentId ? Number(parentId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Impossible de modifier la famille.');
      }

      router.push(`/familles/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-5">Chargement...</div>;
  }

  return (
    <div className="min-h-full p-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Modifier famille</h1>

          <button
            type="button"
            onClick={() => router.push(`/familles/${id}`)}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
          >
            <ChevronLeft size={16} />
            Retour
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-11 w-full rounded-xl border px-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Libellé</label>
              <input
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                className="h-11 w-full rounded-xl border px-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Famille parente</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="h-11 w-full rounded-xl border px-4"
              >
                <option value="">Aucune</option>
                {familles.map((famille) => (
                  <option key={famille.idFamille} value={famille.idFamille}>
                    {famille.libelle} {famille.code ? `(${famille.code})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-white"
              >
                <Save size={15} />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
