import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ResultsSummaryProps {
  operatingProfit: number;
  currency: CurrencyCode;
}

export function ResultsSummary({ operatingProfit, currency }: ResultsSummaryProps) {
  const isProfitable = operatingProfit > 0;
  const isBreakeven = operatingProfit === 0;

  const borderColor = isProfitable
    ? "border-l-emerald-500"
    : isBreakeven
      ? "border-l-slate-400"
      : "border-l-red-500";

  const bgClass = isProfitable
    ? "bg-gradient-to-br from-emerald-50 to-white border-emerald-100"
    : isBreakeven
      ? "bg-gradient-to-br from-slate-50 to-white border-slate-200"
      : "bg-gradient-to-br from-red-50 to-white border-red-100";

  const valueColorClass = isProfitable
    ? "text-emerald-700"
    : isBreakeven
      ? "text-slate-700"
      : "text-red-700";

  const label = isProfitable
    ? "Utilidad operativa mensual estimada"
    : isBreakeven
      ? "Punto de equilibrio exacto"
      : "Pérdida operativa mensual estimada";

  const icon = isProfitable ? "▲" : isBreakeven ? "=" : "▼";

  return (
    <div
      className={`rounded-2xl border border-l-4 p-6 shadow-sm ${bgClass} ${borderColor}`}
    >
      <p className="mb-2 text-sm font-medium text-slate-500">{label}</p>

      <div className="flex items-baseline gap-3">
        <span
          className={`text-xl font-bold ${valueColorClass}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <p className={`text-4xl font-bold tracking-tight sm:text-5xl ${valueColorClass}`}>
          {formatCurrency(Math.abs(operatingProfit), currency)}
        </p>
      </div>

      {isProfitable && (
        <p className="mt-3 text-sm text-emerald-700/80">
          Antes de impuestos y costos no incluidos en el formulario.
        </p>
      )}
      {!isProfitable && !isBreakeven && (
        <p className="mt-3 text-sm text-red-600/80">
          El negocio pierde{" "}
          <strong>{formatCurrency(Math.abs(operatingProfit), currency)}</strong>{" "}
          al mes con las condiciones actuales.
        </p>
      )}
      {isBreakeven && (
        <p className="mt-3 text-sm text-slate-600">
          Los ingresos cubren exactamente los costos. No hay pérdida ni ganancia.
        </p>
      )}
    </div>
  );
}
