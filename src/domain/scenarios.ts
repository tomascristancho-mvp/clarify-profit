import type { ValidatedInputs, ScenarioResult, IndicatorResult } from "@/domain/types";
import { SCENARIOS } from "@/config/scenarios";
import {
  calcularIngresosMensuales,
  calcularCostosVariablesTotales,
  calcularCostosTotales,
  calcularUtilidadOperativa,
} from "@/domain/calculations";

// Units per scenario are whole numbers (Math.round), because you cannot sell fractions of a unit.
// Math.round is used — not floor or ceil — to avoid systematic bias toward under- or over-estimating
// across all three scenarios. See config/scenarios.ts for the factor values.
function calcularUnidadesEscenario(estimatedUnits: number, factor: number): number {
  return Math.round(estimatedUnits * factor);
}

function calcularMargenOperativoPct(
  operatingProfit: number,
  revenue: number
): IndicatorResult<number> {
  if (revenue === 0) {
    return {
      status: "no_aplica",
      reason: "Los ingresos son cero; no se puede calcular el margen sobre ventas.",
    };
  }
  return {
    status: "valido",
    value: (operatingProfit / revenue) * 100,
  };
}

export function calcularEscenarios(inputs: ValidatedInputs): ScenarioResult[] {
  return SCENARIOS.map(({ key, label, factor }) => {
    const units = calcularUnidadesEscenario(inputs.estimatedUnits, factor);
    const revenue = calcularIngresosMensuales(inputs.pricePerUnit, units);
    const variableCosts = calcularCostosVariablesTotales(
      inputs.variableCostPerUnit,
      units
    );
    const totalCosts = calcularCostosTotales(inputs.fixedCosts, variableCosts);
    const operatingProfit = calcularUtilidadOperativa(revenue, totalCosts);
    const operatingMarginPct = calcularMargenOperativoPct(operatingProfit, revenue);

    return {
      key,
      label,
      factor,
      units,
      revenue,
      variableCosts,
      totalCosts,
      operatingProfit,
      operatingMarginPct,
    };
  });
}
