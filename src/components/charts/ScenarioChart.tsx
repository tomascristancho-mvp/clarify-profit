import type { ScenarioResult } from "@/domain/types";
import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ScenarioChartProps {
  scenarios: ScenarioResult[];
  currency: CurrencyCode;
}

const SCENARIO_STYLE = {
  pesimista: {
    barClass: "bg-red-400",
    labelClass: "text-red-700",
    shortLabel: "Pesimista",
  },
  esperado: {
    barClass: "bg-indigo-500",
    labelClass: "text-indigo-700",
    shortLabel: "Esperado",
  },
  optimista: {
    barClass: "bg-emerald-500",
    labelClass: "text-emerald-700",
    shortLabel: "Optimista",
  },
} as const;

export function ScenarioChart({ scenarios, currency }: ScenarioChartProps) {
  const maxAbs = Math.max(...scenarios.map((s) => Math.abs(s.operatingProfit)), 1);

  const ariaLabel =
    scenarios
      .map((s) => {
        const style = SCENARIO_STYLE[s.key];
        const sign = s.operatingProfit < 0 ? "−" : "";
        return `${style.shortLabel}: ${sign}${formatCurrency(Math.abs(s.operatingProfit), currency)}`;
      })
      .join(". ") + ".";

  return (
    <figure role="img" aria-label={`Comparación de escenarios. ${ariaLabel}`} className="w-full">
      {/* Bar area */}
      <div className="flex items-end gap-3 h-28 sm:h-36">
        {scenarios.map((scenario) => {
          const style = SCENARIO_STYLE[scenario.key];
          const barHeightPct = (Math.abs(scenario.operatingProfit) / maxAbs) * 100;
          const isLoss = scenario.operatingProfit < 0;
          const sign = isLoss ? "−" : "+";
          const valClass = isLoss ? "text-red-700" : style.labelClass;
          const barColor = isLoss ? "bg-red-400" : style.barClass;

          return (
            <div
              key={scenario.key}
              className="flex flex-1 flex-col items-center gap-1 min-w-0"
            >
              {/* Value label above bar */}
              <span
                className={`text-xs font-semibold leading-tight text-center truncate w-full px-0.5 ${valClass}`}
              >
                {sign}
                {formatCurrency(Math.abs(scenario.operatingProfit), currency)}
              </span>

              {/* Bar */}
              <div
                className={`w-full rounded-t-md ${barColor} transition-none`}
                style={{ height: `${Math.max(barHeightPct, 3)}%` }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {/* Baseline */}
      <div className="border-t-2 border-slate-200" aria-hidden="true" />

      {/* Scenario labels below */}
      <div className="flex gap-3 mt-1.5">
        {scenarios.map((scenario) => {
          const style = SCENARIO_STYLE[scenario.key];
          return (
            <span
              key={scenario.key}
              className={`flex-1 text-center text-xs font-medium ${style.labelClass}`}
            >
              {style.shortLabel}
            </span>
          );
        })}
      </div>
    </figure>
  );
}
