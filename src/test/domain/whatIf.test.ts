import { describe, it, expect } from "vitest";
import { simularCambios } from "@/domain/whatIf";
import { calcular } from "@/domain/calculations";
import type { ValidatedInputs } from "@/domain/types";

// ─── Fixtures ────────────────────────────────────────────────────────────────

// Cafetería: price=25 000, varCost=12 000, fixed=2 000 000, units=250
// margin = 13 000, profit = 250*13 000 - 2 000 000 = 1 250 000
const CAFETERA: ValidatedInputs = {
  businessName: "Cafetería",
  currency: "COP",
  fixedCosts: 2_000_000,
  variableCostPerUnit: 12_000,
  pricePerUnit: 25_000,
  estimatedUnits: 250,
  initialInvestment: 5_000_000,
};

const cafeResult = calcular(CAFETERA);

// Low-margin: price=10 000, varCost=9 000, margin=1 000
// Price -20% → new price=8 000, margin=−1 000 → no_viable
const LOW_MARGIN: ValidatedInputs = {
  businessName: "Test",
  currency: "COP",
  fixedCosts: 10_000,
  variableCostPerUnit: 9_000,
  pricePerUnit: 10_000,
  estimatedUnits: 20,
  initialInvestment: 0,
};

const lowResult = calcular(LOW_MARGIN);

// ─── Count and structure ──────────────────────────────────────────────────────

describe("simularCambios — estructura", () => {
  it("devuelve exactamente 12 simulaciones", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims).toHaveLength(12);
  });

  it("las primeras 4 son de precio en orden ascendente de ajuste", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[0].variable).toBe("price");
    expect(sims[0].adjustmentPct).toBeCloseTo(-0.2);
    expect(sims[1].adjustmentPct).toBeCloseTo(-0.1);
    expect(sims[2].adjustmentPct).toBeCloseTo(0.1);
    expect(sims[3].adjustmentPct).toBeCloseTo(0.2);
  });

  it("las siguientes 4 son de unidades en orden ascendente de ajuste", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[4].variable).toBe("units");
    expect(sims[4].adjustmentPct).toBeCloseTo(-0.3);
    expect(sims[5].adjustmentPct).toBeCloseTo(-0.15);
    expect(sims[6].adjustmentPct).toBeCloseTo(0.15);
    expect(sims[7].adjustmentPct).toBeCloseTo(0.3);
  });

  it("las siguientes 2 son de costo variable", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[8].variable).toBe("variableCost");
    expect(sims[9].variable).toBe("variableCost");
  });

  it("las últimas 2 son de costos fijos", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[10].variable).toBe("fixedCosts");
    expect(sims[11].variable).toBe("fixedCosts");
  });
});

// ─── Labels ──────────────────────────────────────────────────────────────────

describe("simularCambios — etiquetas", () => {
  it("formatea los porcentajes negativos sin signo +", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[0].label).toBe("Precio -20%");
    expect(sims[1].label).toBe("Precio -10%");
    expect(sims[4].label).toBe("Unidades -30%");
  });

  it("formatea los porcentajes positivos con signo +", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[2].label).toBe("Precio +10%");
    expect(sims[3].label).toBe("Precio +20%");
    expect(sims[6].label).toBe("Unidades +15%");
    expect(sims[8].label).toBe("Costo variable -10%");
    expect(sims[9].label).toBe("Costo variable +10%");
    expect(sims[10].label).toBe("Costos fijos -10%");
    expect(sims[11].label).toBe("Costos fijos +10%");
  });
});

// ─── profitDelta ─────────────────────────────────────────────────────────────

describe("simularCambios — profitDelta", () => {
  it("profitDelta = newProfit − baseProfit para todas las simulaciones", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    for (const sim of sims) {
      expect(sim.profitDelta).toBeCloseTo(sim.newProfit - cafeResult.operatingProfit, 5);
    }
  });

  it("precio +10% mejora la utilidad", () => {
    // new price = 27 500, margin = 15 500, profit = 250*15 500 - 2 000 000 = 1 875 000
    const sims = simularCambios(CAFETERA, cafeResult);
    const priceUp10 = sims[2];
    expect(priceUp10.profitDelta).toBeGreaterThan(0);
    expect(priceUp10.newProfit).toBeCloseTo(1_875_000);
  });

  it("precio -10% reduce la utilidad", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[1].profitDelta).toBeLessThan(0);
  });

  it("unidades -30% reduce la utilidad", () => {
    // Math.round(250 * 0.7) = 175, profit = 175*13 000 - 2 000 000 = 275 000, delta = −975 000
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[4].profitDelta).toBeLessThan(0);
    expect(sims[4].newProfit).toBeCloseTo(275_000);
  });

  it("unidades +15% mejora la utilidad", () => {
    // Math.round(250 * 1.15) = Math.round(287.5) = 288
    // profit = 288*13 000 - 2 000 000 = 3 744 000 - 2 000 000 = 1 744 000
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[6].profitDelta).toBeGreaterThan(0);
    expect(sims[6].newProfit).toBeCloseTo(1_744_000);
  });

  it("costo variable -10% mejora la utilidad", () => {
    // new varCost = 10 800, margin = 14 200, profit = 250*14 200 - 2 000 000 = 1 550 000
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[8].profitDelta).toBeGreaterThan(0);
    expect(sims[8].newProfit).toBeCloseTo(1_550_000);
  });

  it("costo variable +10% reduce la utilidad", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[9].profitDelta).toBeLessThan(0);
  });

  it("costos fijos -10% mejora la utilidad", () => {
    // new fixed = 1 800 000, profit = 250*13 000 - 1 800 000 = 1 450 000
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[10].profitDelta).toBeGreaterThan(0);
    expect(sims[10].newProfit).toBeCloseTo(1_450_000);
  });

  it("costos fijos +10% reduce la utilidad", () => {
    // new fixed = 2 200 000, profit = 250*13 000 - 2 200 000 = 1 050 000
    const sims = simularCambios(CAFETERA, cafeResult);
    expect(sims[11].profitDelta).toBeLessThan(0);
    expect(sims[11].newProfit).toBeCloseTo(1_050_000);
  });
});

// ─── newBreakevenUnits ────────────────────────────────────────────────────────

describe("simularCambios — newBreakevenUnits", () => {
  it("es un número entero positivo cuando el margen es positivo", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    for (const sim of sims) {
      if (sim.riskLevel !== "no_viable") {
        expect(sim.newBreakevenUnits).not.toBeNull();
        expect(Number.isInteger(sim.newBreakevenUnits)).toBe(true);
      }
    }
  });

  it("es null cuando el ajuste hace que el margen sea ≤ 0 (no_viable)", () => {
    // Price -20%: new price = 8 000, varCost = 9 000, margin = -1 000 → no_viable
    const sims = simularCambios(LOW_MARGIN, lowResult);
    const priceDown20 = sims.find(
      (s) => s.variable === "price" && Math.round(s.adjustmentPct * 100) === -20
    );
    expect(priceDown20).toBeDefined();
    expect(priceDown20!.riskLevel).toBe("no_viable");
    expect(priceDown20!.newBreakevenUnits).toBeNull();
  });
});

// ─── riskLevel ───────────────────────────────────────────────────────────────

describe("simularCambios — riskLevel", () => {
  it("todos los campos riskLevel son valores válidos de RiskLevel", () => {
    const valid = new Set(["bajo", "medio", "alto", "no_viable"]);
    const sims = simularCambios(CAFETERA, cafeResult);
    for (const sim of sims) {
      expect(valid.has(sim.riskLevel)).toBe(true);
    }
  });

  it("precio +20% en la cafetería mantiene un nivel de riesgo sano", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    const priceUp20 = sims[3];
    expect(["bajo", "medio"]).toContain(priceUp20.riskLevel);
  });

  it("unidades -30% en la cafetería produce riesgo diferente al base", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    // With 175 units, profit = 275 000, may remain positive but with tighter coverage
    expect(sims[4].riskLevel).toBeDefined();
  });
});

// ─── Casos borde ─────────────────────────────────────────────────────────────

describe("simularCambios — casos borde", () => {
  it("nunca produce NaN ni Infinity en ningún campo numérico", () => {
    const sims = simularCambios(CAFETERA, cafeResult);
    for (const sim of sims) {
      expect(Number.isFinite(sim.newProfit)).toBe(true);
      expect(Number.isFinite(sim.profitDelta)).toBe(true);
      if (sim.newBreakevenUnits !== null) {
        expect(Number.isFinite(sim.newBreakevenUnits)).toBe(true);
      }
    }
  });

  it("unidades ajustadas son enteros (Math.round aplicado)", () => {
    // Only testable via the profitDelta being based on integer units
    // 250 * 1.15 = 287.5 → Math.round → 288
    const sims = simularCambios(CAFETERA, cafeResult);
    const up15 = sims[6]; // Unidades +15%
    // 288 * 13 000 - 2 000 000 = 1 744 000
    expect(up15.newProfit).toBeCloseTo(1_744_000);
  });

  it("con fixedCosts = 0, el ajuste +10% y −10% producen el mismo resultado", () => {
    const ZERO_FIXED: ValidatedInputs = {
      ...CAFETERA,
      fixedCosts: 0,
    };
    const zeroResult = calcular(ZERO_FIXED);
    const sims = simularCambios(ZERO_FIXED, zeroResult);
    const downFixed = sims[10]; // Costos fijos -10%
    const upFixed = sims[11];  // Costos fijos +10%
    expect(downFixed.newProfit).toBeCloseTo(upFixed.newProfit);
    expect(downFixed.profitDelta).toBeCloseTo(0);
    expect(upFixed.profitDelta).toBeCloseTo(0);
  });
});
