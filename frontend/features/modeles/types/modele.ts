export type ModeleEtat = {
  idEtat: number;
  libelle: string | null;
};

export type ModeleFamille = {
  idFamille: number;
  code: string | null;
  libelle: string | null;
  parent_id: number | null;
};

export type ModeleApi = {
  idModele: number;
  code: string | null;
  libelle: string | null;
  idFamille: number | null;
  idEtat: number | null;
  famille?: ModeleFamille | null;
  etat_modele?: ModeleEtat | null;
};

export type CreateModelePayload = {
  code?: string;
  libelle?: string;
  idFamille?: number | null;
  idEtat: number;
};

export type ModeleFormValues = {
  code: string;
  libelle: string;
  idFamille: string;
  idEtat: string;
};