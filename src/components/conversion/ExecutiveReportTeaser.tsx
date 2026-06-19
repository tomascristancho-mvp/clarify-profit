interface ExecutiveReportTeaserProps {
  businessName?: string;
}

const REPORT_SECTIONS = [
  {
    number: "01",
    title: "Resumen ejecutivo de una página",
    tagline: "Síntesis clara del negocio, utilidad, riesgo y conclusión principal.",
    color: "bg-indigo-500",
  },
  {
    number: "02",
    title: "Diagnóstico de salud financiera",
    tagline: "Lectura de margen, equilibrio, recuperación y sostenibilidad.",
    color: "bg-violet-500",
  },
  {
    number: "03",
    title: "Plan de acción — 30 días",
    tagline: "Pasos concretos ordenados por impacto y urgencia.",
    color: "bg-sky-500",
  },
  {
    number: "04",
    title: "Variable más peligrosa",
    tagline: "El factor que más podría afectar la utilidad si cambia.",
    color: "bg-red-500",
  },
  {
    number: "05",
    title: "Mayor oportunidad de mejora",
    tagline: "La palanca con más potencial para aumentar la utilidad.",
    color: "bg-emerald-500",
  },
  {
    number: "06",
    title: "Meta mínima semanal de ventas",
    tagline: "Traducción del punto de equilibrio a metas prácticas.",
    color: "bg-amber-500",
  },
  {
    number: "07",
    title: "Análisis de sensibilidad",
    tagline: "Cómo cambia el resultado si varían precio, volumen o costos.",
    color: "bg-teal-500",
  },
  {
    number: "08",
    title: "Checklist operativo",
    tagline: "Lista accionable para revisar costos, precios y ventas.",
    color: "bg-cyan-500",
  },
  {
    number: "09",
    title: "Gráficas premium adicionales",
    tagline: "Visualizaciones más claras para compartir y decidir.",
    color: "bg-orange-500",
  },
  {
    number: "10",
    title: "Recomendaciones por nivel de riesgo",
    tagline: "Sugerencias según el diagnóstico financiero del negocio.",
    color: "bg-rose-500",
  },
] as const;

export function ExecutiveReportTeaser({ businessName }: ExecutiveReportTeaserProps) {
  const docTitle = businessName
    ? `Reporte ejecutivo premium — ${businessName}`
    : "Reporte ejecutivo premium";

  return (
    <section id="reporte-ejecutivo" aria-labelledby="report-teaser-heading">
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">

        {/* ── Header: dark, registro premium ── */}
        <div className="bg-slate-800 px-6 py-6 sm:px-7">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-200">
              $9.900 COP
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70 ring-1 ring-white/15">
              Versión piloto
            </span>
          </div>

          <h3
            id="report-teaser-heading"
            className="text-xl font-bold tracking-tight text-white"
          >
            {docTitle}
          </h3>

          <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-400">
            La calculadora te muestra los números. El reporte te explica qué
            significan y qué hacer con ellos — en lenguaje claro, listo para
            compartir con socios, contador o asesor.
          </p>
        </div>

        {/* ── 10 módulos en grilla responsive ── */}
        <div className="bg-white px-5 py-5 sm:px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
            El reporte premium incluiría
          </p>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {REPORT_SECTIONS.map((section) => (
              <div
                key={section.number}
                className="overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
              >
                <div className={`h-0.5 w-full ${section.color}`} aria-hidden="true" />
                <div className="p-3">
                  <p className="mb-1 flex items-baseline gap-1.5">
                    <span
                      className="flex-shrink-0 font-mono text-xs font-bold text-slate-300"
                      aria-hidden="true"
                    >
                      {section.number}
                    </span>
                    <span className="text-xs font-semibold leading-snug text-slate-700">
                      {section.title}
                    </span>
                  </p>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {section.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA footer ── */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-2.5 text-sm font-semibold text-indigo-400"
          >
            Solicitar reporte ejecutivo
          </button>
          <p className="mt-2 text-xs text-slate-400">
            Versión piloto · No es asesoría financiera formal · Sin registro obligatorio
          </p>
        </div>

      </div>
    </section>
  );
}
