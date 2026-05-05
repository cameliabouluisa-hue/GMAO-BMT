export type Magasin = {
  idMagasin: number;
  code: string;
  libelle: string;
  actif: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateMagasinDto = {
  code: string;
  libelle: string;
  actif?: boolean;
};

export type UpdateMagasinDto = Partial<CreateMagasinDto>;