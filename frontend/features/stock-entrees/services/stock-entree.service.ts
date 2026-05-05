import {
  CreateStockEntreeDto,
  StockEntree,
} from '../types/stock-entree';

const API_URL = 'http://localhost:3001';

async function handleApiError(response: Response, defaultMessage: string) {
  const error = await response.json().catch(() => null);

  if (Array.isArray(error?.message)) {
    throw new Error(error.message.join(', '));
  }

  throw new Error(error?.message ?? defaultMessage);
}

export async function createStockEntree(
  data: CreateStockEntreeDto,
): Promise<StockEntree> {
  const response = await fetch(`${API_URL}/stock/entrees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    await handleApiError(
      response,
      "Erreur lors de la création de l'entrée stock.",
    );
  }

  return response.json();
}

export async function getStockEntrees(): Promise<StockEntree[]> {
  const response = await fetch(`${API_URL}/stock/entrees`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    await handleApiError(
      response,
      'Erreur lors du chargement des entrées stock.',
    );
  }

  return response.json();
}

export async function getStockEntreeById(
  id: number,
): Promise<StockEntree> {
  const response = await fetch(`${API_URL}/stock/entrees/${id}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    await handleApiError(
      response,
      "Erreur lors du chargement de l'entrée stock.",
    );
  }

  return response.json();
}