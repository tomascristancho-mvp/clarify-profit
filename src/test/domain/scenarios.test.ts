import { describe, it, expect } from "vitest";
import { calcularEscenarios } from "@/domain/scenarios";
import { COFFEE_SHOP_INPUTS } from "@/test/fixtures/coffeeShopExample";

describe("calcularEscenarios", () => {
  it("genera exactamente 3 escenarios en orden pesimista / esperado / optimista", () => {
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    expect(scenarios).toHaveLength(3);
    expect(scenarios[0].key).toBe("pesimista");
    expect(scenarios[1].key).toBe("esperado");
    expect(scenarios[2].key).toBe("optimista");
  });

  it("escenario pesimista (70%): 250 × 0,7 = 175 unidades — resultado exacto", () => {
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const pesimista = scenarios[0];

    expect(pesimista.units).toBe(175);
    expect(pesimista.revenue).toBe(175 * 25_000);       // 4.375.000
    expect(pesimista.variableCosts).toBe(175 * 12_000); // 2.100.000
    expect(pesimista.totalCosts).toBe(2_000_000 + 175 * 12_000); // 4.100.000
    expect(pesimista.operatingProfit).toBe(4_375_000 - 4_100_000); // 275.000
  });

  it("escenario esperado (100%): 250 unidades — coincide con cálculo principal", () => {
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const esperado = scenarios[1];

    expect(esperado.units).toBe(250);
    expect(esperado.revenue).toBe(6_250_000);
    expect(esperado.operatingProfit).toBe(1_250_000);
  });

  it("escenario optimista (130%): 250 × 1,3 = 325 unidades — resultado exacto", () => {
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const optimista = scenarios[2];

    expect(optimista.units).toBe(325);
    expect(optimista.revenue).toBe(325 * 25_000);       // 8.125.000
    expect(optimista.variableCosts).toBe(325 * 12_000); // 3.900.000
  });

  it("aplica Math.round en fracciones: 117 × 0,7 = 81,9 → 82 y 117 × 1,3 = 152,1 → 152", () => {
    const scenarios = calcularEscenarios({ ...COFFEE_SHOP_INPUTS, estimatedUnits: 117 });

    expect(scenarios[0].units).toBe(82);  // Math.round(81.9) = 82
    expect(scenarios[1].units).toBe(117); // Math.round(117)  = 117
    expect(scenarios[2].units).toBe(152); // Math.round(152.1) = 152
  });

  it("los 3 escenarios retornan 0 unidades cuando estimatedUnits = 0", () => {
    const scenarios = calcularEscenarios({ ...COFFEE_SHOP_INPUTS, estimatedUnits: 0 });
    for (const scenario of scenarios) {
      expect(scenario.units).toBe(0);
      expect(scenario.revenue).toBe(0);
      expect(scenario.variableCosts).toBe(0);
    }
  });

  it("margen operativo de no_aplica cuando los ingresos son 0 (unidades = 0)", () => {
    const scenarios = calcularEscenarios({ ...COFFEE_SHOP_INPUTS, estimatedUnits: 0 });
    // All three scenarios should have revenue = 0 → margin = no_aplica
    for (const scenario of scenarios) {
      expect(scenario.operatingMarginPct.status).toBe("no_aplica");
    }
  });

  it("calcula el margen operativo sobre ventas cuando hay ingresos (esperado: 20%)", () => {
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const esperado = scenarios[1];

    expect(esperado.operatingMarginPct.status).toBe("valido");
    if (esperado.operatingMarginPct.status === "valido") {
      // 1.250.000 / 6.250.000 = 0,2 = 20%
      expect(esperado.operatingMarginPct.value).toBeCloseTo(20, 5);
    }
  });

  it("usa las unidades ya redondeadas para calcular ingresos y costos del escenario", () => {
    // 117 units, pessimistic: units = 82 (rounded from 81.9)
    // revenue and costs must use 82, not 81.9
    const scenarios = calcularEscenarios({ ...COFFEE_SHOP_INPUTS, estimatedUnits: 117 });
    const pesimista = scenarios[0];

    expect(pesimista.units).toBe(82);
    expect(pesimista.revenue).toBe(82 * 25_000);        // uses 82, not 81.9
    expect(pesimista.variableCosts).toBe(82 * 12_000);  // uses 82, not 81.9
  });
});
