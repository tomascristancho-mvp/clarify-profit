export function MethodologyNote() {
  return (
    <section aria-label="Metodología de cálculo">
      <details className="rounded-lg border border-slate-200 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Cómo se calculan los resultados
        </summary>
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <p className="mb-3 text-xs italic text-slate-500">
            Estimaciones basadas únicamente en los datos ingresados. No incluyen impuestos,
            costos de oportunidad ni factores externos.
          </p>
          <dl className="flex flex-col gap-2 text-sm">
            <div>
              <dt className="font-medium text-slate-700">Margen de contribución por unidad</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                Precio de venta − Costo variable por unidad
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Punto de equilibrio (unidades)</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                Costos fijos mensuales ÷ Margen de contribución
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Utilidad operativa mensual</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                (Precio − Costo variable) × Unidades vendidas − Costos fijos
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">ROI mensual estimado</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                Utilidad mensual ÷ Inversión inicial × 100
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Tiempo de recuperación</dt>
              <dd className="mt-0.5 rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                Inversión inicial ÷ Utilidad mensual
              </dd>
            </div>
          </dl>
        </div>
      </details>
    </section>
  );
}
