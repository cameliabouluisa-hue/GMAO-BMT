export type TypePointStructure = 'GEOGRAPHIQUE' | 'TECHNIQUE';

export type TypePointStructureFilter = TypePointStructure | 'TOUS';

export type ActifFilter = 'true' | 'false' | 'all';

export interface PointStructureListItem {
  idPoint: number;
  code: string | null;
  libelle: string | null;
  description: string | null;
  typePoint: TypePointStructure;
  actif: boolean;

  nbMateriels?: number;
  nbGammesOperations?: number;
  nbPlansPreventifs?: number;
  nbDeclencheursPreventifs?: number;
  nbHistoriquesPreventifs?: number;
}

export interface PointStructureMateriel {
  idMateriel: number;
  code: string | null;
  numeroSerie: string | null;
  actif: boolean | null;
}

export interface PointStructureDetail extends PointStructureListItem {
  materiels?: PointStructureMateriel[];
  liens?: unknown[];
}

export interface CreatePointStructureDto {
  code: string;
  libelle: string;
  description?: string | null;
  typePoint: TypePointStructure;
  actif?: boolean;
}

export interface UpdatePointStructureDto {
  code?: string;
  libelle?: string;
  description?: string | null;
  typePoint?: TypePointStructure;
  actif?: boolean;
}

export interface FindPointsStructureQuery {
  search?: string;
  typePoint?: TypePointStructureFilter;
  actif?: ActifFilter;
}