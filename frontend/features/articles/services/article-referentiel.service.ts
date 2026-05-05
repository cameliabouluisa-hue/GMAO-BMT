import { Famille, Modele, UniteArticle } from '../types/article';

const API_BASE = 'http://localhost:3001';

export async function getFamilles(): Promise<Famille[]> {
  const res = await fetch(`${API_BASE}/familles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur chargement familles.');
  return res.json();
}

export async function getUnitesArticles(): Promise<UniteArticle[]> {
  const res = await fetch(`${API_BASE}/unites-articles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur chargement unités.');
  return res.json();
}

export async function getModeles(): Promise<Modele[]> {
  const res = await fetch(`${API_BASE}/modeles`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erreur chargement modèles.');
  return res.json();
}