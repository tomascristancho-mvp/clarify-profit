export type ReverseResult =
  | { status: "alcanzable"; unitsNeeded: number; revenueNeeded: number }
  | { status: "no_alcanzable"; reason: string };

// Calculates the minimum units and revenue required to reach a monthly profit target.
// targetProfit = 0 returns the break-even point (consistent with calcularPuntoEquilibrioUnidades).
// Returns no_alcanzable when contributionMarginPerUnit <= 0.
// All inputs are expected to be finite, non-negative numbers (enforced by the UI layer).
export function calcularMetaUtilidad(
  targetProfit: number,
  contributionMarginPerUnit: number,
  fixedCosts: number,
  pricePerUnit: number
): ReverseResult {
  if (contributionMarginPerUnit <= 0) {
    return {
      status: "no_alcanzable",
      reason:
        "Con el precio y costo variable actuales, cada unidad vendida genera una pérdida o cubre exactamente su costo. " +
        "Ninguna cantidad de ventas puede alcanzar la meta. " +
        "Para cambiar esto, aumenta el precio o reduce el costo variable por unidad.",
    };
  }

  const exactUnits = (targetProfit + fixedCosts) / contributionMarginPerUnit;
  const unitsNeeded = Math.ceil(exactUnits);
  const revenueNeeded = unitsNeeded * pricePerUnit;

  return { status: "alcanzable", unitsNeeded, revenueNeeded };
}
