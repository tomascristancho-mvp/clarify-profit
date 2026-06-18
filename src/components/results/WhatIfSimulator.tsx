import type { WhatIfSimulation, WhatIfVariable } from "@/domain/whatIf";
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

const GROUP_ORDER: WhatIfVariable[] = ["price", "units", "variableCost", "fixedCosts"];

const GROUP_CONFIG: Record<WhatIfVariable, { heading: string; gridClass: string }> = {
  price: {
    heading: "Precio de venta",
    gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  units: {
    heading: "Unidades vendidas",
    gridClass: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  variableCost: {
    heading: "Costo variable por unidad",
    gridClass: "grid-cols-1 sm:grid-cols-2",
  },
  fixedCosts: {
    heading: "Costos fijos mensuales",
    gridClass: "grid-cols-1 sm:grid-cols-2",
  },
};

// ── Compact simulation card ────────────────────────────────────────────────

interface SimCardProps {
  simulation: WhatIfSimulation;
  currency: CurrencyCode;
  maxAbsDelta: number;
}

function SimCard({ simulation, currency, maxAbsDelta }: SimCardProps) {
  const badge = RISK_BADGE[simulation.riskLevel];
  const isPositive = simulation.profitDelta > 0;
  const isNegative = simulation.profitDelta < 0;

  const deltaColor = isPositive
    ? "text-emerald-700"
    : isNegative
    ? "text-red-600"
    : "text-slate-500";

  const deltaSign = isPositive ? "+" : isNegative ? "−" : "";

  // Proportional bar width — numeric delta is also shown as text (not color-only)
  const barPct = maxAbsDelta > 0
    ? Math.round((Math.abs(simulation.profitDelta) / maxAbsDelta) * 100)
    : 0;
  const barFill = isPositive ? "bg-emerald-400" : isNegative ? "bg-red-400" : "bg-slate-300";

  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      {/* Label */}
      <p className="mb-1 text-xs font-semibold text-slate-700">{simulation.label}</p>

      {/* New profit */}
      <p
        className={`mb-0.5 text-lg font-bold leading-tight ${
          simulation.newProfit < 0 ? "text-red-700" : "text-slate-900"
        }`}
      >
        <span className="sr-only">Utilidad estimada: </span>
        {simulation.newProfit < 0 && "−"}
        {formatCurrency(Math.abs(simulation.newProfit), currency)}
      </p>

      {/* Delta — numeric value always visible */}
      <p className={`mb-2 text-xs font-medium ${deltaColor}`}>
        <span className="sr-only">
          {isPositive ? "Mejora" : isNegative ? "Empeora" : "Sin cambio"}:{" "}
        </span>
        {deltaSign}
        {formatCurrency(Math.abs(simulation.profitDelta), currency)} vs. actual
      </p>

      {/* Mini impact bar — proportion of biggest delta in the set */}
      <div
        className="mb-2 h-1 w-full overflow-hidden rounded-full bg-slate-100"
        aria-hidden="true"
      >
        <div className={`h-full rounded-full ${barFill}`} style={{ width: `${barPct}%` }} />
      </div>

      {/* Risk badge — always visible as text */}
      <div className="mt-auto">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${badge.className}`}
        >
          <span aria-hidden="true">{badge.icon}</span>
          {badge.label}
        </span>
      </div>
    </article>
  );
}

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

  // Proportional scale for mini bars
  const maxAbsDelta = Math.max(1, ...simulations.map((s) => Math.abs(s.profitDelta)));

  // Best and worst across all groups
  const sortedAll = [...simulations].sort((a, b) => b.profitDelta - a.profitDelta);
  const bestSim = sortedAll.at(0);
  const worstSim = sortedAll.at(-1);

  // Only show a chip when the direction is meaningful
  const showBest = bestSim !== undefined && bestSim.profitDelta > 0;
  const showWorst = worstSim !== undefined && worstSim.profitDelta < 0;
  const showInsights = showBest || showWorst;

  // Group simulations by variable
  const grouped = new Map<WhatIfVariable, WhatIfSimulation[]>();
  for (const sim of simulations) {
    const group = grouped.get(sim.variable) ?? [];
    group.push(sim);
    grouped.set(sim.variable, group);
  }

  return (
    <section aria-labelledby="whatif-heading">
      <h3 id="whatif-heading" className="mb-1 text-lg font-semibold text-slate-800">
        Simulador: ¿Qué pasa si…?
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        Explora cómo cambiaría la utilidad mensual si ajustaras una variable clave. Son estimaciones basadas en los mismos datos ingresados.
      </p>

      {/* Insights strip — only shown when there is meaningful variation */}
      {showInsights && (
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {showBest && bestSim && (
            <InsightChip variant="best" simulation={bestSim} currency={currency} />
          )}
          {showWorst && worstSim && (
            <InsightChip variant="worst" simulation={worstSim} currency={currency} />
          )}
        </div>
      )}

      {/* Groups — cards sorted best → worst within each group */}
      <div className="flex flex-col gap-6">
        {GROUP_ORDER.map((variable) => {
          const group = grouped.get(variable);
          if (!group || group.length === 0) return null;
          const config = GROUP_CONFIG[variable];
          const sorted = [...group].sort((a, b) => b.profitDelta - a.profitDelta);

          return (
            <div key={variable}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {config.heading}
              </p>
              <div className={`grid gap-3 ${config.gridClass}`}>
                {sorted.map((sim) => (
                  <SimCard
                    key={sim.label}
                    simulation={sim}
                    currency={currency}
                    maxAbsDelta={maxAbsDelta}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
