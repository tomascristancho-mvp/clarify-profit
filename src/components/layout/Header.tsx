export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Negocio Claro
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Descubre cuánto necesitas vender, cuánto podrías ganar y cuándo recuperarías tu inversión.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
            Herramienta educativa
          </span>
        </div>
      </div>
    </header>
  );
}
