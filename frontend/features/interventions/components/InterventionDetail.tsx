import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RefreshCcw, UserPlus, Users ,Trash2} from 'lucide-react';

import {
  AppFieldGrid,
  AppReadField,
  AppSection,
  appInputClassName,
  appPrimaryButtonClassName,
  appSecondaryButtonClassName,
  appSelectClassName,
} from '@/components/app-section-layout';

import {
  getApiErrorMessage,
  getInterventionReferenceData,
} from '../services/intervention.service';
import type {
  AffecterEquipeDto,
  AffecterTechnicienDto,
  CreateConsommationInterventionDto,
  CreateOccupationInterventionDto,
  Intervention,
  InterventionReferenceData,
  RefuserTravauxDto,
  UpsertCompteRenduInterventionDto,
  CreateOperationInterventionDto,
} from '../types/intervention.types';
import {
  Badge,
  EtatBadge,
  formatDateTime,
  formatEtat,
  formatNumber,
  formatType,
  
} from './InterventionTable';
import { InterventionWorkflowActions } from './InterventionWorkflowActions';
import { OperationsSection } from './OperationsSection';
import { OccupationSection } from './OccupationSection';
import { CompteRenduSection } from './CompteRenduSection';
import { ConsommationSection } from './ConsommationSection';

type Props = {
  intervention: Intervention;
  actionLoading?: boolean;
  onRefresh: () => void;
  onDemanderValidation: () => void;
  onValider: () => void;
  onRefuser: () => void;
  onDemarrer: () => void;
  onAttenteFourniture: () => void;
  onTerminer: () => void;
  onAccepterTravaux: () => void;
  onRefuserTravaux: (data: RefuserTravauxDto) => void;
  onReprendre: () => void;
  onSolder: () => void;
  onAnnuler: () => void;
  onArchiver: () => void;
  onAffecterEquipe: (data: AffecterEquipeDto) => void | Promise<void>;
  onAffecterTechnicien: (data: AffecterTechnicienDto) => void | Promise<void>;
  onCreateOccupation: (data: CreateOccupationInterventionDto) => void;
  onDeleteOccupation: (idOccupation: number) => void;
  onSaveCompteRendu: (data: UpsertCompteRenduInterventionDto) => void;
  onCreateConsommation: (data: CreateConsommationInterventionDto) => void;
  onCancelConsommation: (idConsommation: number) => void;
  onCreateOperation: (data: CreateOperationInterventionDto) => void | Promise<void>;
onDeleteOperation: (idOperation: number) => void | Promise<void>;
onFournituresDisponibles: () => void;
onDeleteAffectationTechnicien: (
  idAffectation: number,
) => void | Promise<void>;
};

export function InterventionDetail({
  intervention,
  actionLoading = false,
  onRefresh,
  onDemanderValidation,
  onValider,
  onRefuser,
  onDemarrer,
  onAttenteFourniture,
  onTerminer,
  onAccepterTravaux,
  onRefuserTravaux,
  onReprendre,
  onSolder,
  onAnnuler,
  onArchiver,
  onAffecterEquipe,
  onAffecterTechnicien,
  onCreateOccupation,
  onDeleteOccupation,
  onSaveCompteRendu,
  onCreateConsommation,
  onCancelConsommation,
  onCreateOperation,
onDeleteOperation,
onDeleteAffectationTechnicien,
onFournituresDisponibles,
}: Props) {
  const canModify = intervention.etat === 'EN_PREPARATION';

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 bg-[#06475a] px-7 py-6 text-white md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/60">
            Intervention
          </p>

          <h1 className="mt-1 text-3xl font-black">
            {intervention.code ||
              `OT-${String(intervention.idIntervention).padStart(6, '0')}`}
          </h1>

          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-white/80">
            {intervention.libelle ||
              intervention.description ||
              'Aucun libelle renseigne.'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex w-fit rounded-xl bg-white/15 px-3 py-1.5 text-xs font-black text-white">
              {formatType(intervention.typeMaintenance)}
            </span>

            <span className="inline-flex w-fit rounded-xl bg-white/15 px-3 py-1.5 text-xs font-black text-white">
              {formatEtat(intervention.etat)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/maintenance/interventions"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 text-sm font-black text-white transition hover:bg-white/20"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>

          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/15 px-5 text-sm font-black text-white transition hover:bg-white/20"
          >
            <RefreshCcw size={18} />
            Actualiser
          </button>

          {canModify && (
            <Link
              href={`/maintenance/interventions/${intervention.idIntervention}/modifier`}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-[#06475a] transition hover:bg-slate-50"
            >
              Modifier
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-6 px-7 py-6">
        <InterventionWorkflowActions
          intervention={intervention}
          actionLoading={actionLoading}
          onDemanderValidation={onDemanderValidation}
          onValider={onValider}
          onRefuser={onRefuser}
          onDemarrer={onDemarrer}
          onAttenteFourniture={onAttenteFourniture}
          onTerminer={onTerminer}
          onAccepterTravaux={onAccepterTravaux}
          onRefuserTravaux={() =>
            onRefuserTravaux({
              utilisateur: 'Admin',
              motifRefusTravaux: 'Travaux refuses',
            })
          }
          onReprendre={onReprendre}
          onSolder={onSolder}
          onAnnuler={onAnnuler}
          onArchiver={onArchiver}
          onFournituresDisponibles={onFournituresDisponibles}
        />

        <GeneralSection intervention={intervention} />

        <AffectationSection
  intervention={intervention}
  loading={actionLoading}
  onAffecterEquipe={onAffecterEquipe}
  onAffecterTechnicien={onAffecterTechnicien}
  onDeleteAffectationTechnicien={onDeleteAffectationTechnicien}
  onRefresh={onRefresh}
/>
<OperationsSection
  interventionEtat={intervention.etat}
  operations={intervention.operation_intervention}
  loading={actionLoading}
  onCreate={onCreateOperation}
  onDelete={onDeleteOperation}
/>

        <OccupationSection
  interventionEtat={intervention.etat}
  occupations={intervention.occupations}
  affectations={intervention.affectation_technicien}
  operations={intervention.operation_intervention}
  loading={actionLoading}
  onCreate={onCreateOccupation}
  onDelete={onDeleteOccupation}
/>

        <CompteRenduSection
          interventionEtat={intervention.etat}
          compteRendu={intervention.compteRendu}
          loading={actionLoading}
          onSave={onSaveCompteRendu}
        />

        <ConsommationSection
          interventionEtat={intervention.etat}
          consommations={intervention.consommations}
          loading={actionLoading}
          onCreate={onCreateConsommation}
          onCancel={onCancelConsommation}
        />

        <HistorySection intervention={intervention} />
      </div>
    </div>
  );
}

function GeneralSection({ intervention }: { intervention: Intervention }) {
  return (
    <AppSection title="Informations generales">
      <AppFieldGrid>
        <AppReadField label="Identifiant" value={intervention.idIntervention} />
        <AppReadField label="Code" value={intervention.code} />
        <AppReadField
          label="Etat"
          value={<EtatBadge etat={intervention.etat} />}
        />
        <AppReadField
          label="Type maintenance"
          value={formatType(intervention.typeMaintenance)}
        />
        <AppReadField
          label="Type intervention"
          value={intervention.typeIntervention}
        />
        <AppReadField label="Nature" value={intervention.natureIntervention} />
        <AppReadField
          label="Priorite"
          value={<Badge tone="info">{intervention.priorite || 'NORMALE'}</Badge>}
        />
        <AppReadField
          label="Criticite"
          value={intervention.criticite || 'MOYENNE'}
        />
        <AppReadField label="Materiel" value={formatMateriel(intervention)} />
        <AppReadField
          label="Equipe"
          value={
            intervention.equipe_maintenance
              ? formatCodeLibelle(
                  intervention.equipe_maintenance.code,
                  intervention.equipe_maintenance.libelle,
                  intervention.equipe_maintenance.idEquipe,
                )
              : intervention.idEquipe
          }
        />
        <AppReadField
          label="Demande liee"
          value={intervention.demande_intervention?.code || intervention.idDemande}
        />
        <AppReadField
          label="Gamme"
          value={intervention.gamme?.libelle || intervention.idGamme}
        />
        <AppReadField
          label="Debut prevu"
          value={formatDateTime(intervention.dateDebutPrevue)}
        />
        <AppReadField
          label="Fin prevue"
          value={formatDateTime(intervention.dateFinPrevue)}
        />
        <AppReadField
          label="Debut reel"
          value={formatDateTime(intervention.dateDebutReelle)}
        />
        <AppReadField
          label="Fin reelle"
          value={formatDateTime(intervention.dateFinReelle)}
        />
        <AppReadField
          label="Charge prevue"
          value={formatNumber(intervention.chargePrevue)}
        />
        <AppReadField
          label="Charge reelle"
          value={formatNumber(intervention.chargeReelle)}
        />
        <AppReadField
          label="Cout pieces reel"
          value={formatNumber(intervention.coutPiecesReel)}
        />
        <AppReadField
          label="Cout total reel"
          value={formatNumber(intervention.coutTotalReel)}
        />
      </AppFieldGrid>

      <AppReadField label="Description" value={intervention.description} />
      <AppReadField
        label="Diagnostic initial"
        value={intervention.diagnosticInitial}
      />
      <AppReadField label="Instructions" value={intervention.instructions} />
    </AppSection>
  );
}

function AffectationSection({
  intervention,
  loading,
  onAffecterEquipe,
  onAffecterTechnicien,
  onDeleteAffectationTechnicien,
  onRefresh,
}: {
  intervention: Intervention;
  loading: boolean;
  onAffecterEquipe: (data: AffecterEquipeDto) => void | Promise<void>;
  onAffecterTechnicien: (data: AffecterTechnicienDto) => void | Promise<void>;
  onDeleteAffectationTechnicien: (
    idAffectation: number,
  ) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
}) {
  const [idEquipe, setIdEquipe] = useState(
    intervention.idEquipe ? String(intervention.idEquipe) : '',
  );
  const [idTechnicien, setIdTechnicien] = useState('');
  const [tempsTravail, setTempsTravail] = useState('');
  const [actionError, setActionError] = useState('');

  const [references, setReferences] = useState<InterventionReferenceData>({
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
  });

  const [referenceError, setReferenceError] = useState('');

  useEffect(() => {
    setIdEquipe(intervention.idEquipe ? String(intervention.idEquipe) : '');
  }, [intervention.idEquipe]);

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
            getApiErrorMessage(
              error,
              'Impossible de charger les listes affectation.',
            ),
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const equipes = useMemo(() => {
    const map = new Map<number, InterventionReferenceData['equipes'][number]>();

    references.equipes.forEach((item) => {
      map.set(item.idEquipe, item);
    });

    if (intervention.equipe_maintenance?.idEquipe) {
      map.set(
        intervention.equipe_maintenance.idEquipe,
        intervention.equipe_maintenance,
      );
    }

    return Array.from(map.values());
  }, [intervention.equipe_maintenance, references.equipes]);

  const techniciens = useMemo(() => {
    const map = new Map<
      number,
      InterventionReferenceData['techniciens'][number]
    >();

    references.techniciens.forEach((item) => {
      map.set(item.idTechnicien, item);
    });

    intervention.affectation_technicien?.forEach((affectation) => {
      if (affectation.technicien?.idTechnicien) {
        map.set(affectation.technicien.idTechnicien, affectation.technicien);
      }
    });

    return Array.from(map.values());
  }, [intervention.affectation_technicien, references.techniciens]);

  const selectedEquipeNumber = Number(idEquipe || intervention.idEquipe || 0);

  const techniciensDeLEquipe = useMemo(() => {
    if (!selectedEquipeNumber) return [];

    return techniciens.filter((technicien) => {
      const technicienAvecEquipe = technicien as typeof technicien & {
        idEquipe?: number | string | null;
      };

      return Number(technicienAvecEquipe.idEquipe || 0) === selectedEquipeNumber;
    });
  }, [techniciens, selectedEquipeNumber]);

  useEffect(() => {
    if (!idTechnicien) return;

    const technicienExisteDansEquipe = techniciensDeLEquipe.some(
      (technicien) => String(technicien.idTechnicien) === String(idTechnicien),
    );

    if (!technicienExisteDansEquipe) {
      setIdTechnicien('');
    }
  }, [idTechnicien, techniciensDeLEquipe]);

  const etat = (intervention.etat || '').toUpperCase();

  const canAffecter = [
    'EN_PREPARATION',
    'ATTENTE_VALIDATION',
    'VALIDEE',
    'ATTENTE_REALISATION',
    'ATTENTE_FOURNITURE',
  ].includes(etat);

  const equipeDejaAffectee =
    Boolean(idEquipe) && String(idEquipe) === String(intervention.idEquipe || '');

  async function handleAffecterEquipe() {
    const id = Number(idEquipe);

    if (!id || Number.isNaN(id)) return;

    const equipeChangee =
      Boolean(intervention.idEquipe) &&
      String(intervention.idEquipe) !== String(id);

    const hasTechniciens = Boolean(
      intervention.affectation_technicien?.length,
    );

    if (equipeChangee && hasTechniciens) {
      const confirmed = window.confirm(
        "Changer l'équipe va supprimer tous les techniciens déjà affectés à cette intervention. Continuer ?",
      );

      if (!confirmed) return;
    }

    try {
      setActionError('');

      await onAffecterEquipe({
        idEquipe: id,
        assignedBy: 'Admin',
      });

      setIdTechnicien('');
      setTempsTravail('');

      await onRefresh();
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "Impossible d'affecter l'équipe."),
      );
    }
  }

  async function handleAffecterTechnicien() {
    const id = Number(idTechnicien);

    if (!id || Number.isNaN(id)) return;

    const temps = tempsTravail.trim() ? Number(tempsTravail) : undefined;

    const tempsTravailNumber =
      temps !== undefined && Number.isFinite(temps) ? temps : undefined;

    try {
      setActionError('');

      await onAffecterTechnicien({
        idTechnicien: id,
        tempsTravail: tempsTravailNumber,
        affectePar: 'Admin',
      });

      setIdTechnicien('');
      setTempsTravail('');

      await onRefresh();
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, "Impossible d'affecter le technicien."),
      );
    }
  }

  async function handleDeleteAffectation(idAffectation: number) {
    const confirmed = window.confirm(
      'Voulez-vous supprimer ce technicien de cette intervention ?',
    );

    if (!confirmed) return;

    try {
      setActionError('');

      await onDeleteAffectationTechnicien(idAffectation);

      await onRefresh();
    } catch (error) {
      setActionError(
        getApiErrorMessage(
          error,
          "Impossible de supprimer l'affectation technicien.",
        ),
      );
    }
  }

  const equipeAffecteeLabel = intervention.equipe_maintenance
    ? formatCodeLibelle(
        intervention.equipe_maintenance.code,
        intervention.equipe_maintenance.libelle,
        intervention.equipe_maintenance.idEquipe,
      )
    : intervention.idEquipe
      ? `Équipe #${intervention.idEquipe}`
      : 'Aucune équipe affectée';

  return (
    <AppSection title="Affectations">
      {referenceError && (
        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          {referenceError}
        </div>
      )}

      {actionError && (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {actionError}
        </div>
      )}

      {canAffecter ? (
        <div className="mb-5 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_150px_auto]">
          <select
            value={idEquipe}
            onChange={(event) => {
              setIdEquipe(event.target.value);
              setIdTechnicien('');
            }}
            disabled={loading}
            className={`${appSelectClassName} min-w-0 truncate`}
          >
            <option value="">Sélectionner une équipe</option>

            {intervention.idEquipe &&
              !equipes.some(
                (equipe) =>
                  String(equipe.idEquipe) === String(intervention.idEquipe),
              ) && (
                <option value={intervention.idEquipe}>
                  Équipe actuelle #{intervention.idEquipe}
                </option>
              )}

            {equipes.map((equipe) => (
              <option key={equipe.idEquipe} value={equipe.idEquipe}>
                {formatCodeLibelle(
                  equipe.code,
                  equipe.libelle,
                  equipe.idEquipe,
                )}
              </option>
            ))}
          </select>

          <button
            type="button"
            disabled={loading || !idEquipe || equipeDejaAffectee}
            onClick={handleAffecterEquipe}
            className={`${appSecondaryButtonClassName} whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Users size={17} />
            {equipeDejaAffectee ? 'Équipe affectée' : 'Affecter équipe'}
          </button>

          <select
            value={idTechnicien}
            onChange={(event) => setIdTechnicien(event.target.value)}
            disabled={loading || !selectedEquipeNumber}
            className={`${appSelectClassName} min-w-0 truncate`}
          >
            <option value="">
              {selectedEquipeNumber
                ? 'Sélectionner un technicien de cette équipe'
                : 'Sélectionner une équipe d’abord'}
            </option>

            {techniciensDeLEquipe.map((technicien) => (
              <option
                key={technicien.idTechnicien}
                value={technicien.idTechnicien}
              >
                {formatTechnicien(technicien)}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="0"
            step="0.5"
            value={tempsTravail}
            onChange={(event) => setTempsTravail(event.target.value)}
            disabled={loading || !selectedEquipeNumber}
            className={`${appInputClassName} min-w-0`}
            placeholder="Temps"
          />

          <button
            type="button"
            disabled={loading || !idTechnicien}
            onClick={handleAffecterTechnicien}
            className={`${appPrimaryButtonClassName} whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <UserPlus size={17} />
            Affecter
          </button>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
          <p>
            Les affectations sont verrouillées dès que l’OT est en cours. Les
            temps réels doivent être saisis dans la section Occupations.
          </p>

          <p className="mt-3 text-slate-700">
            Équipe affectée :{' '}
            <span className="font-black text-slate-950">
              {equipeAffecteeLabel}
            </span>
          </p>
        </div>
      )}

      {canAffecter && selectedEquipeNumber && techniciensDeLEquipe.length === 0 && (
        <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
          Aucun technicien trouvé pour cette équipe.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3 pr-4 align-middle">Technicien</th>
              <th className="py-3 pr-4 align-middle">Matricule</th>
              <th className="py-3 pr-4 align-middle">Rôle</th>
              <th className="py-3 pr-4 align-middle">Temps</th>
              <th className="py-3 pr-4 align-middle">Affecté par</th>

              {canAffecter && (
                <th className="py-3 pr-4 text-right align-middle">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {intervention.affectation_technicien?.length ? (
              intervention.affectation_technicien.map((affectation) => (
                <tr key={affectation.idAffectation} className="text-sm">
                  <td className="max-w-[260px] py-3 pr-4 align-middle font-black text-slate-950">
                    <span className="block truncate">
                      {affectation.technicien?.nom ||
                        affectation.idTechnicien ||
                        '-'}
                    </span>
                  </td>

                  <td className="max-w-[160px] py-3 pr-4 align-middle font-bold text-slate-700">
                    <span className="block truncate">
                      {affectation.technicien?.matricule || '-'}
                    </span>
                  </td>

                  <td className="max-w-[180px] py-3 pr-4 align-middle font-bold text-slate-700">
                    <span className="block truncate">
                      {affectation.technicien?.roleEquipe || '-'}
                    </span>
                  </td>

                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {affectation.tempsTravail ?? '-'}
                  </td>

                  <td className="max-w-[180px] py-3 pr-4 align-middle font-bold text-slate-700">
                    <span className="block truncate">
                      {affectation.affectePar || '-'}
                    </span>
                  </td>

                  {canAffecter && (
                    <td className="py-3 pr-4 text-right align-middle">
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteAffectation(affectation.idAffectation)
                        }
                        disabled={loading}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Supprimer le technicien"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={canAffecter ? 6 : 5}
                  className="py-6 text-center text-sm font-bold text-slate-500"
                >
                  Aucun technicien affecté.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppSection>
  );
}



function formatCodeLibelle(
  code?: string | null,
  libelle?: string | null,
  id?: number | null,
) {
  return [code, libelle].filter(Boolean).join(' - ') || `#${id ?? ''}`;
}

function formatTechnicien(technicien: {
  idTechnicien: number;
  nom?: string | null;
  matricule?: string | null;
}) {
  return (
    [technicien.nom, technicien.matricule].filter(Boolean).join(' - ') ||
    `Technicien #${technicien.idTechnicien}`
  );
}

function HistorySection({ intervention }: { intervention: Intervention }) {
  return (
    <AppSection title="Historique des etats">
      <div className="space-y-3">
        {intervention.historiquesEtat?.length ? (
          intervention.historiquesEtat.map((historique) => (
            <div
              key={historique.idHistoriqueEtat}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-950">
                    {historique.action || 'Changement etat'}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {formatEtat(historique.ancienEtat)} -{'>'}{' '}
                    {formatEtat(historique.nouvelEtat)}
                  </p>

                  {historique.commentaire && (
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      {historique.commentaire}
                    </p>
                  )}
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm font-black text-slate-700">
                    {historique.changedBy || '-'}
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {formatDateTime(historique.changedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">
            Aucun historique disponible.
          </div>
        )}
      </div>
    </AppSection>
  );
}

function formatMateriel(intervention: Intervention) {
  if (intervention.materiel?.code && intervention.materiel?.libelle) {
    return `${intervention.materiel.code} - ${intervention.materiel.libelle}`;
  }

  return (
    intervention.materiel?.code ||
    intervention.materiel?.libelle ||
    (intervention.idMateriel ? `Materiel #${intervention.idMateriel}` : '-')
  );
}