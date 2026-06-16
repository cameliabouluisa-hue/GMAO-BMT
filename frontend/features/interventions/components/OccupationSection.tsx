

import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

import {
  AppSection,
  appInputClassName,
  appPrimaryButtonClassName,
  appSelectClassName,
  appSecondaryButtonClassName,
} from '@/components/app-section-layout';

import { getApiErrorMessage } from '../services/intervention.service';
import type {
  AffectationTechnicien,
  CreateOccupationInterventionDto,
  OccupationIntervention,
  OperationIntervention,
} from '../types/intervention.types';
import { formatDateTime, formatNumber } from './InterventionTable';

type Props = {
  interventionEtat?: string | null;
  occupations?: OccupationIntervention[];
  affectations?: AffectationTechnicien[];
  operations?: OperationIntervention[];
  loading?: boolean;
  onCreate: (data: CreateOccupationInterventionDto) => void | Promise<void>;
  onDelete: (idOccupation: number) => void | Promise<void>;
};

const EMPTY_FORM = {
  idTechnicien: '',
  idOperation: '',
  dateOccupation: '',
  duree: '',
  natureOccupation: 'NORMAL',
  typeHoraire: 'JOURNEE',
  commentaire: '',
};

export function OccupationSection({
  interventionEtat,
  occupations = [],
  affectations = [],
  operations = [],
  loading = false,
  onCreate,
  onDelete,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const etat = (interventionEtat || '').toUpperCase();
  const canCreate = etat === 'EN_COURS';

  const techniciensAffectes = affectations
    .map((affectation) => affectation.technicien)
    .filter(Boolean);

  async function handleSubmit() {
    if (!form.idTechnicien) {
      setError('Veuillez sélectionner un technicien affecté à cette OT.');
      return;
    }

    if (!form.dateOccupation) {
      setError('Veuillez saisir la date d’occupation.');
      return;
    }

    if (!form.duree || Number(form.duree) <= 0) {
      setError('Veuillez saisir une durée valide.');
      return;
    }

    try {
      setError('');

      await onCreate({
        idTechnicien: Number(form.idTechnicien),
        idOperation: form.idOperation ? Number(form.idOperation) : undefined,
        dateOccupation: form.dateOccupation,
        duree: Number(form.duree),
        natureOccupation: form.natureOccupation,
        typeHoraire: form.typeHoraire,
        commentaire: form.commentaire.trim() || undefined,
      });

      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible d'ajouter l'occupation."),
      );
    }
  }

  async function handleDelete(idOccupation: number) {
    const confirmed = window.confirm(
      'Voulez-vous supprimer cette occupation ?',
    );

    if (!confirmed) return;

    try {
      setError('');
      await onDelete(idOccupation);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Impossible de supprimer l'occupation."),
      );
    }
  }

  return (
    <AppSection title="Occupations">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-bold text-slate-500">
          Saisie du temps réel passé par les techniciens affectés.
          Autorisée uniquement en EN_COURS.
        </p>

        {canCreate && (
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            disabled={loading}
            className={`${appSecondaryButtonClassName} w-fit disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {showForm ? <X size={17} /> : <Plus size={17} />}
            {showForm ? 'Fermer' : 'Ajouter occupation'}
          </button>
        )}
      </div>

      {!canCreate && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
          Les occupations sont saisies uniquement lorsque l’OT est en cours.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {showForm && canCreate && (
        <div className="mb-5 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <select
              value={form.idTechnicien}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  idTechnicien: event.target.value,
                }))
              }
              disabled={loading}
              className={appSelectClassName}
            >
              <option value="">Sélectionner un technicien affecté</option>

              {techniciensAffectes.map((technicien) => (
                <option
                  key={technicien!.idTechnicien}
                  value={technicien!.idTechnicien}
                >
                  {[technicien!.nom, technicien!.matricule]
                    .filter(Boolean)
                    .join(' - ') || `Technicien #${technicien!.idTechnicien}`}
                </option>
              ))}
            </select>

            <select
              value={form.idOperation}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  idOperation: event.target.value,
                }))
              }
              disabled={loading}
              className={appSelectClassName}
            >
              <option value="">Opération optionnelle</option>

              {operations.map((operation) => (
                <option
                  key={operation.idOperation}
                  value={operation.idOperation}
                >
                  {[
                    operation.ordre ? `#${operation.ordre}` : null,
                    operation.libelle,
                  ]
                    .filter(Boolean)
                    .join(' - ') || `Opération #${operation.idOperation}`}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={form.dateOccupation}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  dateOccupation: event.target.value,
                }))
              }
              disabled={loading}
              className={appInputClassName}
            />

            <input
              type="number"
              min="0"
              step="0.5"
              value={form.duree}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  duree: event.target.value,
                }))
              }
              disabled={loading}
              className={appInputClassName}
              placeholder="Durée h"
            />

            <select
              value={form.natureOccupation}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  natureOccupation: event.target.value,
                }))
              }
              disabled={loading}
              className={appSelectClassName}
            >
              <option value="NORMAL">Normal</option>
              <option value="DEPANNAGE">Dépannage</option>
              <option value="DEPLACEMENT">Déplacement</option>
              <option value="CONTROLE">Contrôle</option>
            </select>

            <select
              value={form.typeHoraire}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  typeHoraire: event.target.value,
                }))
              }
              disabled={loading}
              className={appSelectClassName}
            >
              <option value="JOURNEE">Journée</option>
              <option value="NUIT">Nuit</option>
              <option value="HEURE_SUP">Heure supplémentaire</option>
            </select>

            <input
              type="text"
              value={form.commentaire}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  commentaire: event.target.value,
                }))
              }
              disabled={loading}
              className={appInputClassName}
              placeholder="Commentaire"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`${appPrimaryButtonClassName} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Ajouter
            </button>
          </div>

          {techniciensAffectes.length === 0 && (
            <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              Aucun technicien n’est affecté à cette intervention.
              Affectez d’abord les techniciens avant de saisir les occupations.
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3 pr-4 align-middle">Date</th>
              <th className="py-3 pr-4 align-middle">Technicien</th>
              <th className="py-3 pr-4 align-middle">Opération</th>
              <th className="py-3 pr-4 align-middle">Durée</th>
              <th className="py-3 pr-4 align-middle">Nature</th>
              <th className="py-3 pr-4 align-middle">Type horaire</th>
              <th className="py-3 pr-4 text-right align-middle">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {occupations.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-sm font-bold text-slate-500"
                >
                  Aucune occupation saisie pour cette intervention.
                </td>
              </tr>
            ) : (
              occupations.map((occupation) => (
                <tr key={occupation.idOccupation} className="text-sm">
                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {formatDateTime(occupation.dateOccupation)}
                  </td>

                  <td className="max-w-[220px] py-3 pr-4 align-middle font-black text-slate-950">
                    <span className="block truncate">
                      {occupation.technicien?.nom ||
                        occupation.idTechnicien ||
                        '-'}
                    </span>
                  </td>

                  <td className="max-w-[260px] py-3 pr-4 align-middle font-bold text-slate-700">
                    <span className="block truncate">
                      {occupation.operation?.libelle ||
                        occupation.idOperation ||
                        '-'}
                    </span>
                  </td>

                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {formatNumber(occupation.duree)} h
                  </td>

                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {occupation.natureOccupation || '-'}
                  </td>

                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {occupation.typeHoraire || '-'}
                  </td>

                  <td className="py-3 pr-4 text-right align-middle">
                    {canCreate ? (
                      <button
                        type="button"
                        onClick={() => handleDelete(occupation.idOccupation)}
                        disabled={loading}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Supprimer l’occupation"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        -
                      </span>
                    )}
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