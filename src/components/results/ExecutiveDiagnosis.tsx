import type { DiagnosisResult, RiskLevel } from "@/domain/diagnosis";

interface RiskConfig {
  label: string;
  icon: string;
  borderColor: string;
  bgClass: string;
  badgeClass: string;
  iconBgClass: string;
  textClass: string;
  footerBg: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskConfig> = {
  bajo: {
    label: "Bajo riesgo",
    icon: "✓",
    borderColor: "border-l-emerald-500",
    bgClass: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    badgeClass: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    iconBgClass: "bg-emerald-500 text-white",
    textClass: "text-emerald-900",
    footerBg: "bg-emerald-100/60",
  },
  medio: {
    label: "Riesgo moderado",
    icon: "!",
    borderColor: "border-l-amber-500",
    bgClass: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-500 text-white",
    textClass: "text-amber-900",
    footerBg: "bg-amber-100/60",
  },
  alto: {
    label: "Riesgo alto",
    icon: "⚠",
    borderColor: "border-l-orange-500",
    bgClass: "border-orange-100 bg-gradient-to-br from-orange-50 to-white",
    badgeClass: "bg-orange-100 text-orange-800 ring-orange-200",
    iconBgClass: "bg-orange-500 text-white",
    textClass: "text-orange-900",
    footerBg: "bg-orange-100/60",
  },
  no_viable: {
    label: "No viable con estos datos",
    icon: "✕",
    borderColor: "border-l-red-500",
    bgClass: "border-red-100 bg-gradient-to-br from-red-50 to-white",
    badgeClass: "bg-red-100 text-red-800 ring-red-200",
    iconBgClass: "bg-red-500 text-white",
    textClass: "text-red-900",
    footerBg: "bg-red-100/60",
  },
};

// Exploration prompts — framed as suggestions, not directives.
const NEXT_STEP: Record<RiskLevel, string> = {
  bajo:
    "Explora si puedes escalar el volumen de ventas o diversificar fuentes de ingreso manteniendo los costos controlados.",
  medio:
    "Simula qué pasaría si las ventas cayeran un 20% y evalúa cuánto margen de seguridad tienes frente al punto de equilibrio.",
  alto:
    "Revisa cuáles costos fijos son reducibles a corto plazo y considera si el precio puede ajustarse sin afectar la demanda.",
  no_viable:
    "Revisa el precio de venta y el costo variable por unidad. Con los valores actuales, cada unidad vendida incrementa la pérdida.",
};

// Positive reading only when the data genuinely suggests a viable signal.
// Shown for bajo / medio; omitted for alto / no_viable.
const STRENGTH_READING: Partial<Record<RiskLevel, string>> = {
  bajo:
    "Los datos ingresados sugieren una estructura de costos viable: el margen de contribución muestra capacidad para absorber costos fijos y generar utilidad con el volumen declarado.",
  medio:
    "Los datos muestran utilidad con el volumen actual. El margen indica que el negocio puede ser sostenible, aunque el colchón frente a variaciones en ventas o costos es limitado.",
};

interface ExecutiveDiagnosisProps {
  diagnosis: DiagnosisResult;
}

export function ExecutiveDiagnosis({ diagnosis }: ExecutiveDiagnosisProps) {
  const config = RISK_CONFIG[diagnosis.riskLevel];
  const strengthText = STRENGTH_READING[diagnosis.riskLevel];

  return (
    <section aria-labelledby="diagnosis-heading">
      <h3
        id="diagnosis-heading"
        className="mb-3 text-lg font-semibold text-slate-800"
      >
        Veredicto ejecutivo
      </h3>

      {/* overflow-hidden clips the footer strip to the rounded corners */}
      <div
        className={`overflow-hidden rounded-2xl border border-l-4 shadow-sm ${config.bgClass} ${config.borderColor}`}
      >
        {/* ── Body: badge + summary + lectura positiva + factor de riesgo ── */}
        <div className="p-5">
          {/* Risk badge */}
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${config.iconBgClass}`}
              aria-hidden="true"
            >
              {config.icon}
            </span>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ring-1 ring-inset ${config.badgeClass}`}
            >
              {config.label}
            </span>
          </div>

          <p className="sr-only">Nivel de riesgo: {config.label}.</p>

          {/* Summary */}
          <p className={`text-sm leading-relaxed ${config.textClass}`}>
            {diagnosis.summary}
          </p>

          {/* Positive reading — only for bajo / medio */}
          {strengthText !== undefined && (
            <div className="mt-3 border-t border-black/5 pt-3">
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-700">Lectura positiva: </span>
                {strengthText}
              </p>
            </div>
          )}

          {/* Risk factor — only when the domain provides one */}
          {diagnosis.mainRiskFactor !== null && (
            <div className="mt-3 flex items-start gap-2 border-t border-black/5 pt-3">
              <span aria-hidden="true" className="mt-px flex-shrink-0 text-sm opacity-40">
                ⚠
              </span>
              <p className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Factor de riesgo: </span>
                {diagnosis.mainRiskFactor}
              </p>
            </div>
          )}
        </div>

        {/* ── Footer: Para explorar ──────────────────────────────── */}
        <div className={`border-t border-black/5 px-5 py-3 ${config.footerBg}`}>
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-700">Para explorar →</span>{" "}
            {NEXT_STEP[diagnosis.riskLevel]}
          </p>
        </div>
      </div>
    </section>
  );
}
