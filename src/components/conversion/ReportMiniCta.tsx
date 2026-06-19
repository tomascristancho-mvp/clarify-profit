const BENEFITS = [
  "Plan de acción de 30 días",
  "Análisis completo de sensibilidad",
  "Recomendaciones por nivel de riesgo",
] as const;

export function ReportMiniCta() {
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-white shadow-sm">
      <div className="px-5 py-4">

        {/* Title + price + badge */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-slate-800">
            Reporte ejecutivo premium
          </span>
          <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white">
            $9.900 COP
          </span>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
            Versión piloto
          </span>
        </div>

        <p className="mb-3 text-xs leading-relaxed text-slate-500">
          Convierte estos resultados en un plan de acción profesional listo para
          compartir con socios, contador o asesor.
        </p>

        {/* Benefits + CTA */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <ul className="space-y-1.5" role="list">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="flex-shrink-0 text-indigo-500" aria-hidden="true">
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <a
            href="#reporte-ejecutivo"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Ver qué incluye
            <span aria-hidden="true">↓</span>
          </a>
        </div>

      </div>
    </div>
  );
}
