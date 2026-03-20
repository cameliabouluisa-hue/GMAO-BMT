import { API_BASE_URL } from '@/lib/api';
import type {
  CreateModelePayload,
  ModeleApi,
  ModeleEtat,
} from '@/features/modeles/types/modele';

export async function getModeles(): Promise<ModeleApi[]> {
  const response = await fetch(`${API_BASE_URL}/modeles`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Impossible de charger les modèles.');
  }

  return response.json();
}

export async function getModeleById(idModele: number | string): Promise<ModeleApi> {
  const response = await fetch(`${API_BASE_URL}/modeles/${idModele}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Impossible de charger le modèle.');
  }

  return response.json();
}

export async function getEtatsModele(): Promise<ModeleEtat[]> {
  const response = await fetch(`${API_BASE_URL}/etat-modele`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error("Impossible de charger les états du modèle.");
  }

  return response.json();
}

export async function createModele(
  payload: CreateModelePayload,
): Promise<ModeleApi> {
  const response = await fetch(`${API_BASE_URL}/modeles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Impossible d'ajouter le modèle.";

    try {
      const data = await response.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function updateModele(
  idModele: number | string,
  payload: CreateModelePayload,
): Promise<ModeleApi> {
  const response = await fetch(`${API_BASE_URL}/modeles/${idModele}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = 'Impossible de modifier le modèle.';

    try {
      const data = await response.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function deleteModele(idModele: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/modeles/${idModele}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    let message = 'Impossible de supprimer le modèle.';

    try {
      const data = await response.json();
      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {}

    throw new Error(message);
  }
}