import type { DiagnosisResult, RiskLevel } from "@/domain/diagnosis";

interface RiskConfig {
  label: string;
  icon: string;
  borderColor: string;
  bgClass: string;
  badgeClass: string;
  iconBgClass: string;
  textClass: string;
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
  },
  medio: {
    label: "Riesgo moderado",
    icon: "!",
    borderColor: "border-l-amber-500",
    bgClass: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    badgeClass: "bg-amber-100 text-amber-800 ring-amber-200",
    iconBgClass: "bg-amber-500 text-white",
    textClass: "text-amber-900",
  },
  alto: {
    label: "Riesgo alto",
    icon: "⚠",
    borderColor: "border-l-orange-500",
    bgClass: "border-orange-100 bg-gradient-to-br from-orange-50 to-white",
    badgeClass: "bg-orange-100 text-orange-800 ring-orange-200",
    iconBgClass: "bg-orange-500 text-white",
    textClass: "text-orange-900",
  },
  no_viable: {
    label: "No viable con estos datos",
    icon: "✕",
    borderColor: "border-l-red-500",
    bgClass: "border-red-100 bg-gradient-to-br from-red-50 to-white",
    badgeClass: "bg-red-100 text-red-800 ring-red-200",
    iconBgClass: "bg-red-500 text-white",
    textClass: "text-red-900",
  },
};

interface ExecutiveDiagnosisProps {
  diagnosis: DiagnosisResult;
}

export function ExecutiveDiagnosis({ diagnosis }: ExecutiveDiagnosisProps) {
  const config = RISK_CONFIG[diagnosis.riskLevel];

  return (
    <section aria-labelledby="diagnosis-heading">
      <h3
        id="diagnosis-heading"
        className="mb-3 text-lg font-semibold text-slate-800"
      >
        Diagnóstico ejecutivo
      </h3>

      <div
        className={`rounded-2xl border border-l-4 p-5 shadow-sm ${config.bgClass} ${config.borderColor}`}
      >
        {/* Risk badge row */}
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

        {/* Screen-reader level announcement */}
        <p className="sr-only">Nivel de riesgo: {config.label}.</p>

        {/* Summary */}
        <p className={`text-sm leading-relaxed ${config.textClass}`}>
          {diagnosis.summary}
        </p>

        {/* Main risk factor */}
        {diagnosis.mainRiskFactor && (
          <div className="mt-3 border-t border-black/5 pt-3">
            <p className="text-xs text-slate-600">
              <span className="font-semibold">Factor de riesgo principal: </span>
              {diagnosis.mainRiskFactor}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
