import type {
  ValidatedInputs,
  CalculationResult,
  BreakevenUnits,
  BreakevenRevenue,
  IndicatorResult,
} from "@/domain/types";

// All functions return raw floating-point values without rounding.
// Rounding happens only at the presentation layer (format/) via Intl.NumberFormat.
// This prevents accumulated rounding error in chained calculations.

export function calcularIngresosMensuales(
  pricePerUnit: number,
  estimatedUnits: number
): number {
  return pricePerUnit * estimatedUnits;
}

export function calcularCostosVariablesTotales(
  variableCostPerUnit: number,
  estimatedUnits: number
): number {
  return variableCostPerUnit * estimatedUnits;
}

export function calcularCostosTotales(
  fixedCosts: number,
  totalVariableCosts: number
): number {
  return fixedCosts + totalVariableCosts;
}

export function calcularUtilidadOperativa(
  monthlyRevenue: number,
  totalCosts: number
): number {
  return monthlyRevenue - totalCosts;
}

export function calcularMargenContribucionUnitario(
  pricePerUnit: number,
  variableCostPerUnit: number
): number {
  return pricePerUnit - variableCostPerUnit;
}

// Returns a valid percentage (can be 0 or negative) because pricePerUnit > 0 is guaranteed by validation.
export function calcularMargenContribucionPct(
  contributionMarginPerUnit: number,
  pricePerUnit: number
): IndicatorResult<number> {
  return {
    status: "valido",
    value: (contributionMarginPerUnit / pricePerUnit) * 100,
  };
}

export function calcularPuntoEquilibrioUnidades(
  fixedCosts: number,
  contributionMarginPerUnit: number
): IndicatorResult<BreakevenUnits> {
  if (contributionMarginPerUnit <= 0) {
    return {
      status: "no_alcanzable",
      reason:
        "El precio de venta no cubre el costo variable por unidad. No existe punto de equilibrio posible con estas condiciones.",
    };
  }
  const exact = fixedCosts / contributionMarginPerUnit;
  return {
    status: "valido",
    value: {
      exact,
      minimumWholeUnits: Math.ceil(exact),
    },
  };
}

export function calcularPuntoEquilibrioVentas(
  fixedCosts: number,
  contributionMarginPerUnit: number,
  pricePerUnit: number
): IndicatorResult<BreakevenRevenue> {
  if (contributionMarginPerUnit <= 0) {
    return {
      status: "no_alcanzable",
      reason:
        "El precio de venta no cubre el costo variable por unidad. No existe punto de equilibrio posible con estas condiciones.",
    };
  }
  // theoretical = fixedCosts / (contributionMarginPct / 100)
  //             = fixedCosts / (contributionMarginPerUnit / pricePerUnit)
  const marginPctDecimal = contributionMarginPerUnit / pricePerUnit;
  const theoretical = fixedCosts / marginPctDecimal;
  const minimumWholeUnits = Math.ceil(fixedCosts / contributionMarginPerUnit);
  return {
    status: "valido",
    value: {
      theoretical,
      atMinimumWholeUnits: minimumWholeUnits * pricePerUnit,
    },
  };
}

export function calcularROIMensual(
  operatingProfit: number,
  initialInvestment: number
): IndicatorResult<number> {
  if (initialInvestment === 0) {
    return {
      status: "no_aplica",
      reason: "No hay inversión inicial registrada.",
    };
  }
  return {
    status: "valido",
    value: (operatingProfit / initialInvestment) * 100,
  };
}

export function calcularTiempoRecuperacion(
  initialInvestment: number,
  operatingProfit: number
): IndicatorResult<number> {
  if (initialInvestment === 0) {
    return {
      status: "no_aplica",
      reason: "No hay inversión inicial registrada.",
    };
  }
  if (operatingProfit <= 0) {
    return {
      status: "no_aplica",
      reason:
        "El negocio opera con pérdidas o utilidad cero. La inversión inicial no puede recuperarse con las condiciones actuales.",
    };
  }
  return {
    status: "valido",
    value: initialInvestment / operatingProfit,
  };
}

// Main entry point: runs all calculations from validated inputs.
export function calcular(inputs: ValidatedInputs): CalculationResult {
  const monthlyRevenue = calcularIngresosMensuales(
    inputs.pricePerUnit,
    inputs.estimatedUnits
  );
  const totalVariableCosts = calcularCostosVariablesTotales(
    inputs.variableCostPerUnit,
    inputs.estimatedUnits
  );
  const totalCosts = calcularCostosTotales(inputs.fixedCosts, totalVariableCosts);
  const operatingProfit = calcularUtilidadOperativa(monthlyRevenue, totalCosts);
  const contributionMarginPerUnit = calcularMargenContribucionUnitario(
    inputs.pricePerUnit,
    inputs.variableCostPerUnit
  );
  const contributionMarginPct = calcularMargenContribucionPct(
    contributionMarginPerUnit,
    inputs.pricePerUnit
  );
  const breakevenUnits = calcularPuntoEquilibrioUnidades(
    inputs.fixedCosts,
    contributionMarginPerUnit
  );
  const breakevenRevenue = calcularPuntoEquilibrioVentas(
    inputs.fixedCosts,
    contributionMarginPerUnit,
    inputs.pricePerUnit
  );
  const monthlyROI = calcularROIMensual(operatingProfit, inputs.initialInvestment);
  const recoveryTimeMonths = calcularTiempoRecuperacion(
    inputs.initialInvestment,
    operatingProfit
  );

  return {
    monthlyRevenue,
    totalVariableCosts,
    totalCosts,
    operatingProfit,
    contributionMarginPerUnit,
    contributionMarginPct,
    breakevenUnits,
    breakevenRevenue,
    monthlyROI,
    recoveryTimeMonths,
  };
}
