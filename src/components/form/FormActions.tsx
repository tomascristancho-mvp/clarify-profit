interface FormActionsProps {
  onLoadExample: () => void;
  onReset: () => void;
}

export function FormActions({ onLoadExample, onReset }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <button
        type="submit"
        className="flex-1 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Calcular
      </button>
      <button
        type="button"
        onClick={onLoadExample}
        className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cargar ejemplo
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Reiniciar
      </button>
    </div>
  );
}
