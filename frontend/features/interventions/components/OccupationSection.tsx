'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

import {
  AppSection,
  appInputClassName,
  appPrimaryButtonClassName,
  appSecondaryButtonClassName,
} from '@/components/app-section-layout';

import type {
  CreateOccupationInterventionDto,
  OccupationIntervention,
} from '../types/intervention.types';
import { formatDateTime, formatNumber } from './InterventionTable';

type Props = {
  interventionEtat?: string | null;
  occupations?: OccupationIntervention[];
  loading?: boolean;
  onCreate: (data: CreateOccupationInterventionDto) => void;
  onDelete: (idOccupation: number) => void;
};

export function OccupationSection({
  interventionEtat,
  occupations = [],
  loading = false,
  onCreate,
  onDelete,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [idTechnicien, setIdTechnicien] = useState('');
  const [idOperation, setIdOperation] = useState('');
  const [dateOccupation, setDateOccupation] = useState('');
  const [duree, setDuree] = useState('');
  const [natureOccupation, setNatureOccupation] = useState('NORMAL');
  const [typeHoraire, setTypeHoraire] = useState('JOURNEE');
  const [commentaire, setCommentaire] = useState('');

  const canEdit = interventionEtat === 'EN_COURS';

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateOccupationInterventionDto = {
      idTechnicien: parseOptionalInt(idTechnicien),
      idOperation: parseOptionalInt(idOperation),
      dateOccupation: localDateToIso(dateOccupation) ?? new Date().toISOString(),
      duree: Number(duree),
      natureOccupation: natureOccupation || undefined,
      typeHoraire: typeHoraire || undefined,
      commentaire: commentaire || undefined,
      createdBy: 'Admin',
    };

    onCreate(payload);
    setShowForm(false);
    setDateOccupation('');
    setDuree('');
    setCommentaire('');
  }

  return (
    <AppSection title="Occupations">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-bold text-slate-500">
          Saisie du temps passe par technicien. Autorisee uniquement en EN_COURS.
        </p>
        <button
          type="button"
          disabled={!canEdit || loading}
          onClick={() => setShowForm((current) => !current)}
          className={appSecondaryButtonClassName}
        >
          <Plus size={17} />
          Ajouter occupation
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={submit}
          className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4"
        >
          <input
            type="number"
            value={idTechnicien}
            onChange={(event) => setIdTechnicien(event.target.value)}
            className={appInputClassName}
            placeholder="ID technicien"
          />
          <input
            type="number"
            value={idOperation}
            onChange={(event) => setIdOperation(event.target.value)}
            className={appInputClassName}
            placeholder="ID operation"
          />
          <input
            type="datetime-local"
            value={dateOccupation}
            onChange={(event) => setDateOccupation(event.target.value)}
            className={appInputClassName}
            required
          />
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={duree}
            onChange={(event) => setDuree(event.target.value)}
            className={appInputClassName}
            placeholder="Duree h"
            required
          />
          <input
            value={natureOccupation}
            onChange={(event) => setNatureOccupation(event.target.value)}
            className={appInputClassName}
            placeholder="Nature"
          />
          <input
            value={typeHoraire}
            onChange={(event) => setTypeHoraire(event.target.value)}
            className={appInputClassName}
            placeholder="Type horaire"
          />
          <input
            value={commentaire}
            onChange={(event) => setCommentaire(event.target.value)}
            className={appInputClassName}
            placeholder="Commentaire"
          />
          <button
            type="submit"
            disabled={loading}
            className={appPrimaryButtonClassName}
          >
            Ajouter
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Technicien</th>
              <th className="py-3 pr-4">Operation</th>
              <th className="py-3 pr-4">Duree</th>
              <th className="py-3 pr-4">Nature</th>
              <th className="py-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {occupations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-6 text-center text-sm font-bold text-slate-500"
                >
                  Aucune occupation saisie.
                </td>
              </tr>
            ) : (
              occupations.map((occupation) => (
                <tr key={occupation.idOccupation} className="text-sm">
                  <td className="py-3 pr-4 font-bold text-slate-700">
                    {formatDateTime(occupation.dateOccupation)}
                  </td>
                  <td className="py-3 pr-4 font-black text-slate-950">
                    {occupation.technicien?.nom ||
                      occupation.technicien?.matricule ||
                      occupation.idTechnicien ||
                      '-'}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-600">
                    {occupation.operation?.libelle ||
                      occupation.idOperation ||
                      '-'}
                  </td>
                  <td className="py-3 pr-4 font-bold text-slate-700">
                    {formatNumber(occupation.duree)} h
                  </td>
                  <td className="py-3 pr-4 font-bold text-slate-700">
                    {occupation.natureOccupation || '-'}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      type="button"
                      disabled={!canEdit || loading}
                      onClick={() => onDelete(occupation.idOccupation)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppSection>
  );
}

function parseOptionalInt(value: string) {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function localDateToIso(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}
