import { AppSection } from '@/components/app-section-layout';

import type { OperationIntervention } from '../types/intervention.types';
import { formatNumber } from './InterventionTable';

export function OperationsSection({
  operations = [],
}: {
  operations?: OperationIntervention[];
}) {
  return (
    <AppSection title="Operations">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              <th className="py-3 pr-4 align-middle">Ordre</th>
              <th className="py-3 pr-4 align-middle">Libelle</th>
              <th className="py-3 pr-4 align-middle">Description</th>
              <th className="py-3 pr-4 align-middle">Temps passe</th>
              <th className="py-3 pr-4 align-middle">Obligatoire</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {operations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-sm font-bold text-slate-500"
                >
                  Aucune operation liee a cette intervention.
                </td>
              </tr>
            ) : (
              operations.map((operation) => (
                <tr key={operation.idOperation} className="text-sm">
                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {operation.ordre ?? '-'}
                  </td>
                  <td className="max-w-[260px] py-3 pr-4 align-middle font-black text-slate-950">
                    <span className="block truncate">
                      {operation.libelle || '-'}
                    </span>
                  </td>
                  <td className="max-w-[420px] py-3 pr-4 align-middle font-semibold text-slate-600">
                    <span className="block truncate">
                      {operation.description || '-'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {formatNumber(operation.tempsPasse)}
                  </td>
                  <td className="py-3 pr-4 align-middle font-bold text-slate-700">
                    {operation.obligatoire ? 'Oui' : 'Non'}
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
