import {
  CreatePointStructureDto,
  FindPointsStructureQuery,
  PointStructureDetail,
  PointStructureListItem,
  UpdatePointStructureDto,
} from '../types/point-structure.type';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join('\n')
      : data?.message || 'Une erreur est survenue.';

    throw new Error(message);
  }

  return data as T;
}

export async function getPointsStructure(
  query: FindPointsStructureQuery = {},
): Promise<PointStructureListItem[]> {
  const params = new URLSearchParams();

  if (query.search?.trim()) {
    params.set('search', query.search.trim());
  }

  if (query.typePoint && query.typePoint !== 'TOUS') {
    params.set('typePoint', query.typePoint);
  }

  if (query.actif && query.actif !== 'all') {
    params.set('actif', query.actif);
  }

  const queryString = params.toString();

  return request<PointStructureListItem[]>(
    `${API_URL}/points-structure${queryString ? `?${queryString}` : ''}`,
  );
}

export async function getPointStructure(
  idPoint: number,
): Promise<PointStructureDetail> {
  return request<PointStructureDetail>(
    `${API_URL}/points-structure/${idPoint}`,
  );
}

export async function createPointStructure(
  dto: CreatePointStructureDto,
): Promise<PointStructureListItem> {
  return request<PointStructureListItem>(
    `${API_URL}/points-structure`,
    {
      method: 'POST',
      body: JSON.stringify(dto),
    },
  );
}

export async function updatePointStructure(
  idPoint: number,
  dto: UpdatePointStructureDto,
): Promise<PointStructureListItem> {
  return request<PointStructureListItem>(
    `${API_URL}/points-structure/${idPoint}`,
    {
      method: 'PATCH',
      body: JSON.stringify(dto),
    },
  );
}

export async function deletePointStructure(
  idPoint: number,
): Promise<PointStructureListItem> {
  return request<PointStructureListItem>(
    `${API_URL}/points-structure/${idPoint}`,
    {
      method: 'DELETE',
    },
  );
}

export async function restorePointStructure(
  idPoint: number,
): Promise<PointStructureListItem> {
  return request<PointStructureListItem>(
    `${API_URL}/points-structure/${idPoint}/restaurer`,
    {
      method: 'PATCH',
    },
  );
}