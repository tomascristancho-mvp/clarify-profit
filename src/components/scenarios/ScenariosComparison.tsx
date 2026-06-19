import type { ScenarioResult } from "@/domain/types";
import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";
import { formatPercentage } from "@/format/percentage";
import { ScenarioChart } from "@/components/charts/ScenarioChart";

interface ScenariosComparisonProps {
  scenarios: ScenarioResult[];
  currency: CurrencyCode;
}

const SCENARIO_THEME = {
  pesimista: {
    label: "Pesimista (70%)",
    labelColor: "text-red-700",
    borderColor: "border-l-red-400",
  },
  esperado: {
    label: "Esperado (100%)",
    labelColor: "text-indigo-700",
    borderColor: "border-l-indigo-500",
  },
  optimista: {
    label: "Optimista (130%)",
    labelColor: "text-emerald-700",
    borderColor: "border-l-emerald-500",
  },
} as const;

const SCENARIO_DOT = {
  pesimista: "bg-red-400",
  esperado: "bg-indigo-500",
  optimista: "bg-emerald-500",
} as const;

const SCENARIO_READING = {
  pesimista: "Refleja la resistencia del negocio ante una caída del 30% en unidades vendidas.",
  esperado: "Base de referencia con las condiciones actuales ingresadas.",
  optimista: "Muestra el potencial de la utilidad si las unidades crecen un 30%.",
} as const;

interface ScenarioCardProps {
  scenario: ScenarioResult;
  currency: CurrencyCode;
}

function ScenarioCard({ scenario, currency }: ScenarioCardProps) {
  const theme = SCENARIO_THEME[scenario.key];
  const isProfit = scenario.operatingProfit > 0;
  const isLoss = scenario.operatingProfit < 0;
  const profitColorClass = isProfit
    ? "text-emerald-700"
    : isLoss
      ? "text-red-600"
      : "text-slate-600";

  return (
    <article
      className={`rounded-xl border border-l-4 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme.borderColor}`}
      aria-label={`Escenario ${theme.label}`}
    >
      <h4 className={`mb-0.5 text-sm font-semibold ${theme.labelColor}`}>
        {theme.label}
      </h4>
      <p className="mb-3 text-xs text-slate-500">{scenario.units} unidades</p>

      <p className={`text-xl font-bold tracking-tight ${profitColorClass}`}>
        {isLoss && "−"}
        {formatCurrency(Math.abs(scenario.operatingProfit), currency)}
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        {isProfit ? "utilidad estimada" : isLoss ? "pérdida estimada" : "punto de equilibrio"}
      </p>

      {scenario.operatingMarginPct.status === "valido" && (
        <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-400">
          Margen: {formatPercentage(scenario.operatingMarginPct.value)}
        </p>
      )}
    </article>
  );
}

export function ScenariosComparison({
  scenarios,
  currency,
}: ScenariosComparisonProps) {
  return (
    <section aria-labelledby="scenarios-heading">
      <h3
        id="scenarios-heading"
        className="mb-4 text-lg font-semibold text-slate-800"
      >
        Comparación de escenarios
      </h3>

      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">

        {/* Zone 1: chart — full-width, framed on slate-50 background */}
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Utilidad por escenario
          </p>
          <div className="mx-auto max-w-lg">
            <ScenarioChart scenarios={scenarios} currency={currency} />
          </div>
        </div>

        {/* Zone 2: quick reading strip — 3 items in horizontal grid */}
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Lectura rápida
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {scenarios.map((scenario) => {
              const theme = SCENARIO_THEME[scenario.key];
              const dot = SCENARIO_DOT[scenario.key];
              const reading = SCENARIO_READING[scenario.key];
              const isProfit = scenario.operatingProfit > 0;
              const isLoss = scenario.operatingProfit < 0;
              const profitColorClass = isProfit
                ? "text-emerald-700"
                : isLoss
                  ? "text-red-600"
                  : "text-slate-600";

              return (
                <div key={scenario.key} className="flex items-start gap-2.5">
                  <span
                    className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${dot}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${theme.labelColor}`}>
                      {theme.label}{" "}
                      <span className={`font-normal ${profitColorClass}`}>
                        {isLoss && "−"}
                        {formatCurrency(Math.abs(scenario.operatingProfit), currency)}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {reading}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone 3: compact summary cards — 3 columns */}
        <div className="p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Resumen por escenario
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.key}
                scenario={scenario}
                currency={currency}
              />
            ))}
          </div>
        </div>

        {/* Footer: disclaimer */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3">
          <p className="text-xs leading-relaxed text-slate-400">
            Los escenarios ajustan únicamente las unidades vendidas. Los costos fijos
            y la inversión se mantienen constantes.
          </p>
        </div>

      </div>
    </section>
  );
}
