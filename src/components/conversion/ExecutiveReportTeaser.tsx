import { buildWhatsAppReportUrl } from "@/components/conversion/whatsappReportUrl";

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

  const whatsappUrl = buildWhatsAppReportUrl(businessName);

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
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <span aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L0 24l6.29-1.508A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.373l-.36-.214-3.733.895.947-3.64-.235-.374A9.818 9.818 0 1112 21.818z"/>
              </svg>
            </span>
            Solicitar por WhatsApp
          </a>
          <p className="mt-2 text-xs text-slate-400">
            Versión piloto · No es asesoría financiera formal · Sin registro obligatorio
          </p>
        </div>

      </div>
    </section>
  );
}
