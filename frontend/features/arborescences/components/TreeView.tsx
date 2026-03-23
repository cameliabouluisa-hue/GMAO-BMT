'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ArborescenceNode } from '../types/arborescence.types';
import TreeNode from './TreeNode';

type Props = {
  data: ArborescenceNode[];
};

function filterTree(nodes: ArborescenceNode[], search: string): ArborescenceNode[] {
  if (!search.trim()) return nodes;

  const q = search.toLowerCase();

  return nodes
    .map((node) => {
      const children = filterTree(node.children, search);

      const selfMatches =
        (node.libelle ?? '').toLowerCase().includes(q) ||
        (node.code ?? '').toLowerCase().includes(q) ||
        (node.typePoint ?? '').toLowerCase().includes(q) ||
        node.type.toLowerCase().includes(q);

      if (selfMatches || children.length > 0) {
        return {
          ...node,
          children,
        };
      }

      return null;
    })
    .filter(Boolean) as ArborescenceNode[];
}

function countNodes(nodes: ArborescenceNode[]): number {
  return nodes.reduce((acc, node) => acc + 1 + countNodes(node.children), 0);
}

export default function TreeView({ data }: Props) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => filterTree(data, search), [data, search]);
  const totalNodes = useMemo(() => countNodes(data), [data]);
  const filteredNodes = useMemo(() => countNodes(filteredData), [filteredData]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par libellé, code, type..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Total nœuds : {totalNodes}
            </div>
            <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Résultats : {filteredNodes}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {filteredData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Aucun élément trouvé.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((node) => (
              <TreeNode key={node.key} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}