'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, FolderTree, HardDrive } from 'lucide-react';
import { ArborescenceNode } from '../types/arborescence.types';

type Props = {
  node: ArborescenceNode;
  level?: number;
};

export default function TreeNode({ node, level = 0 }: Props) {
  const [open, setOpen] = useState(true);

  const hasChildren = node.children.length > 0;

  const leftPadding = useMemo(() => {
    return `${level * 22}px`;
  }, [level]);

  const isPointStructure = node.type === 'POINT_STRUCTURE';

  return (
    <div className="select-none">
      <div
        className="group relative flex min-h-[64px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        style={{ marginLeft: leftPadding }}
      >
        <div className="flex w-7 items-center justify-center">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  open ? 'rotate-90' : ''
                }`}
              />
            </button>
          ) : (
            <span className="h-4 w-4" />
          )}
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isPointStructure
              ? 'bg-blue-50 text-blue-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isPointStructure ? (
            <FolderTree className="h-5 w-5" />
          ) : (
            <HardDrive className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-slate-900 md:text-base">
            {node.libelle ?? 'Sans libellé'}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
              Code : {node.code ?? '—'}
            </span>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
              {node.type}
            </span>

            {node.typePoint ? (
              <span
                className={`rounded-full px-2.5 py-1 font-medium ${
                  node.typePoint === 'GEOGRAPHIQUE'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {node.typePoint}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {open && hasChildren ? (
        <div className="relative mt-3 space-y-3 before:absolute before:bottom-0 before:left-3 before:top-0 before:w-px before:bg-slate-200">
          {node.children.map((child) => (
            <TreeNode key={child.key} node={child} level={level + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}