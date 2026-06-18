import type { CalculationResult, BreakevenUnits } from "@/domain/types";
import type { CurrencyCode } from "@/config/currencies";
import { IndicatorCard } from "./IndicatorCard";
import { ProfitBreakdownChart } from "@/components/charts/ProfitBreakdownChart";
import { formatCurrency } from "@/format/currency";
import { formatPercentage } from "@/format/percentage";

interface IndicatorsGridProps {
  result: CalculationResult;
  currency: CurrencyCode;
}

export function IndicatorsGrid({ result, currency }: IndicatorsGridProps) {
  return (
    <section aria-labelledby="indicators-heading">
      <h3
        id="indicators-heading"
        className="mb-4 text-lg font-semibold text-slate-800"
      >
        Indicadores principales
      </h3>

      {/* Visual breakdown chart */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Desglose mensual
        </p>
        <ProfitBreakdownChart
          monthlyRevenue={result.monthlyRevenue}
          totalVariableCosts={result.totalVariableCosts}
          totalCosts={result.totalCosts}
          operatingProfit={result.operatingProfit}
          currency={currency}
        />
      </div>

      {/* Indicator cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <IndicatorCard
          title="Margen de contribución"
          result={result.contributionMarginPct}
          formatValue={(pct) => (
            <>
              <span className="block">
                {formatCurrency(result.contributionMarginPerUnit, currency)}
              </span>
              <span className="block text-base font-normal text-slate-500">
                {formatPercentage(pct)} del precio de venta
              </span>
            </>
          )}
          explanation="Por cada unidad vendida, cuánto queda para cubrir los costos fijos y generar utilidad. Si es negativo o cero, las ventas agravan las pérdidas."
        />

        <IndicatorCard
          title="Punto de equilibrio"
          result={result.breakevenUnits}
          formatValue={(pe: BreakevenUnits) =>
            `${pe.minimumWholeUnits} unidades al mes`
          }
          explanation="Cantidad mínima de unidades que debes vender al mes para no tener pérdida ni ganancia. Por encima de esta cifra empiezas a generar utilidad."
        />

        <IndicatorCard
          title="ROI mensual estimado"
          result={result.monthlyROI}
          formatValue={(roi) => formatPercentage(roi)}
          explanation="Estimación del retorno mensual sobre la inversión inicial. Es una referencia aproximada, no una tasa contable definitiva."
        />

        <IndicatorCard
          title="Tiempo de recuperación"
          result={result.recoveryTimeMonths}
          formatValue={(months) => {
            const rounded = Math.ceil(months);
            return `${rounded} ${rounded === 1 ? "mes" : "meses"}`;
          }}
          explanation="Estimación de cuántos meses necesitarías para recuperar la inversión inicial con la utilidad actual. Solo aplica cuando hay utilidad positiva."
        />
      </div>

      {result.breakevenRevenue.status === "valido" && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="mb-1 font-semibold text-slate-700">
            Ventas necesarias para el equilibrio
          </p>
          <p className="text-slate-600">
            Teórico:{" "}
            <strong className="text-slate-800">
              {formatCurrency(result.breakevenRevenue.value.theoretical, currency)}
            </strong>
            {" · "}
            Vendiendo unidades completas:{" "}
            <strong className="text-slate-800">
              {formatCurrency(
                result.breakevenRevenue.value.atMinimumWholeUnits,
                currency
              )}
            </strong>
          </p>
        </div>
      )}
    </section>
  );
}
