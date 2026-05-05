'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { ArticleForm } from '@/features/articles/components/ArticleForm';
import {
  getArticleById,
  updateArticle,
} from '@/features/articles/services/article.service';
import { Article, CreateArticleDto } from '@/features/articles/types/article';

export default function ModifierArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getArticleById(id);
        setArticle(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadData();
  }, [id]);

  async function handleSubmit(data: CreateArticleDto) {
    await updateArticle(id, data);
    router.push('/articles');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">
              BMT · Module stock
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#0f3d56]">
              Modifier article
            </h1>
            <p className="mt-2 text-slate-500">
              Modifiez les informations de l’article sélectionné.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
        </div>

        {loading && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Chargement...
          </div>
        )}

        {error && !loading && (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 text-red-600">
            {error}
          </div>
        )}

        {article && !loading && (
          <ArticleForm
            initialData={article}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/articles')}
            submitLabel="Enregistrer"
          />
        )}
      </div>
    </main>
  );
}