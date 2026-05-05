export type Famille = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
};

export type UniteArticle = {
  idUniteArticle: number;
  code: string;
  libelle: string;
};

export type Modele = {
  idModele: number;
  code: string | null;
  libelle: string | null;
};

export type Article = {
  idArticle: number;
  reference: string;
  designation: string;
  description?: string | null;
  prixUnitaire?: number | string | null;

  idFamille?: number | null;
  idUniteArticle?: number | null;
  idModele?: number | null;

  gereEnStock: boolean;
  serialise: boolean;
  reparable: boolean;
  actif: boolean;

  famille?: Famille | null;
  uniteArticle?: UniteArticle | null;
  modele?: Modele | null;
};

export type CreateArticleDto = {
  reference: string;
  designation: string;
  description?: string;
  prixUnitaire?: number;
  idFamille?: number;
  idUniteArticle?: number;
  idModele?: number;
  gereEnStock?: boolean;
  serialise?: boolean;
  reparable?: boolean;
  actif?: boolean;
};

export type UpdateArticleDto = Partial<CreateArticleDto>;