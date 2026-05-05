import { CreateMagasinDto, Magasin, UpdateMagasinDto } from '../types/magasin';

const API_URL = 'http://localhost:3001/magasins';

export async function getMagasins(): Promise<Magasin[]> {
  const res = await fetch(API_URL, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Erreur lors du chargement des magasins.');
  }

  return res.json();
}

export async function getMagasinById(id: number): Promise<Magasin> {
  const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Magasin introuvable.');
  }

  return res.json();
}

export async function createMagasin(data: CreateMagasinDto): Promise<Magasin> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la création du magasin.');
  }

  return res.json();
}

export async function updateMagasin(
  id: number,
  data: UpdateMagasinDto,
): Promise<Magasin> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Erreur lors de la modification du magasin.');
  }

  return res.json();
}

export async function deleteMagasin(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Impossible de supprimer ce magasin.');
  }
}