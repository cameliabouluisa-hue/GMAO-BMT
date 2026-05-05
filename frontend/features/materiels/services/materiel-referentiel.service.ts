import axios from '@/lib/api';

import {
  Article,
  EtatMateriel,
  Modele,
  PointStructure,
  TypeMateriel,
} from '../types/materiel';

export async function getArticles(): Promise<Article[]> {
  try {
    const res = await axios.get('/articles');
    return res.data;
  } catch {
    return [];
  }
}

export async function getModeles(): Promise<Modele[]> {
  try {
    const res = await axios.get('/modeles');
    return res.data;
  } catch {
    return [];
  }
}

export async function getEtatsMateriel(): Promise<EtatMateriel[]> {
  try {
    const res = await axios.get('/etat-materiel');
    return res.data;
  } catch {
    return [];
  }
}

export async function getTypesMateriel(): Promise<TypeMateriel[]> {
  try {
    const res = await axios.get('/type-materiel');
    return res.data;
  } catch {
    return [];
  }
}

export async function getPointsStructure(): Promise<PointStructure[]> {
  try {
    const res = await axios.get('/point-structure');
    return res.data;
  } catch {
    return [];
  }
}