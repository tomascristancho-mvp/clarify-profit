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

interface SimCardProps {
  simulation: WhatIfSimulation;
  currency: CurrencyCode;
}

function SimCard({ simulation, currency }: SimCardProps) {
  const badge = RISK_BADGE[simulation.riskLevel];
  const isPositive = simulation.profitDelta > 0;
  const isNegative = simulation.profitDelta < 0;
  const deltaColor = isPositive
    ? "text-emerald-700"
    : isNegative
      ? "text-red-600"
      : "text-slate-500";

  return (
    <article className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-slate-800">{simulation.label}</p>

      <p
        className={`mb-1 text-base font-bold ${simulation.newProfit < 0 ? "text-red-700" : "text-slate-900"}`}
      >
        <span className="sr-only">Utilidad estimada: </span>
        {simulation.newProfit < 0 && "−"}
        {formatCurrency(Math.abs(simulation.newProfit), currency)}
      </p>

      <p className={`mb-3 text-xs font-medium ${deltaColor}`}>
        <span className="sr-only">
          {isPositive ? "Mejora" : isNegative ? "Empeora" : "Sin cambio"}:{" "}
        </span>
        {isPositive && "+"}
        {isNegative && "−"}
        {formatCurrency(Math.abs(simulation.profitDelta), currency)} vs. actual
      </p>

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

export function WhatIfSimulator({ simulations, currency }: WhatIfSimulatorProps) {
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
      <p className="mb-5 text-sm text-slate-500">
        Explora cómo cambiaría la utilidad mensual si ajustaras una variable clave. Son estimaciones basadas en los mismos datos ingresados.
      </p>

      <div className="flex flex-col gap-6">
        {GROUP_ORDER.map((variable) => {
          const group = grouped.get(variable);
          if (!group || group.length === 0) return null;
          const config = GROUP_CONFIG[variable];

          return (
            <div key={variable}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {config.heading}
              </p>
              <div className={`grid gap-3 ${config.gridClass}`}>
                {group.map((sim) => (
                  <SimCard key={sim.label} simulation={sim} currency={currency} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
