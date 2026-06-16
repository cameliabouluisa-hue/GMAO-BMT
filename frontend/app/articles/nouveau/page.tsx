'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import ArticleForm from '@/features/articles/components/ArticleForm';
import { createArticle } from '@/features/articles/services/article.service';

import type {
  CreateArticleDto,
  UpdateArticleDto,
} from '@/features/articles/types/article';

export default function NouvelArticlePage() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(data: CreateArticleDto | UpdateArticleDto) {
    try {
      setSubmitting(true);
      setError('');

      const created = await createArticle(data as CreateArticleDto);

      router.push(`/articles/${created.idArticle}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de l'article.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-96px)] bg-[#f5f7fb] px-5 py-6">
      <section className="mx-auto max-w-[1180px] space-y-5">
        <BackButton onClick={() => router.back()} />

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-black text-red-700">
            {error}
          </div>
        )}

        <ArticleForm
          mode="create"
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </section>
    </main>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-[#06475a]"
    >
      <ArrowLeft size={18} />
      Retour
    </button>
  );
}