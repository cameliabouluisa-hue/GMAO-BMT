import axios from '@/lib/api';
import { CreateMaterielDto, Materiel } from '../types/materiel';

function cleanMaterielPayload(data: CreateMaterielDto): CreateMaterielDto {
  return {
    code: data.code?.trim(),

    numeroSerie:
      data.numeroSerie && data.numeroSerie.trim() !== ''
        ? data.numeroSerie.trim()
        : null,

    dateMiseService:
      data.dateMiseService && data.dateMiseService.trim() !== ''
        ? data.dateMiseService
        : null,

    idArticle: data.idArticle ? Number(data.idArticle) : null,
    idModele: data.idModele ? Number(data.idModele) : null,
    idEtat: data.idEtat ? Number(data.idEtat) : null,
    idType: data.idType ? Number(data.idType) : null,
    idPointStructure: data.idPointStructure ? Number(data.idPointStructure) : null,

    actif: data.actif ?? true,
  };
}

export async function getMateriels(): Promise<Materiel[]> {
  const res = await axios.get('/materiels');
  return res.data;
}

export async function getMaterielById(id: number): Promise<Materiel> {
  const res = await axios.get(`/materiels/${id}`);
  return res.data;
}

export async function createMateriel(data: CreateMaterielDto): Promise<Materiel> {
  const payload = cleanMaterielPayload(data);
  const res = await axios.post('/materiels', payload);
  return res.data;
}

export async function updateMateriel(
  id: number,
  data: CreateMaterielDto,
): Promise<Materiel> {
  const payload = cleanMaterielPayload(data);

  console.log('PATCH matériel payload envoyé au backend :', payload);

  const res = await axios.patch(`/materiels/${id}`, payload);
  return res.data;
}

export async function deleteMateriel(id: number): Promise<void> {
  await axios.delete(`/materiels/${id}`);
}