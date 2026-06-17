import type { CurrencyCode } from "@/config/currencies";
import { formatCurrency } from "@/format/currency";

interface ProfitBreakdownChartProps {
  monthlyRevenue: number;
  totalCosts: number;
  operatingProfit: number;
  currency: CurrencyCode;
}

interface BarRow {
  id: string;
  label: string;
  value: number;
  pct: number;
  barClass: string;
  valueClass: string;
  trackClass: string;
}

export function ProfitBreakdownChart({
  monthlyRevenue,
  totalCosts,
  operatingProfit,
  currency,
}: ProfitBreakdownChartProps) {
  if (monthlyRevenue <= 0 && totalCosts <= 0) return null;

  const maxValue = Math.max(Math.abs(monthlyRevenue), Math.abs(totalCosts), 1);
  const isLoss = operatingProfit < 0;

  const rows: BarRow[] = [
    {
      id: "revenue",
      label: "Ingresos",
      value: monthlyRevenue,
      pct: Math.min(100, (monthlyRevenue / maxValue) * 100),
      barClass: "bg-indigo-500",
      valueClass: "text-indigo-700",
      trackClass: "bg-indigo-100",
    },
    {
      id: "costs",
      label: "Costos",
      value: totalCosts,
      pct: Math.min(100, (totalCosts / maxValue) * 100),
      barClass: "bg-slate-400",
      valueClass: "text-slate-600",
      trackClass: "bg-slate-100",
    },
    {
      id: "profit",
      label: isLoss ? "Pérdida" : "Utilidad",
      value: Math.abs(operatingProfit),
      pct: Math.min(100, (Math.abs(operatingProfit) / maxValue) * 100),
      barClass: isLoss ? "bg-red-500" : "bg-emerald-500",
      valueClass: isLoss ? "text-red-700" : "text-emerald-700",
      trackClass: isLoss ? "bg-red-50" : "bg-emerald-50",
    },
  ];

  const ariaLabel =
    `Desglose financiero mensual. ` +
    `Ingresos: ${formatCurrency(monthlyRevenue, currency)}. ` +
    `Costos totales: ${formatCurrency(totalCosts, currency)}. ` +
    `${isLoss ? "Pérdida" : "Utilidad"}: ${formatCurrency(Math.abs(operatingProfit), currency)}.`;

  return (
    <figure role="img" aria-label={ariaLabel} className="space-y-3">
      {rows.map(({ id, label, value, pct, barClass, valueClass, trackClass }) => (
        <div key={id} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-right text-xs font-medium text-slate-500">
            {label}
          </span>

          {/* Bar track */}
          <div
            className={`relative flex-1 overflow-hidden rounded-full ${trackClass} h-5`}
            aria-hidden="true"
          >
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${barClass}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Value */}
          <span className={`w-28 shrink-0 text-right text-xs font-semibold ${valueClass}`}>
            {formatCurrency(value, currency)}
          </span>
        </div>
      ))}
    </figure>
  );
}
