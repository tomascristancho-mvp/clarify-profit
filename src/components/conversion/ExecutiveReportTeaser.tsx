interface ExecutiveReportTeaserProps {
  businessName?: string;
}

const REPORT_ITEMS = [
  {
    label: "Utilidad mensual",
    description: "Resultado financiero estimado del mes con tus datos actuales.",
  },
  {
    label: "Punto de equilibrio",
    description: "Unidades y ventas mínimas para no operar en pérdida.",
  },
  {
    label: "Nivel de riesgo",
    description: "Diagnóstico ejecutivo con los factores que más lo afectan.",
  },
  {
    label: "Escenarios",
    description: "Proyecciones pesimista, esperada y optimista en un vistazo.",
  },
  {
    label: "Lectura ejecutiva",
    description: "Resumen en lenguaje claro, listo para compartir con asesores.",
  },
] as const;

export function ExecutiveReportTeaser({ businessName }: ExecutiveReportTeaserProps) {
  const nameSuffix = businessName ? ` — ${businessName}` : "";

  return (
    <section aria-labelledby="report-teaser-heading">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50/60 to-white px-6 py-5">
          <span className="mb-3 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            Próximamente
          </span>
          <h3
            id="report-teaser-heading"
            className="text-lg font-semibold text-slate-800"
          >
            Convierte este análisis en un reporte ejecutivo{nameSuffix}
          </h3>
          <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-slate-500">
            Próximamente podrás generar un resumen claro basado en este análisis.
            Ideal para compartir con socios, contador o asesor antes de tomar
            decisiones.
          </p>
        </div>

        {/* Report items */}
        <div className="px-6 py-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            El reporte incluiría
          </p>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {REPORT_ITEMS.map((item, index) => (
              <li key={item.label} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA footer */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-400"
          >
            Reporte ejecutivo próximamente
          </button>
          <p className="mt-2 text-xs text-slate-400">
            Disponible próximamente · En validación · Sin registro obligatorio
          </p>
        </div>

      </div>
    </section>
  );
}
