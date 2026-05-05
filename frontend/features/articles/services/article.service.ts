import { Article, CreateArticleDto, UpdateArticleDto } from '../types/article';

const API_URL = 'http://localhost:3001/articles';

export async function getArticles(): Promise<Article[]> {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur lors du chargement des articles.');
  return res.json();
}

export async function getArticleById(id: number): Promise<Article> {
  const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Article introuvable.');
  return res.json();
}

export async function createArticle(data: CreateArticleDto): Promise<Article> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erreur lors de la création de l'article.");
  }

  return res.json();
}

export async function updateArticle(
  id: number,
  data: UpdateArticleDto,
): Promise<Article> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? "Erreur lors de la modification de l'article.");
  }

  return res.json();
}

export async function deleteArticle(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message ?? 'Suppression impossible.');
  }
}