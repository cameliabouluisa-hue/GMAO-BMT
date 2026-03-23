export type ArborescenceNode = {
  key: string;
  id: number;
  type: 'POINT_STRUCTURE' | 'MATERIEL';
  code: string | null;
  libelle: string | null;
  typePoint?: string | null;
  children: ArborescenceNode[];
};