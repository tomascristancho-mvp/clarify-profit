import type { ValidatedInputs, CalculationResult } from "@/domain/types";
import type { RiskLevel } from "@/domain/diagnosis";
import { calcular } from "@/domain/calculations";
import { calcularEscenarios } from "@/domain/scenarios";
import { diagnosticarNegocio } from "@/domain/diagnosis";

export type WhatIfVariable = "price" | "units" | "variableCost" | "fixedCosts";

export interface WhatIfSimulation {
  variable: WhatIfVariable;
  adjustmentPct: number;
  label: string;
  newProfit: number;
  profitDelta: number;
  newBreakevenUnits: number | null;
  riskLevel: RiskLevel;
}

const PRICE_ADJUSTMENTS = [-0.2, -0.1, 0.1, 0.2] as const;
const UNIT_ADJUSTMENTS = [-0.3, -0.15, 0.15, 0.3] as const;
const VARIABLE_COST_ADJUSTMENTS = [-0.1, 0.1] as const;
const FIXED_COST_ADJUSTMENTS = [-0.1, 0.1] as const;

function formatAdjustmentLabel(pct: number): string {
  const n = Math.round(pct * 100);
  return n > 0 ? `+${n}%` : `${n}%`;
}

function simulate(
  variable: WhatIfVariable,
  adjustmentPct: number,
  newInputs: ValidatedInputs,
  baseProfit: number,
  labelPrefix: string
): WhatIfSimulation {
  const calc = calcular(newInputs);
  const scenarios = calcularEscenarios(newInputs);
  const diagnosis = diagnosticarNegocio(newInputs, calc, scenarios);

  const newBreakevenUnits =
    calc.breakevenUnits.status === "valido"
      ? calc.breakevenUnits.value.minimumWholeUnits
      : null;

  return {
    variable,
    adjustmentPct,
    label: `${labelPrefix} ${formatAdjustmentLabel(adjustmentPct)}`,
    newProfit: calc.operatingProfit,
    profitDelta: calc.operatingProfit - baseProfit,
    newBreakevenUnits,
    riskLevel: diagnosis.riskLevel,
  };
}

export function simularCambios(
  inputs: ValidatedInputs,
  currentResult: CalculationResult
): WhatIfSimulation[] {
  const base = currentResult.operatingProfit;
  const sims: WhatIfSimulation[] = [];

  for (const pct of PRICE_ADJUSTMENTS) {
    sims.push(
      simulate("price", pct, { ...inputs, pricePerUnit: inputs.pricePerUnit * (1 + pct) }, base, "Precio")
    );
  }

  for (const pct of UNIT_ADJUSTMENTS) {
    sims.push(
      simulate("units", pct, { ...inputs, estimatedUnits: Math.round(inputs.estimatedUnits * (1 + pct)) }, base, "Unidades")
    );
  }

  for (const pct of VARIABLE_COST_ADJUSTMENTS) {
    sims.push(
      simulate("variableCost", pct, { ...inputs, variableCostPerUnit: inputs.variableCostPerUnit * (1 + pct) }, base, "Costo variable")
    );
  }

  for (const pct of FIXED_COST_ADJUSTMENTS) {
    sims.push(
      simulate("fixedCosts", pct, { ...inputs, fixedCosts: inputs.fixedCosts * (1 + pct) }, base, "Costos fijos")
    );
  }

  return sims;
}
