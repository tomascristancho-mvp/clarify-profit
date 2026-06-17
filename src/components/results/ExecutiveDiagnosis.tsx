import type { DiagnosisResult, RiskLevel } from "@/domain/diagnosis";

interface RiskConfig {
  label: string;
  icon: string;
  containerClass: string;
  labelClass: string;
  iconClass: string;
}

const RISK_CONFIG: Record<RiskLevel, RiskConfig> = {
  bajo: {
    label: "Bajo riesgo",
    icon: "✓",
    containerClass: "border-emerald-200 bg-emerald-50",
    labelClass: "bg-emerald-100 text-emerald-800",
    iconClass: "text-emerald-700",
  },
  medio: {
    label: "Riesgo moderado",
    icon: "!",
    containerClass: "border-amber-200 bg-amber-50",
    labelClass: "bg-amber-100 text-amber-800",
    iconClass: "text-amber-700",
  },
  alto: {
    label: "Riesgo alto",
    icon: "⚠",
    containerClass: "border-orange-200 bg-orange-50",
    labelClass: "bg-orange-100 text-orange-800",
    iconClass: "text-orange-700",
  },
  no_viable: {
    label: "No viable con estos datos",
    icon: "✕",
    containerClass: "border-red-200 bg-red-50",
    labelClass: "bg-red-100 text-red-800",
    iconClass: "text-red-700",
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

      <div className={`rounded-xl border-2 p-5 ${config.containerClass}`}>
        {/* Risk badge — icon + text label, never color alone */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${config.labelClass}`}
            aria-hidden="true"
          >
            {config.icon}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.labelClass}`}
          >
            {config.label}
          </span>
        </div>

        {/* Screen-reader announcement of risk level */}
        <p className="sr-only">Nivel de riesgo: {config.label}.</p>

        {/* Summary */}
        <p className="text-sm leading-relaxed text-slate-700">
          {diagnosis.summary}
        </p>

        {/* Main risk factor — hidden when risk is bajo */}
        {diagnosis.mainRiskFactor && (
          <div className="mt-3 border-t border-slate-200/60 pt-3">
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
