import type { CurrencyCode } from "@/config/currencies";
import type { RiskLevel } from "@/domain/diagnosis";
import { formatCurrency } from "@/format/currency";
import { RISK_THEME } from "@/components/shared/riskTheme";

interface ResultsSummaryProps {
  operatingProfit: number;
  currency: CurrencyCode;
  riskLevel: RiskLevel;
  breakevenMinUnits: number | null;
}

export function ResultsSummary({
  operatingProfit,
  currency,
  riskLevel,
  breakevenMinUnits,
}: ResultsSummaryProps) {
  const isProfitable = operatingProfit > 0;
  const isBreakeven = operatingProfit === 0;

  const borderColor = isProfitable
    ? "border-l-emerald-500"
    : isBreakeven
      ? "border-l-slate-400"
      : "border-l-red-500";

  const bgClass = isProfitable
    ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-100 dark:from-emerald-950/40 dark:to-slate-900 dark:border-emerald-900"
    : isBreakeven
      ? "bg-gradient-to-br from-slate-50 to-white border-slate-200 dark:from-slate-800/60 dark:to-slate-900 dark:border-slate-700"
      : "bg-gradient-to-br from-red-50 to-white border-red-100 dark:from-red-950/40 dark:to-slate-900 dark:border-red-900";

  const valueColorClass = isProfitable
    ? "text-emerald-700 dark:text-emerald-400"
    : isBreakeven
      ? "text-slate-700 dark:text-slate-300"
      : "text-red-700 dark:text-red-400";

  const label = isProfitable
    ? "Utilidad operativa mensual estimada"
    : isBreakeven
      ? "Punto de equilibrio exacto"
      : "Pérdida operativa mensual estimada";

  const icon = isProfitable ? "▲" : isBreakeven ? "=" : "▼";

  const chip = RISK_THEME[riskLevel];

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-l-4 shadow-sm ${bgClass} ${borderColor}`}
    >
      {/* Main KPI */}
      <div className="p-6">
        <p className="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>

        <div className="flex items-baseline gap-3">
          <span className={`text-xl font-bold ${valueColorClass}`} aria-hidden="true">
            {icon}
          </span>
          <p className={`text-4xl font-bold tracking-tight sm:text-5xl ${valueColorClass}`}>
            {formatCurrency(Math.abs(operatingProfit), currency)}
          </p>
        </div>

        {isProfitable && (
          <p className="mt-3 text-sm text-emerald-700/80 dark:text-emerald-400/80">
            Antes de impuestos y costos no incluidos en el formulario.
          </p>
        )}
        {!isProfitable && !isBreakeven && (
          <p className="mt-3 text-sm text-red-600/80 dark:text-red-400/80">
            El negocio pierde{" "}
            <strong>{formatCurrency(Math.abs(operatingProfit), currency)}</strong>{" "}
            al mes con las condiciones actuales.
          </p>
        )}
        {isBreakeven && (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Los ingresos cubren exactamente los costos. No hay pérdida ni ganancia.
          </p>
        )}
      </div>

      {/* Mini-KPI strip */}
      <div className="flex flex-wrap items-center gap-3 border-t border-black/5 px-6 py-3 dark:border-white/5">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${chip.badgeClass}`}
        >
          <span aria-hidden="true">{chip.icon}</span>
          {chip.label}
        </span>

        {breakevenMinUnits !== null && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-600 dark:text-slate-300">Equilibrio:</span>{" "}
            <strong className="font-semibold text-slate-700 dark:text-slate-200">
              {breakevenMinUnits.toLocaleString("es-CO")} unidades
            </strong>
          </span>
        )}
      </div>
    </div>
  );
}
