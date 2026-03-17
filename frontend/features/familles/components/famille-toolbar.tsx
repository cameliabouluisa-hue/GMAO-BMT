

import { ChevronDown, Download, Plus, Search, X } from 'lucide-react';
import type { FamilleFilterType } from '@/features/familles/types/famille';

type FamilleToolbarProps = {
  search: string;
  filterType: FamilleFilterType;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onFilterChange: (value: FamilleFilterType) => void;
  onExport: () => void;
  onCreate: () => void;
};

export default function FamilleToolbar({
  search,
  filterType,
  onSearchChange,
  onClearSearch,
  onFilterChange,
  onExport,
  onCreate,
}: FamilleToolbarProps) {
  return (
    <div
      className="flex flex-col gap-3 border-b px-4 py-3 xl:flex-row xl:items-center xl:justify-between"
      style={{
        borderColor: '#EEF3F6',
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
        <div
          className="flex h-[42px] w-full items-center gap-2 rounded-[12px] border px-3 lg:max-w-[320px]"
          style={{
            borderColor: '#E6EDF2',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Search size={15} color="#8AA0AF" />
          <input
            type="text"
            placeholder="Rechercher"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400"
            style={{ color: '#183B56' }}
          />
          {search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="flex h-6 w-6 items-center justify-center rounded-full transition hover:bg-slate-100"
              title="Effacer"
            >
              <X size={14} color="#91A3B0" />
            </button>
          )}
        </div>

        <div
          className="flex h-[42px] min-w-[220px] items-center rounded-[12px] border px-3"
          style={{
            borderColor: '#E6EDF2',
            backgroundColor: '#FFFFFF',
          }}
        >
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as FamilleFilterType)}
            className="w-full appearance-none bg-transparent text-[13px] font-medium outline-none"
            style={{ color: '#183B56' }}
          >
            <option value="all">Toutes les familles</option>
            <option value="parents">Familles parentes</option>
            <option value="withModels">Familles avec modèles</option>
          </select>
          <ChevronDown size={15} color="#91A3B0" />
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-[42px] items-center gap-2 rounded-[12px] border px-4 text-[13px] font-medium transition hover:opacity-95"
          style={{
            borderColor: '#E6EDF2',
            backgroundColor: '#FFFFFF',
            color: '#183B56',
          }}
        >
          <Download size={14} />
          <span>Exporter</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] border transition hover:bg-slate-50"
        style={{
          borderColor: '#E6EDF2',
          backgroundColor: '#FFFFFF',
          color: '#183B56',
        }}
        title="Nouvelle famille"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}