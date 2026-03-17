import type { Modele } from '@/types/modele';

export type FamilleApi = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
  parent_id: number | null;
  modele?: Modele[];
};

export type FamilleNode = FamilleApi & {
  children: FamilleNode[];
};

export type FamilleFlatRow = {
  node: FamilleNode;
  level: number;
};

export type FamilleFilterType = 'all' | 'parents' | 'withModels';

export type CreateFamillePayload = {
  code: string;
  libelle: string;
  parent_id: number | null;
};

export type FamilleFormValues = {
  code: string;
  libelle: string;
  parentId: string;
};