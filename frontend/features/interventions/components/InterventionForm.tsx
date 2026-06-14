'use client';

import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  AppFormField,
  appInputClassName,
  appPrimaryButtonClassName,
  appSecondaryButtonClassName,
  appSelectClassName,
  appTextareaClassName,
} from '@/components/app-section-layout';

import {
  getApiErrorMessage,
  getInterventionReferenceData,
} from '../services/intervention.service';
import type {
  CreateInterventionDto,
  Intervention,
  InterventionReferenceData,
  PlanPreventifDeclencheurLite,
  UpdateInterventionDto,
} from '../types/intervention.types';

type FormValues = {
  code: string;
  libelle: string;
  description: string;
  typeMaintenance: string;
  typeIntervention: string;
  natureIntervention: string;
  priorite: string;
  criticite: string;
  centreCout: string;
  idMateriel: string;
  idPointStructure: string;
  idDemande: string;
  idGamme: string;
  idEquipe: string;
  idPlanPreventif: string;
  idPlanPreventifDeclencheur: string;
  dateDebutPrevue: string;
  dateFinPrevue: string;
  dateSouhaiteeFin: string;
  chargePrevue: string;
  tempsArretPrevu: string;
  materielEnPanne: boolean;
  materielIndisponible: boolean;
  arretMateriel: boolean;
  receptionTravaux: boolean;
  symptome: string;
  cause: string;
  remede: string;
  diagnosticInitial: string;
  instructions: string;
  createdBy: string;
};

type Props = {
  initialIntervention?: Intervention | null;
  submitLabel?: string;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit: (data: CreateInterventionDto | UpdateInterventionDto) => void;
};

const emptyReferences: InterventionReferenceData = {
  materiels: [],
  pointsStructure: [],
  demandes: [],
  plansPreventifs: [],
  declencheurs: [],
  gammes: [],
  equipes: [],
  techniciens: [],
  articles: [],
  magasins: [],
};

const inputClassName = `${appInputClassName} min-w-0`;
const selectClassName = `${appSelectClassName} min-w-0 truncate`;
const textareaClassName = `${appTextareaClassName} min-w-0`;

export function InterventionForm({
  initialIntervention,
  submitLabel = 'Enregistrer',
  loading = false,
  onCancel,
  onSubmit,
}: Props) {
  const initialValues = useMemo<FormValues>(
    () => ({
      code: initialIntervention?.code ?? '',
      libelle: initialIntervention?.libelle ?? '',
      description: initialIntervention?.description ?? '',
      typeMaintenance: initialIntervention?.typeMaintenance ?? 'CORRECTIF',
      typeIntervention: initialIntervention?.typeIntervention ?? 'TRAVAUX',
      natureIntervention: initialIntervention?.natureIntervention ?? 'CURATIF',
      priorite: initialIntervention?.priorite ?? 'NORMALE',
      criticite: initialIntervention?.criticite ?? 'MOYENNE',
      centreCout: initialIntervention?.centreCout ?? '',
      idMateriel: toInputValue(initialIntervention?.idMateriel),
      idPointStructure: toInputValue(initialIntervention?.idPointStructure),
      idDemande: toInputValue(initialIntervention?.idDemande),
      idGamme: toInputValue(initialIntervention?.idGamme),
      idEquipe: toInputValue(initialIntervention?.idEquipe),
      idPlanPreventif: toInputValue(initialIntervention?.idPlanPreventif),
      idPlanPreventifDeclencheur: toInputValue(
        initialIntervention?.idPlanPreventifDeclencheur,
      ),
      dateDebutPrevue: toDateTimeLocal(initialIntervention?.dateDebutPrevue),
      dateFinPrevue: toDateTimeLocal(initialIntervention?.dateFinPrevue),
      dateSouhaiteeFin: toDateTimeLocal(initialIntervention?.dateSouhaiteeFin),
      chargePrevue: toInputValue(initialIntervention?.chargePrevue),
      tempsArretPrevu: toInputValue(initialIntervention?.tempsArretPrevu),
      materielEnPanne: Boolean(initialIntervention?.materielEnPanne),
      materielIndisponible: Boolean(initialIntervention?.materielIndisponible),
      arretMateriel: Boolean(initialIntervention?.arretMateriel),
      receptionTravaux: Boolean(initialIntervention?.receptionTravaux),
      symptome: initialIntervention?.symptome ?? '',
      cause: initialIntervention?.cause ?? '',
      remede: initialIntervention?.remede ?? '',
      diagnosticInitial: initialIntervention?.diagnosticInitial ?? '',
      instructions: initialIntervention?.instructions ?? '',
      createdBy: initialIntervention?.createdBy ?? 'Admin',
    }),
    [initialIntervention],
  );

  const [values, setValues] = useState<FormValues>(initialValues);
  const [references, setReferences] =
    useState<InterventionReferenceData>(emptyReferences);
  const [referenceError, setReferenceError] = useState('');

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    let mounted = true;

    getInterventionReferenceData()
      .then((data) => {
        if (mounted) {
          setReferences(data);
          setReferenceError('');
        }
      })
      .catch((error) => {
        if (mounted) {
          setReferenceError(
            getApiErrorMessage(error, 'Impossible de charger les listes.'),
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const declencheursForPlan = useMemo(() => {
    if (!values.idPlanPreventif) return references.declencheurs;

    return references.declencheurs.filter(
      (declencheur) =>
        String(declencheur.idPlanPreventif) === values.idPlanPreventif,
    );
  }, [references.declencheurs, values.idPlanPreventif]);

  function updateValue<K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleMaterielChange(value: string) {
    const materiel = references.materiels.find(
      (item) => String(item.idMateriel) === value,
    );

    setValues((current) => ({
      ...current,
      idMateriel: value,
      idPointStructure: value
        ? toInputValue(materiel?.idPointStructure)
        : '',
    }));
  }

  function handlePlanChange(value: string) {
    const plan = references.plansPreventifs.find(
      (item) => String(item.idPlanPreventif) === value,
    );
    const declencheur =
      plan?.plan_preventif_declencheur?.[0] ??
      references.declencheurs.find(
        (item) => String(item.idPlanPreventif) === value,
      );

    setValues((current) => ({
      ...current,
      idPlanPreventif: value,
      idPointStructure: toInputValue(plan?.idPointStructure) || current.idPointStructure,
      idPlanPreventifDeclencheur: toInputValue(
        declencheur?.idPlanPreventifDeclencheur,
      ),
      idGamme: toInputValue(declencheur?.idGamme) || current.idGamme,
    }));
  }

  function handleDeclencheurChange(value: string) {
    const declencheur = references.declencheurs.find(
      (item) => String(item.idPlanPreventifDeclencheur) === value,
    );

    setValues((current) => ({
      ...current,
      idPlanPreventifDeclencheur: value,
      idPlanPreventif:
        toInputValue(declencheur?.idPlanPreventif) || current.idPlanPreventif,
      idMateriel: toInputValue(declencheur?.idMateriel) || current.idMateriel,
      idPointStructure:
        toInputValue(declencheur?.idPointStructure) || current.idPointStructure,
      idGamme: toInputValue(declencheur?.idGamme) || current.idGamme,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateInterventionDto | UpdateInterventionDto = {
      code: emptyToUndefined(values.code),
      libelle: emptyToUndefined(values.libelle),
      description: emptyToUndefined(values.description),
      typeMaintenance: values.typeMaintenance,
      typeIntervention: emptyToUndefined(values.typeIntervention),
      natureIntervention: emptyToUndefined(values.natureIntervention),
      priorite: emptyToUndefined(values.priorite),
      criticite: emptyToUndefined(values.criticite),
      centreCout: emptyToUndefined(values.centreCout),
      idMateriel: parseOptionalInt(values.idMateriel),
      idPointStructure: parseOptionalInt(values.idPointStructure),
      idDemande: parseOptionalInt(values.idDemande),
      idGamme: parseOptionalInt(values.idGamme),
      idEquipe: parseOptionalInt(values.idEquipe),
      idPlanPreventif: parseOptionalInt(values.idPlanPreventif),
      idPlanPreventifDeclencheur: parseOptionalInt(
        values.idPlanPreventifDeclencheur,
      ),
      dateDebutPrevue: localDateToIso(values.dateDebutPrevue),
      dateFinPrevue: localDateToIso(values.dateFinPrevue),
      dateSouhaiteeFin: localDateToIso(values.dateSouhaiteeFin),
      chargePrevue: parseOptionalNumber(values.chargePrevue),
      tempsArretPrevu: parseOptionalNumber(values.tempsArretPrevu),
      materielEnPanne: values.materielEnPanne,
      materielIndisponible: values.materielIndisponible,
      arretMateriel: values.arretMateriel,
      receptionTravaux: values.receptionTravaux,
      symptome: emptyToUndefined(values.symptome),
      cause: emptyToUndefined(values.cause),
      remede: emptyToUndefined(values.remede),
      diagnosticInitial: emptyToUndefined(values.diagnosticInitial),
      instructions: emptyToUndefined(values.instructions),
      createdBy: initialIntervention
        ? undefined
        : emptyToUndefined(values.createdBy),
    };

    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[1120px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
    >
      <div className="grid min-w-0 gap-x-5 px-6 py-5 md:grid-cols-2 xl:grid-cols-3">
        {referenceError && (
          <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 md:col-span-2 xl:col-span-3">
            {referenceError}
          </div>
        )}

        <AppFormField label="Code">
          <input
            value={values.code}
            onChange={(event) => updateValue('code', event.target.value)}
            className={inputClassName}
            placeholder="Auto si vide"
          />
        </AppFormField>

        <AppFormField label="Libelle">
          <input
            value={values.libelle}
            onChange={(event) => updateValue('libelle', event.target.value)}
            className={inputClassName}
            placeholder="Ex: Remplacement roulement"
          />
        </AppFormField>

        <AppFormField label="Type maintenance" required>
          <select
            value={values.typeMaintenance}
            onChange={(event) =>
              updateValue('typeMaintenance', event.target.value)
            }
            className={selectClassName}
          >
            <option value="CORRECTIF">Correctif</option>
            <option value="PREVENTIF">Preventif</option>
            <option value="CONDITIONNEL">Conditionnel</option>
          </select>
        </AppFormField>

        <AppFormField label="Materiel">
          <select
            value={values.idMateriel}
            onChange={(event) => handleMaterielChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">Selectionner un materiel</option>
            {renderMissingOption(
              values.idMateriel,
              references.materiels.some(
                (materiel) => String(materiel.idMateriel) === values.idMateriel,
              ),
              'Materiel',
            )}
            {references.materiels.map((materiel) => (
              <option key={materiel.idMateriel} value={materiel.idMateriel}>
                {formatCodeLibelle(
                  materiel.code,
                  materiel.libelle,
                  materiel.idMateriel,
                )}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Point structure">
          <select
            value={values.idPointStructure}
            onChange={(event) =>
              updateValue('idPointStructure', event.target.value)
            }
            className={selectClassName}
          >
            <option value="">Auto depuis le materiel</option>
            {renderMissingOption(
              values.idPointStructure,
              references.pointsStructure.some(
                (point) => String(point.idPoint) === values.idPointStructure,
              ),
              'Point structure',
            )}
            {references.pointsStructure.map((point) => (
              <option key={point.idPoint} value={point.idPoint}>
                {formatCodeLibelle(point.code, point.libelle, point.idPoint)}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Demande intervention">
          <select
            value={values.idDemande}
            onChange={(event) => updateValue('idDemande', event.target.value)}
            className={selectClassName}
          >
            <option value="">Aucune demande liee</option>
            {renderMissingOption(
              values.idDemande,
              references.demandes.some(
                (demande) => String(demande.idDemande) === values.idDemande,
              ),
              'Demande',
            )}
            {references.demandes.map((demande) => (
              <option key={demande.idDemande} value={demande.idDemande}>
                {formatDemandeLabel(demande)}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Plan preventif">
          <select
            value={values.idPlanPreventif}
            onChange={(event) => handlePlanChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">Aucun plan preventif</option>
            {renderMissingOption(
              values.idPlanPreventif,
              references.plansPreventifs.some(
                (plan) =>
                  String(plan.idPlanPreventif) === values.idPlanPreventif,
              ),
              'Plan preventif',
            )}
            {references.plansPreventifs.map((plan) => (
              <option key={plan.idPlanPreventif} value={plan.idPlanPreventif}>
                {formatCodeLibelle(plan.code, plan.libelle, plan.idPlanPreventif)}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Declencheur plan">
          <select
            value={values.idPlanPreventifDeclencheur}
            onChange={(event) => handleDeclencheurChange(event.target.value)}
            className={selectClassName}
          >
            <option value="">Auto depuis le plan si possible</option>
            {renderMissingOption(
              values.idPlanPreventifDeclencheur,
              declencheursForPlan.some(
                (declencheur) =>
                  String(declencheur.idPlanPreventifDeclencheur) ===
                  values.idPlanPreventifDeclencheur,
              ),
              'Declencheur',
            )}
            {declencheursForPlan.map((declencheur) => (
              <option
                key={declencheur.idPlanPreventifDeclencheur}
                value={declencheur.idPlanPreventifDeclencheur}
              >
                {formatDeclencheurLabel(declencheur)}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Gamme">
          <select
            value={values.idGamme}
            onChange={(event) => updateValue('idGamme', event.target.value)}
            className={selectClassName}
          >
            <option value="">Auto depuis le declencheur si possible</option>
            {renderMissingOption(
              values.idGamme,
              references.gammes.some(
                (gamme) => String(gamme.idGamme) === values.idGamme,
              ),
              'Gamme',
            )}
            {references.gammes.map((gamme) => (
              <option key={gamme.idGamme} value={gamme.idGamme}>
                {formatCodeLibelle(gamme.code, gamme.libelle, gamme.idGamme)}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Equipe">
          <select
            value={values.idEquipe}
            onChange={(event) => updateValue('idEquipe', event.target.value)}
            className={selectClassName}
          >
            <option value="">Aucune equipe</option>
            {renderMissingOption(
              values.idEquipe,
              references.equipes.some(
                (equipe) => String(equipe.idEquipe) === values.idEquipe,
              ),
              'Equipe',
            )}
            {references.equipes.map((equipe) => (
              <option key={equipe.idEquipe} value={equipe.idEquipe}>
                {formatCodeLibelle(equipe.code, equipe.libelle, equipe.idEquipe)}
              </option>
            ))}
          </select>
        </AppFormField>

        <AppFormField label="Type intervention">
          <input
            value={values.typeIntervention}
            onChange={(event) =>
              updateValue('typeIntervention', event.target.value)
            }
            className={inputClassName}
            placeholder="TRAVAUX, CONTROLE..."
          />
        </AppFormField>

        <AppFormField label="Nature">
          <input
            value={values.natureIntervention}
            onChange={(event) =>
              updateValue('natureIntervention', event.target.value)
            }
            className={inputClassName}
            placeholder="CURATIF, PREVENTIF..."
          />
        </AppFormField>

        <AppFormField label="Priorite">
          <select
            value={values.priorite}
            onChange={(event) => updateValue('priorite', event.target.value)}
            className={selectClassName}
          >
            <option value="BASSE">Basse</option>
            <option value="NORMALE">Normale</option>
            <option value="HAUTE">Haute</option>
            <option value="URGENTE">Urgente</option>
          </select>
        </AppFormField>

        <AppFormField label="Criticite">
          <select
            value={values.criticite}
            onChange={(event) => updateValue('criticite', event.target.value)}
            className={selectClassName}
          >
            <option value="FAIBLE">Faible</option>
            <option value="MOYENNE">Moyenne</option>
            <option value="ELEVEE">Elevee</option>
            <option value="CRITIQUE">Critique</option>
          </select>
        </AppFormField>

        <AppFormField label="Centre cout">
          <input
            value={values.centreCout}
            onChange={(event) => updateValue('centreCout', event.target.value)}
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Debut prevu">
          <input
            type="datetime-local"
            value={values.dateDebutPrevue}
            onChange={(event) =>
              updateValue('dateDebutPrevue', event.target.value)
            }
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Fin prevue">
          <input
            type="datetime-local"
            value={values.dateFinPrevue}
            onChange={(event) =>
              updateValue('dateFinPrevue', event.target.value)
            }
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Date souhaitee fin">
          <input
            type="datetime-local"
            value={values.dateSouhaiteeFin}
            onChange={(event) =>
              updateValue('dateSouhaiteeFin', event.target.value)
            }
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Charge prevue">
          <input
            type="number"
            step="0.01"
            value={values.chargePrevue}
            onChange={(event) =>
              updateValue('chargePrevue', event.target.value)
            }
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Temps arret prevu">
          <input
            type="number"
            step="0.01"
            value={values.tempsArretPrevu}
            onChange={(event) =>
              updateValue('tempsArretPrevu', event.target.value)
            }
            className={inputClassName}
          />
        </AppFormField>

        <div className="md:col-span-2 xl:col-span-3">
          <AppFormField label="Description">
            <textarea
              value={values.description}
              onChange={(event) =>
                updateValue('description', event.target.value)
              }
              className={textareaClassName}
            />
          </AppFormField>
        </div>

        <div className="grid gap-3 border-b border-slate-200/70 py-4 md:col-span-2 md:grid-cols-2 xl:col-span-3 xl:grid-cols-4">
          <CheckboxField
            label="Materiel en panne"
            checked={values.materielEnPanne}
            onChange={(checked) => updateValue('materielEnPanne', checked)}
          />
          <CheckboxField
            label="Materiel indisponible"
            checked={values.materielIndisponible}
            onChange={(checked) =>
              updateValue('materielIndisponible', checked)
            }
          />
          <CheckboxField
            label="Arret materiel"
            checked={values.arretMateriel}
            onChange={(checked) => updateValue('arretMateriel', checked)}
          />
          <CheckboxField
            label="Reception travaux"
            checked={values.receptionTravaux}
            onChange={(checked) => updateValue('receptionTravaux', checked)}
          />
        </div>

        <AppFormField label="Symptome">
          <input
            value={values.symptome}
            onChange={(event) => updateValue('symptome', event.target.value)}
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Cause">
          <input
            value={values.cause}
            onChange={(event) => updateValue('cause', event.target.value)}
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Remede">
          <input
            value={values.remede}
            onChange={(event) => updateValue('remede', event.target.value)}
            className={inputClassName}
          />
        </AppFormField>

        <AppFormField label="Cree par">
          <input
            value={values.createdBy}
            onChange={(event) => updateValue('createdBy', event.target.value)}
            className={inputClassName}
            disabled={Boolean(initialIntervention)}
          />
        </AppFormField>

        <div className="md:col-span-2 xl:col-span-3">
          <AppFormField label="Diagnostic initial">
            <textarea
              value={values.diagnosticInitial}
              onChange={(event) =>
                updateValue('diagnosticInitial', event.target.value)
              }
              className={textareaClassName}
            />
          </AppFormField>
        </div>

        <div className="md:col-span-2 xl:col-span-3">
          <AppFormField label="Instructions">
            <textarea
              value={values.instructions}
              onChange={(event) =>
                updateValue('instructions', event.target.value)
              }
              className={textareaClassName}
            />
          </AppFormField>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={appSecondaryButtonClassName}
          >
            Annuler
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !values.typeMaintenance}
          className={appPrimaryButtonClassName}
        >
          {loading ? 'Enregistrement...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 shrink-0 accent-[#06475a]"
      />
      <span className="min-w-0 truncate">{label}</span>
    </label>
  );
}

function renderMissingOption(value: string, exists: boolean, label: string) {
  if (!value || exists) return null;
  return <option value={value}>{label} actuel #{value}</option>;
}

function formatCodeLibelle(
  code?: string | null,
  libelle?: string | null,
  id?: number | null,
) {
  return [code, libelle].filter(Boolean).join(' - ') || `#${id ?? ''}`;
}

function formatDemandeLabel(demande: {
  idDemande: number;
  code?: string | null;
  description?: string | null;
}) {
  return (
    [demande.code, demande.description].filter(Boolean).join(' - ') ||
    `DI #${demande.idDemande}`
  );
}

function formatDeclencheurLabel(declencheur: PlanPreventifDeclencheurLite) {
  const periodicite = [
    declencheur.periodiciteValeur,
    declencheur.periodiciteUnite,
  ]
    .filter(Boolean)
    .join(' ');
  const gamme = declencheur.gamme
    ? formatCodeLibelle(
        declencheur.gamme.code,
        declencheur.gamme.libelle,
        declencheur.gamme.idGamme,
      )
    : '';

  return (
    [
      declencheur.typeDeclencheur,
      periodicite || null,
      gamme ? `Gamme ${gamme}` : null,
    ]
      .filter(Boolean)
      .join(' - ') || `Declencheur #${declencheur.idPlanPreventifDeclencheur}`
  );
}

function emptyToUndefined(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseOptionalInt(value: string) {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function parseOptionalNumber(value: string) {
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

function toInputValue(value?: number | string | null) {
  return value === null || value === undefined ? '' : String(value);
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}
