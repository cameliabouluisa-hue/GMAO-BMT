type Props = {
  title: string;
  description: string;
};

export default function ArborescenceHeader({ title, description }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 md:text-base">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          Vue arborescente
        </div>
      </div>
    </div>
  );
}