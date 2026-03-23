import { ArborescenceNode } from '../types/arborescence.types';

const API_URL = 'http://localhost:3001';

export async function getArborescenceGeographique(): Promise<ArborescenceNode[]> {
  const res = await fetch(`${API_URL}/arborescence/geographique/tree`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement de l'arborescence géographique");
  }

  return res.json();
}

export async function getArborescenceTechnique(): Promise<ArborescenceNode[]> {
  const res = await fetch(`${API_URL}/arborescence/technique/tree`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement de l'arborescence technique");
  }

  return res.json();
}

export async function getArborescenceMateriel(): Promise<ArborescenceNode[]> {
  const res = await fetch(`${API_URL}/arborescence/materiel/tree`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement de l'arborescence matériel");
  }

  return res.json();
}