export type Article = {
  idArticle: number;
  reference?: string | null;
  code?: string | null;
  designation?: string | null;
  libelle?: string | null;
};

export type Modele = {
  idModele: number;
  code?: string | null;
  libelle?: string | null;
};

export type EtatMateriel = {
  idEtat: number;
  code?: string | null;
  libelle?: string | null;
};

export type TypeMateriel = {
  idType: number;
  code?: string | null;
  libelle?: string | null;
};

export type PointStructure = {
  idPoint: number;
  code: string | null;
  libelle: string | null;
  description?: string | null;
  typePoint: 'GEOGRAPHIQUE' | 'TECHNIQUE' | string | null;
  actif?: boolean | null;
};

export type Materiel = {
  idMateriel: number;

  code: string | null;
  numeroSerie: string | null;
  dateMiseService: string | null;

  idArticle: number | null;
  idModele: number | null;
  idEtat: number | null;
  idType: number | null;
  idPointStructure: number | null;

  actif: boolean | null;

  article?: Article | null;
  modele?: Modele | null;
  etat_materiel?: EtatMateriel | null;
  type_materiel?: TypeMateriel | null;
  point_structure?: PointStructure | null;
};

export type CreateMaterielDto = {
  code: string;
  numeroSerie?: string | null;
  dateMiseService?: string | null;

  idArticle?: number | null;
  idModele?: number | null;
  idEtat?: number | null;
  idType?: number | null;
  idPointStructure?: number | null;

  actif?: boolean;
};

export type UpdateMaterielDto = Partial<CreateMaterielDto>;