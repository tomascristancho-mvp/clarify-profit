import type {
  ValidatedInputs,
  CalculationResult,
  ScenarioResult,
  InterpretationMessage,
} from "@/domain/types";

// Generates educational messages based on explicit rules — no AI, no external services.
// Each rule is deterministic and testable; messages use plain language without jargon.
// Rules are evaluated in priority order: most critical issues first.
export function generarInterpretaciones(
  inputs: ValidatedInputs,
  result: CalculationResult,
  scenarios: ScenarioResult[]
): InterpretationMessage[] {
  const messages: InterpretationMessage[] = [];

  // Rule 1: Contribution margin ≤ 0 — the most fundamental problem.
  // Every additional unit sold makes the situation worse, not better.
  if (result.contributionMarginPerUnit <= 0) {
    messages.push({
      type: "alerta",
      message:
        "El precio de venta no cubre el costo variable por unidad. Vender más empeoraría las pérdidas, no las reduciría.",
    });
  }

  // Rule 2: Operating profit — only evaluated when margin > 0 to avoid duplicate alerts.
  if (result.contributionMarginPerUnit > 0) {
    if (result.operatingProfit < 0) {
      messages.push({
        type: "alerta",
        message:
          "Con las condiciones actuales, el negocio opera con pérdidas mensuales. Las ventas estimadas no alcanzan el punto de equilibrio.",
      });
    } else if (result.operatingProfit === 0) {
      messages.push({
        type: "informacion",
        message:
          "Las ventas estimadas están exactamente en el punto de equilibrio: no hay pérdida ni ganancia.",
      });
    } else {
      messages.push({
        type: "positivo",
        message:
          "El negocio genera utilidad operativa mensual con las condiciones actuales.",
      });
    }
  }

  // Rule 3: How far above breakeven are the estimated sales?
  if (
    result.operatingProfit > 0 &&
    result.breakevenUnits.status === "valido"
  ) {
    const diff =
      inputs.estimatedUnits - result.breakevenUnits.value.minimumWholeUnits;
    if (diff > 0) {
      messages.push({
        type: "positivo",
        message: `Las ventas estimadas superan el punto de equilibrio en ${diff} unidad${diff === 1 ? "" : "es"}.`,
      });
    }
  }

  // Rule 4: Investment recovery — only relevant when there is an initial investment.
  if (inputs.initialInvestment > 0) {
    if (result.recoveryTimeMonths.status === "no_aplica") {
      messages.push({
        type: "alerta",
        message:
          "La inversión inicial no puede recuperarse mientras el negocio opere con pérdidas o utilidad cero.",
      });
    } else if (result.recoveryTimeMonths.status === "valido") {
      const months = Math.ceil(result.recoveryTimeMonths.value);
      messages.push({
        type: "informacion",
        message: `Con la utilidad actual, la inversión inicial se recuperaría en aproximadamente ${months} ${months === 1 ? "mes" : "meses"}.`,
      });
    }
  }

  // Rule 5: Pessimistic scenario risk — alert only when expected case is profitable
  // but pessimistic case is not, signaling high volume sensitivity.
  const pessimisticScenario = scenarios.find((s) => s.key === "pesimista");
  if (
    pessimisticScenario &&
    pessimisticScenario.operatingProfit < 0 &&
    result.operatingProfit >= 0
  ) {
    messages.push({
      type: "alerta",
      message:
        "En el escenario pesimista (70% de las ventas esperadas), el negocio operaría con pérdidas. Los resultados son sensibles al volumen de ventas.",
    });
  }

  return messages;
}
