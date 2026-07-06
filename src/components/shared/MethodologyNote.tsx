export function MethodologyNote() {
  return (
    <section aria-label="Metodología de cálculo">
      <details className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60">
          Cómo se calculan los resultados
        </summary>
        <div className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-800">
          <p className="mb-3 text-xs italic text-slate-500 dark:text-slate-400">
            Estimaciones basadas únicamente en los datos ingresados. No incluyen impuestos,
            costos de oportunidad ni factores externos.
          </p>
          <dl className="flex flex-col gap-2 text-sm">
            <div>
              <dt className="font-medium text-slate-700 dark:text-slate-200">Margen de contribución por unidad</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Precio de venta − Costo variable por unidad
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700 dark:text-slate-200">Punto de equilibrio (unidades)</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Costos fijos mensuales ÷ Margen de contribución
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700 dark:text-slate-200">Utilidad operativa mensual</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                (Precio − Costo variable) × Unidades vendidas − Costos fijos
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700 dark:text-slate-200">ROI mensual estimado</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Utilidad mensual ÷ Inversión inicial × 100
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700 dark:text-slate-200">Tiempo de recuperación</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Inversión inicial ÷ Utilidad mensual
              </dd>
            </div>
          </dl>
        </div>
      </details>
    </section>
  );
}
