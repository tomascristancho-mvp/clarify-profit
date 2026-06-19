import type { WhatIfSimulation } from "@/domain/whatIf";
import type { CurrencyCode } from "@/config/currencies";
import type { RiskLevel } from "@/domain/diagnosis";
import { formatCurrency } from "@/format/currency";

interface WhatIfSimulatorProps {
  simulations: WhatIfSimulation[];
  currency: CurrencyCode;
}

const RISK_BADGE: Record<RiskLevel, { label: string; icon: string; className: string }> = {
  bajo: {
    label: "Bajo riesgo",
    icon: "✓",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  medio: {
    label: "Riesgo moderado",
    icon: "!",
    className: "text-amber-700 bg-amber-50 border-amber-200",
  },
  alto: {
    label: "Riesgo alto",
    icon: "⚠",
    className: "text-orange-700 bg-orange-50 border-orange-200",
  },
  no_viable: {
    label: "No viable",
    icon: "✕",
    className: "text-red-700 bg-red-50 border-red-200",
  },
};

// ── Insight chip (best / worst) ────────────────────────────────────────────

const INSIGHT_STYLE = {
  best: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    headingColor: "text-emerald-700",
    valueColor: "text-emerald-800",
    icon: "↑",
    label: "Mejor palanca",
  },
  worst: {
    bg: "bg-red-50",
    border: "border-red-200",
    headingColor: "text-red-700",
    valueColor: "text-red-800",
    icon: "↓",
    label: "Mayor riesgo",
  },
} as const;

interface InsightChipProps {
  variant: "best" | "worst";
  simulation: WhatIfSimulation;
  currency: CurrencyCode;
}

function InsightChip({ variant, simulation, currency }: InsightChipProps) {
  const style = INSIGHT_STYLE[variant];
  const badge = RISK_BADGE[simulation.riskLevel];
  const isNeg = simulation.profitDelta < 0;
  const sign = simulation.profitDelta > 0 ? "+" : isNeg ? "−" : "";

  return (
    <div className={`rounded-lg border p-3 ${style.border} ${style.bg}`}>
      <div className="mb-1 flex items-center gap-1.5">
        <span className={`text-sm font-bold ${style.valueColor}`} aria-hidden="true">
          {style.icon}
        </span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${style.headingColor}`}>
          {style.label}
        </span>
      </div>
      <p className={`mb-0.5 text-sm font-semibold ${style.valueColor}`}>{simulation.label}</p>
      <p className={`mb-2 text-xs font-medium ${style.valueColor}`}>
        {sign}{formatCurrency(Math.abs(simulation.profitDelta), currency)} vs. actual
      </p>
      <span
        className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs font-medium ${badge.className}`}
      >
        <span aria-hidden="true">{badge.icon}</span>
        {badge.label}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function WhatIfSimulator({ simulations, currency }: WhatIfSimulatorProps) {
  if (simulations.length === 0) return null;

  const sortedAll = [...simulations].sort((a, b) => b.profitDelta - a.profitDelta);
  const bestSim = sortedAll.at(0);
  const worstSim = sortedAll.at(-1);

  const showBest = bestSim !== undefined && bestSim.profitDelta > 0;
  const showWorst = worstSim !== undefined && worstSim.profitDelta < 0;
  const showInsights = showBest || showWorst;

  return (
    <section aria-labelledby="whatif-heading">
      <h3 id="whatif-heading" className="mb-1 text-lg font-semibold text-slate-800">
        Simulador: ¿Qué pasa si…?
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        Vista rápida de las dos señales más importantes: la variable que más
        podría mejorar la utilidad y la que más podría empeorarla.
      </p>

      {/* Insights — free tier */}
      {showInsights && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {showBest && bestSim && (
            <InsightChip variant="best" simulation={bestSim} currency={currency} />
          )}
          {showWorst && worstSim && (
            <InsightChip variant="worst" simulation={worstSim} currency={currency} />
          )}
        </div>
      )}

    </section>
  );
}
