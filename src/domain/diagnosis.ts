import type { ValidatedInputs, CalculationResult, ScenarioResult } from "@/domain/types";

export type RiskLevel = "bajo" | "medio" | "alto" | "no_viable";

export interface DiagnosisResult {
  riskLevel: RiskLevel;
  summary: string;
  mainRiskFactor: string | null;
}

// Generates an executive diagnosis from calculation results.
// Pure function — no React, no external calls. Rules evaluated in strict priority order.
// Never returns NaN, Infinity, undefined, or an empty summary.
export function diagnosticarNegocio(
  inputs: ValidatedInputs,
  result: CalculationResult,
  scenarios: ScenarioResult[]
): DiagnosisResult {
  // Rule 1: No viable — price does not cover variable cost per unit.
  // Every additional sale increases the loss; selling more cannot fix this.
  if (result.contributionMarginPerUnit <= 0) {
    return {
      riskLevel: "no_viable",
      summary:
        "Con el precio y costo variable actuales, cada unidad vendida genera una pérdida. " +
        "Vender más no mejoraría la situación. " +
        "Para que el negocio sea viable habría que aumentar el precio o reducir el costo variable por unidad.",
      mainRiskFactor:
        "El precio de venta no cubre el costo de producción por unidad.",
    };
  }

  // Rule 2: Alto — margin is positive but estimated sales produce a loss.
  if (result.operatingProfit < 0) {
    const parts: string[] = [
      "Con las ventas estimadas, el negocio opera con pérdidas mensuales.",
    ];
    if (
      result.breakevenUnits.status === "valido" &&
      result.breakevenUnits.value.minimumWholeUnits > inputs.estimatedUnits
    ) {
      parts.push(
        `Para cubrir todos los costos necesitarías vender al menos ${result.breakevenUnits.value.minimumWholeUnits} unidades al mes; actualmente proyectas ${inputs.estimatedUnits}.`
      );
    }
    parts.push(
      "La situación podría mejorar aumentando las ventas, revisando el precio o reduciendo los costos fijos."
    );
    return {
      riskLevel: "alto",
      summary: parts.join(" "),
      mainRiskFactor: "Las ventas estimadas no alcanzan el punto de equilibrio.",
    };
  }

  // Rules 3 & 4: profit >= 0 — evaluate medium-risk conditions in priority order.
  const pesimista = scenarios.find((s) => s.key === "pesimista");
  const pesimistLoss = pesimista !== undefined && pesimista.operatingProfit < 0;

  // Coverage ratio: how far above the breakeven point are the estimated sales?
  // Only computed when breakeven is calculable and non-zero (avoids division by zero).
  let lowCoverage = false;
  if (
    result.breakevenUnits.status === "valido" &&
    result.breakevenUnits.value.exact > 0
  ) {
    const coverageRatio = inputs.estimatedUnits / result.breakevenUnits.value.exact;
    lowCoverage = coverageRatio < 1.3;
  }

  const lowMargin =
    result.contributionMarginPct.status === "valido" &&
    result.contributionMarginPct.value < 20;

  if (pesimistLoss) {
    return {
      riskLevel: "medio",
      summary:
        "El negocio es rentable con las ventas esperadas, pero podría operar con pérdidas " +
        "si las ventas caen un 30%. Los resultados son sensibles al volumen de ventas.",
      mainRiskFactor:
        "En el escenario pesimista (70% de las ventas estimadas), el negocio operaría con pérdidas.",
    };
  }

  if (lowCoverage) {
    return {
      riskLevel: "medio",
      summary:
        "El negocio genera utilidad, pero opera cerca de su punto de equilibrio. " +
        "Una caída moderada en las ventas o un aumento en los costos podría resultar en pérdidas.",
      mainRiskFactor: "El margen de seguridad sobre el punto de equilibrio es menor al 30%.",
    };
  }

  if (lowMargin) {
    return {
      riskLevel: "medio",
      summary:
        "El negocio genera utilidad, pero con un margen de contribución menor al 20% del precio. " +
        "Esto lo hace más vulnerable a cambios en precios o aumentos en los costos variables.",
      mainRiskFactor: "El margen de contribución es menor al 20% del precio de venta.",
    };
  }

  // Rule 4: Bajo — no risk conditions detected.
  return {
    riskLevel: "bajo",
    summary:
      "Con los datos ingresados, el negocio muestra indicadores sólidos: genera utilidad, " +
      "tiene un margen de seguridad cómodo sobre el punto de equilibrio y sería rentable " +
      "incluso en el escenario pesimista.",
    mainRiskFactor: null,
  };
}
