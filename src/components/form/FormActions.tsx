interface FormActionsProps {
  onLoadExample: () => void;
  onReset: () => void;
}

export function FormActions({ onLoadExample, onReset }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <button
        type="submit"
        className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/40 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:translate-y-0"
      >
        Calcular mi negocio
        <span aria-hidden="true"> →</span>
      </button>
      <button
        type="button"
        onClick={onLoadExample}
        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cargar ejemplo
      </button>
      <button
        type="button"
        onClick={onReset}
        className="flex-1 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-normal text-slate-400 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Reiniciar
      </button>
    </div>
  );
}
