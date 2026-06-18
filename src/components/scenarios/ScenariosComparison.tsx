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
    headerBg: "border-red-100 bg-gradient-to-br from-red-50 to-white",
    borderColor: "border-l-red-400",
  },
  esperado: {
    label: "Esperado (100%)",
    labelColor: "text-indigo-700",
    headerBg: "border-indigo-100 bg-gradient-to-br from-indigo-50 to-white",
    borderColor: "border-l-indigo-500",
  },
  optimista: {
    label: "Optimista (130%)",
    labelColor: "text-emerald-700",
    headerBg: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    borderColor: "border-l-emerald-500",
  },
} as const;

interface ScenarioCardProps {
  scenario: ScenarioResult;
  currency: CurrencyCode;
}

function ScenarioCard({ scenario, currency }: ScenarioCardProps) {
  const theme = SCENARIO_THEME[scenario.key];
  const isProfit = scenario.operatingProfit > 0;
  const isLoss = scenario.operatingProfit < 0;
  const profitColor = isProfit
    ? "text-emerald-700"
    : isLoss
      ? "text-red-700"
      : "text-slate-700";

  return (
    <article
      className={`overflow-hidden rounded-xl border border-l-4 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme.borderColor}`}
      aria-label={`Escenario ${theme.label}`}
    >
      <div className={`border-b px-4 py-3 ${theme.headerBg}`}>
        <h4 className={`text-sm font-semibold ${theme.labelColor}`}>
          {theme.label}
        </h4>
        <p className="mt-0.5 text-lg font-bold text-slate-800">
          {scenario.units} unidades
        </p>
      </div>

      <dl className="grid grid-cols-1 gap-2 p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Ingresos</dt>
          <dd className="font-medium text-slate-800">
            {formatCurrency(scenario.revenue, currency)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Costos variables</dt>
          <dd className="font-medium text-slate-800">
            {formatCurrency(scenario.variableCosts, currency)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Costos totales</dt>
          <dd className="font-medium text-slate-800">
            {formatCurrency(scenario.totalCosts, currency)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-2">
          <dt className="font-semibold text-slate-700">
            {isProfit ? "Utilidad" : isLoss ? "Pérdida" : "Resultado"}
            <span aria-hidden="true" className="ml-1">
              {isProfit ? "▲" : isLoss ? "▼" : "="}
            </span>
          </dt>
          <dd className={`font-bold ${profitColor}`}>
            {isLoss && "−"}
            {formatCurrency(Math.abs(scenario.operatingProfit), currency)}
          </dd>
        </div>
        {scenario.operatingMarginPct.status === "valido" && (
          <div className="flex justify-between text-xs text-slate-400">
            <dt>Margen operativo</dt>
            <dd>{formatPercentage(scenario.operatingMarginPct.value)}</dd>
          </div>
        )}
      </dl>
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

      {/* Visual chart */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Utilidad por escenario
        </p>
        <div className="mx-auto max-w-xl">
          <ScenarioChart scenarios={scenarios} currency={currency} />
        </div>
      </div>

      {/* Scenario cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {scenarios.map((scenario) => (
          <ScenarioCard key={scenario.key} scenario={scenario} currency={currency} />
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Los escenarios ajustan únicamente las unidades vendidas. Los costos fijos y la
        inversión se mantienen constantes.
      </p>
    </section>
  );
}
