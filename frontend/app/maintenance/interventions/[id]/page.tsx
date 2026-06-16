'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';



import { InterventionDetail } from '@/features/interventions/components/InterventionDetail';
import {
  accepterTravauxIntervention,
  affecterEquipeIntervention,
  affecterTechnicienIntervention,
  annulerConsommationIntervention,
  annulerIntervention,
  archiverIntervention,
  createConsommationIntervention,
  createOccupationIntervention,
  deleteOccupationIntervention,
  demanderValidationIntervention,
  demarrerIntervention,
  getApiErrorMessage,
  getIntervention,
  mettreAttenteFournitureIntervention,
  refuserIntervention,
  refuserTravauxIntervention,
  reprendreIntervention,
  solderIntervention,
  terminerIntervention,
  upsertCompteRenduIntervention,
  validerIntervention,
  createOperationIntervention,
  deleteOperationIntervention,
  deleteAffectationTechnicien ,
  fournituresDisponiblesIntervention,
} from '@/features/interventions/services/intervention.service';
import type {
  AffecterEquipeDto,
  AffecterTechnicienDto,
  CreateConsommationInterventionDto,
  CreateOccupationInterventionDto,
  Intervention,
  RefuserTravauxDto,
  UpsertCompteRenduInterventionDto,
  CreateOperationInterventionDto,
} from '@/features/interventions/types/intervention.types';

export default function InterventionDetailPage() {
  const params = useParams<{ id: string }>();
  const idIntervention = Number(params.id);

  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const loadIntervention = useCallback(async () => {
    if (!Number.isFinite(idIntervention)) {
      setError('Identifiant intervention invalide.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await getIntervention(idIntervention);
      setIntervention(data);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Erreur lors du chargement de l'intervention.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [idIntervention]);

  useEffect(() => {
    loadIntervention();
  }, [loadIntervention]);

  async function runAction(action: () => Promise<unknown>) {
    try {
      setActionLoading(true);
      setError('');
      await action();
      await loadIntervention();
    } catch (err) {
      setError(
        getApiErrorMessage(err, 'Action impossible sur cette intervention.'),
      );
    } finally {
      setActionLoading(false);
    }
  }
  async function handleCreateOperation(data: CreateOperationInterventionDto) {
  if (!intervention) return;

  setActionLoading(true);

  try {
    await createOperationIntervention(intervention.idIntervention, data);
    await loadIntervention();
  } catch (error) {
    setError(getApiErrorMessage(error, "Impossible d'ajouter l'opération."));
  } finally {
    setActionLoading(false);
  }
}

async function handleDeleteOperation(idOperation: number) {
  if (!intervention) return;

  setActionLoading(true);

  try {
    await deleteOperationIntervention(
      intervention.idIntervention,
      idOperation,
    );
    await loadIntervention();
  } catch (error) {
    setError(getApiErrorMessage(error, "Impossible de supprimer l'opération."));
  } finally {
    setActionLoading(false);
  }
}
async function handleFournituresDisponibles() {
  if (!intervention) return;

  setActionLoading(true);

  try {
    await fournituresDisponiblesIntervention(intervention.idIntervention);
    await loadIntervention();
  } catch (error) {
    setError(
      getApiErrorMessage(
        error,
        "Impossible de passer l'OT en attente réalisation.",
      ),
    );
  } finally {
    setActionLoading(false);
  }
}
async function handleDeleteAffectationTechnicien(idAffectation: number) {
  if (!intervention) return;

  setActionLoading(true);

  try {
    await deleteAffectationTechnicien(
      intervention.idIntervention,
      idAffectation,
    );

    await loadIntervention();
  } catch (error) {
    setError(
      getApiErrorMessage(
        error,
        "Impossible de supprimer l'affectation technicien.",
      ),
    );

    throw error;
  } finally {
    setActionLoading(false);
  }
}
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-6">
      <section className="mx-auto max-w-[1350px] space-y-5">
        {loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-sm font-bold text-slate-500 shadow-sm">
            Chargement de l&apos;intervention...
          </div>
        ) : error && !intervention ? (
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-7 text-red-700 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-base font-black">
                  Impossible de charger l&apos;intervention
                </p>
                <p className="mt-1 text-sm font-bold">{error}</p>
                <Link
                  href="/maintenance/interventions"
                  className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-red-700 shadow-sm transition hover:bg-red-50"
                >
                  <ArrowLeft size={18} />
                  Retour a la liste
                </Link>
              </div>
            </div>
          </div>
        ) : intervention ? (
          <>
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <InterventionDetail
              intervention={intervention}
              actionLoading={actionLoading}
              onRefresh={loadIntervention}
              
              onCreateOperation={handleCreateOperation}
onDeleteOperation={handleDeleteOperation}
onDeleteAffectationTechnicien={handleDeleteAffectationTechnicien}
onFournituresDisponibles={handleFournituresDisponibles}
              onDemanderValidation={() =>
                runAction(() =>
                  demanderValidationIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Demande validation',
                  }),
                )
              }
              onValider={() =>
                runAction(() =>
                  validerIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Intervention validee',
                  }),
                )
              }
              onRefuser={() =>
                runAction(() =>
                  refuserIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Validation refusee',
                  }),
                )
              }
              onDemarrer={() =>
                runAction(() =>
                  demarrerIntervention(idIntervention, {
                    startedBy: 'Admin',
                    commentaire: 'Demarrage intervention',
                  }),
                )
              }
              onAttenteFourniture={() =>
                runAction(() =>
                  mettreAttenteFournitureIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Mise en attente fourniture',
                  }),
                )
              }
              onTerminer={() =>
                runAction(() =>
                  terminerIntervention(idIntervention, {
                    reportedBy: 'Admin',
                    commentaire: 'Intervention terminee',
                  }),
                )
              }
              onAccepterTravaux={() =>
                runAction(() =>
                  accepterTravauxIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Travaux acceptes',
                  }),
                )
              }
              onRefuserTravaux={(data: RefuserTravauxDto) =>
                runAction(() => refuserTravauxIntervention(idIntervention, data))
              }
              onReprendre={() =>
                runAction(() =>
                  reprendreIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Reprise apres refus travaux',
                  }),
                )
              }
              onSolder={() =>
                runAction(() =>
                  solderIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Solde intervention',
                  }),
                )
              }
              onAnnuler={() =>
                runAction(() =>
                  annulerIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Annulation intervention',
                  }),
                )
              }
              onArchiver={() =>
                runAction(() =>
                  archiverIntervention(idIntervention, {
                    utilisateur: 'Admin',
                    commentaire: 'Archivage intervention',
                  }),
                )
              }
              onAffecterEquipe={(data: AffecterEquipeDto) =>
                runAction(() => affecterEquipeIntervention(idIntervention, data))
              }
              onAffecterTechnicien={(data: AffecterTechnicienDto) =>
                runAction(() =>
                  affecterTechnicienIntervention(idIntervention, data),
                )
              }
              onCreateOccupation={(data: CreateOccupationInterventionDto) =>
                runAction(() =>
                  createOccupationIntervention(idIntervention, data),
                )
              }
              onDeleteOccupation={(idOccupation: number) =>
                runAction(() =>
                  deleteOccupationIntervention(idIntervention, idOccupation),
                )
              }
              onSaveCompteRendu={(data: UpsertCompteRenduInterventionDto) =>
                runAction(() =>
                  upsertCompteRenduIntervention(idIntervention, data),
                )
              }
              onCreateConsommation={(data: CreateConsommationInterventionDto) =>
                runAction(() =>
                  createConsommationIntervention(idIntervention, data),
                )
              }
              onCancelConsommation={(idConsommation: number) =>
                runAction(() =>
                  annulerConsommationIntervention(
                    idIntervention,
                    idConsommation,
                    {
                      cancelledBy: 'Admin',
                      motifAnnulation: 'Annulation consommation',
                    },
                  ),
                )
              }
            />
          </>
        ) : null}
      </section>
    </main>
  );
}
