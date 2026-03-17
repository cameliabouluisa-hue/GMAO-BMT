import { API_BASE_URL } from '@/lib/api';
import type {
  CreateFamillePayload,
  FamilleApi,
} from '@/features/familles/types/famille';

export async function getFamilles(): Promise<FamilleApi[]> {
  const response = await fetch(`${API_BASE_URL}/familles`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Impossible de charger les familles.');
  }

  return response.json();
}

export async function getFamilleById(idFamille: number | string): Promise<FamilleApi> {
  const response = await fetch(`${API_BASE_URL}/familles/${idFamille}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Impossible de charger la famille.');
  }

  return response.json();
}

export async function createFamille(
  payload: CreateFamillePayload,
): Promise<FamilleApi> {
  const response = await fetch(`${API_BASE_URL}/familles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Impossible d'ajouter la famille.";

    try {
      const data = await response.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {
      // on garde le message par défaut
    }

    throw new Error(message);
  }

  return response.json();
}

export async function updateFamille(
  idFamille: number | string,
  payload: CreateFamillePayload,
): Promise<FamilleApi> {
  const response = await fetch(`${API_BASE_URL}/familles/${idFamille}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Impossible de modifier la famille.';

    try {
      const data = await response.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {
      // on garde le message par défaut
    }

    throw new Error(message);
  }

  return response.json();
}

export async function deleteFamille(idFamille: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/familles/${idFamille}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Impossible de supprimer la famille.');
  }
}