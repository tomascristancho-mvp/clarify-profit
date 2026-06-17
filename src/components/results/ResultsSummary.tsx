import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ResultsSummaryProps {
  operatingProfit: number;
  currency: CurrencyCode;
}

export function ResultsSummary({ operatingProfit, currency }: ResultsSummaryProps) {
  const isProfitable = operatingProfit > 0;
  const isBreakeven = operatingProfit === 0;

  const colorClasses = isProfitable
    ? "border-emerald-300 bg-emerald-50"
    : isBreakeven
    ? "border-slate-300 bg-slate-50"
    : "border-red-300 bg-red-50";

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

  const arrow = isProfitable ? "▲" : isBreakeven ? "=" : "▼";

  return (
    <div className={`rounded-xl border-2 p-6 ${colorClasses}`}>
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 text-2xl ${valueColorClass}`}
          aria-hidden="true"
        >
          {arrow}
        </span>
        <div>
          <p className="mb-1 text-sm font-medium text-slate-600">{label}</p>
          <p className={`text-3xl font-bold ${valueColorClass}`}>
            {formatCurrency(Math.abs(operatingProfit), currency)}
          </p>
          {isProfitable && (
            <p className="mt-1 text-sm text-emerald-700">
              Antes de impuestos y costos no incluidos en el formulario.
            </p>
          )}
          {!isProfitable && !isBreakeven && (
            <p className="mt-1 text-sm text-red-600">
              El negocio pierde{" "}
              {formatCurrency(Math.abs(operatingProfit), currency)} al mes con
              las condiciones actuales.
            </p>
          )}
          {isBreakeven && (
            <p className="mt-1 text-sm text-slate-600">
              Los ingresos cubren exactamente los costos. No hay pérdida ni
              ganancia.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
