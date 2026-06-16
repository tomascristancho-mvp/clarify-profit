import { describe, it, expect } from "vitest";
import {
  calcularIngresosMensuales,
  calcularMargenContribucionUnitario,
  calcularMargenContribucionPct,
  calcularPuntoEquilibrioUnidades,
  calcularPuntoEquilibrioVentas,
  calcularROIMensual,
  calcularTiempoRecuperacion,
  calcular,
} from "@/domain/calculations";
import { COFFEE_SHOP_INPUTS, COFFEE_SHOP_EXPECTED } from "@/test/fixtures/coffeeShopExample";

// ── Ingresos ────────────────────────────────────────────────────────────────

describe("calcularIngresosMensuales", () => {
  it("calcula correctamente (cafetería: 25.000 × 250 = 6.250.000)", () => {
    expect(calcularIngresosMensuales(25_000, 250)).toBe(6_250_000);
  });
  it("retorna 0 cuando las unidades son 0", () => {
    expect(calcularIngresosMensuales(25_000, 0)).toBe(0);
  });
});

// ── Margen de contribución ──────────────────────────────────────────────────

describe("calcularMargenContribucionUnitario", () => {
  it("calcula el margen correcto (cafetería: 25.000 − 12.000 = 13.000)", () => {
    expect(calcularMargenContribucionUnitario(25_000, 12_000)).toBe(13_000);
  });
  it("retorna 0 cuando precio = costo variable", () => {
    expect(calcularMargenContribucionUnitario(10_000, 10_000)).toBe(0);
  });
  it("retorna valor negativo cuando precio < costo variable", () => {
    expect(calcularMargenContribucionUnitario(8_000, 10_000)).toBe(-2_000);
  });
});

describe("calcularMargenContribucionPct", () => {
  it("calcula el 52% correcto para el ejemplo de cafetería", () => {
    const result = calcularMargenContribucionPct(13_000, 25_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBeCloseTo(52, 5);
    }
  });
  it("retorna 0% cuando el margen unitario es 0", () => {
    const result = calcularMargenContribucionPct(0, 25_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBe(0);
    }
  });
  it("retorna porcentaje negativo cuando precio < costo variable", () => {
    const result = calcularMargenContribucionPct(-2_000, 8_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBeLessThan(0);
    }
  });
});

// ── Punto de equilibrio en unidades ────────────────────────────────────────

describe("calcularPuntoEquilibrioUnidades", () => {
  it("calcula el punto teórico y el techo para el ejemplo de cafetería", () => {
    const result = calcularPuntoEquilibrioUnidades(2_000_000, 13_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value.exact).toBeCloseTo(COFFEE_SHOP_EXPECTED.breakevenExact, 3);
      expect(result.value.minimumWholeUnits).toBe(154); // Math.ceil(153.846...)
    }
  });

  it("redondea hacia arriba al entero mínimo (100 / 3 ≈ 33,33 → 34)", () => {
    const result = calcularPuntoEquilibrioUnidades(100, 3);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value.minimumWholeUnits).toBe(34);
    }
  });

  it("retorna resultado exactamente entero sin redondeo adicional (1.300.000 / 13.000 = 100)", () => {
    const result = calcularPuntoEquilibrioUnidades(1_300_000, 13_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value.exact).toBe(100);
      expect(result.value.minimumWholeUnits).toBe(100); // Math.ceil(100) = 100
    }
  });

  it("retorna no_alcanzable cuando el margen es exactamente 0 (precio = costo variable)", () => {
    const result = calcularPuntoEquilibrioUnidades(2_000_000, 0);
    expect(result.status).toBe("no_alcanzable");
    if (result.status !== "valido") {
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });

  it("retorna no_alcanzable cuando el margen es negativo (precio < costo variable)", () => {
    const result = calcularPuntoEquilibrioUnidades(2_000_000, -2_000);
    expect(result.status).toBe("no_alcanzable");
  });

  it("retorna 0 cuando los costos fijos son 0 y el margen es positivo", () => {
    const result = calcularPuntoEquilibrioUnidades(0, 13_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value.exact).toBe(0);
      expect(result.value.minimumWholeUnits).toBe(0);
    }
  });
});

// ── Punto de equilibrio monetario ──────────────────────────────────────────

describe("calcularPuntoEquilibrioVentas", () => {
  it("calcula las ventas teóricas de equilibrio para el ejemplo de cafetería", () => {
    const result = calcularPuntoEquilibrioVentas(2_000_000, 13_000, 25_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value.theoretical).toBeCloseTo(
        COFFEE_SHOP_EXPECTED.breakevenTheoreticalRevenue,
        0
      );
      expect(result.value.atMinimumWholeUnits).toBe(
        COFFEE_SHOP_EXPECTED.breakevenRevenueAtWholeUnits // 154 × 25.000 = 3.850.000
      );
    }
  });

  it("retorna no_alcanzable cuando el margen es 0", () => {
    const result = calcularPuntoEquilibrioVentas(2_000_000, 0, 25_000);
    expect(result.status).toBe("no_alcanzable");
  });
});

// ── ROI mensual ────────────────────────────────────────────────────────────

describe("calcularROIMensual", () => {
  it("calcula el ROI del 25% para el ejemplo de cafetería", () => {
    const result = calcularROIMensual(1_250_000, 5_000_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBe(25);
    }
  });

  it("retorna ROI negativo cuando hay pérdida operativa", () => {
    const result = calcularROIMensual(-500_000, 5_000_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBeLessThan(0);
    }
  });

  it("retorna ROI de 0 cuando la utilidad es exactamente 0", () => {
    const result = calcularROIMensual(0, 5_000_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBe(0);
    }
  });

  it("retorna no_aplica cuando la inversión inicial es 0", () => {
    const result = calcularROIMensual(1_250_000, 0);
    expect(result.status).toBe("no_aplica");
    if (result.status !== "valido") {
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });
});

// ── Tiempo de recuperación ─────────────────────────────────────────────────

describe("calcularTiempoRecuperacion", () => {
  it("calcula el tiempo de recuperación correcto (cafetería: 4 meses)", () => {
    const result = calcularTiempoRecuperacion(5_000_000, 1_250_000);
    expect(result.status).toBe("valido");
    if (result.status === "valido") {
      expect(result.value).toBe(4);
    }
  });

  it("retorna no_aplica cuando la inversión inicial es 0", () => {
    const result = calcularTiempoRecuperacion(0, 1_250_000);
    expect(result.status).toBe("no_aplica");
  });

  it("retorna no_aplica cuando la utilidad es negativa", () => {
    const result = calcularTiempoRecuperacion(5_000_000, -500_000);
    expect(result.status).toBe("no_aplica");
    if (result.status !== "valido") {
      expect(result.reason.length).toBeGreaterThan(0);
    }
  });

  it("retorna no_aplica cuando la utilidad es exactamente 0", () => {
    const result = calcularTiempoRecuperacion(5_000_000, 0);
    expect(result.status).toBe("no_aplica");
  });

  it("nunca retorna un número negativo ni Infinity cuando la utilidad es negativa", () => {
    const result = calcularTiempoRecuperacion(5_000_000, -1);
    // Must be no_aplica — never a negative recovery time or Infinity
    expect(result.status).not.toBe("valido");
  });
});

// ── Integración: calcular() con el ejemplo de referencia ──────────────────

describe("calcular — ejemplo de referencia completo (cafetería)", () => {
  it("verifica todos los resultados del spec sección 10", () => {
    const result = calcular(COFFEE_SHOP_INPUTS);

    expect(result.monthlyRevenue).toBe(COFFEE_SHOP_EXPECTED.monthlyRevenue);
    expect(result.totalVariableCosts).toBe(COFFEE_SHOP_EXPECTED.totalVariableCosts);
    expect(result.totalCosts).toBe(COFFEE_SHOP_EXPECTED.totalCosts);
    expect(result.operatingProfit).toBe(COFFEE_SHOP_EXPECTED.operatingProfit);
    expect(result.contributionMarginPerUnit).toBe(
      COFFEE_SHOP_EXPECTED.contributionMarginPerUnit
    );

    expect(result.contributionMarginPct.status).toBe("valido");
    if (result.contributionMarginPct.status === "valido") {
      expect(result.contributionMarginPct.value).toBeCloseTo(
        COFFEE_SHOP_EXPECTED.contributionMarginPct,
        5
      );
    }

    expect(result.breakevenUnits.status).toBe("valido");
    if (result.breakevenUnits.status === "valido") {
      expect(result.breakevenUnits.value.exact).toBeCloseTo(
        COFFEE_SHOP_EXPECTED.breakevenExact,
        3
      );
      expect(result.breakevenUnits.value.minimumWholeUnits).toBe(
        COFFEE_SHOP_EXPECTED.breakevenWholeUnits
      );
    }

    expect(result.breakevenRevenue.status).toBe("valido");
    if (result.breakevenRevenue.status === "valido") {
      expect(result.breakevenRevenue.value.theoretical).toBeCloseTo(
        COFFEE_SHOP_EXPECTED.breakevenTheoreticalRevenue,
        0
      );
      expect(result.breakevenRevenue.value.atMinimumWholeUnits).toBe(
        COFFEE_SHOP_EXPECTED.breakevenRevenueAtWholeUnits
      );
    }

    expect(result.monthlyROI.status).toBe("valido");
    if (result.monthlyROI.status === "valido") {
      expect(result.monthlyROI.value).toBe(COFFEE_SHOP_EXPECTED.monthlyROI);
    }

    expect(result.recoveryTimeMonths.status).toBe("valido");
    if (result.recoveryTimeMonths.status === "valido") {
      expect(result.recoveryTimeMonths.value).toBe(
        COFFEE_SHOP_EXPECTED.recoveryTimeMonths
      );
    }
  });

  it("maneja costos fijos = 0 (equilibrio en 0 unidades)", () => {
    const result = calcular({ ...COFFEE_SHOP_INPUTS, fixedCosts: 0 });
    expect(result.breakevenUnits.status).toBe("valido");
    if (result.breakevenUnits.status === "valido") {
      expect(result.breakevenUnits.value.exact).toBe(0);
      expect(result.breakevenUnits.value.minimumWholeUnits).toBe(0);
    }
    expect(result.operatingProfit).toBe(
      result.monthlyRevenue - result.totalVariableCosts
    );
  });

  it("maneja unidades = 0 (pérdida igual a costos fijos)", () => {
    const result = calcular({ ...COFFEE_SHOP_INPUTS, estimatedUnits: 0 });
    expect(result.monthlyRevenue).toBe(0);
    expect(result.totalVariableCosts).toBe(0);
    expect(result.totalCosts).toBe(COFFEE_SHOP_INPUTS.fixedCosts);
    expect(result.operatingProfit).toBe(-COFFEE_SHOP_INPUTS.fixedCosts);
  });

  it("maneja inversión inicial = 0 (ROI y recuperación no_aplica)", () => {
    const result = calcular({ ...COFFEE_SHOP_INPUTS, initialInvestment: 0 });
    expect(result.monthlyROI.status).toBe("no_aplica");
    expect(result.recoveryTimeMonths.status).toBe("no_aplica");
  });

  it("maneja utilidad exactamente = 0 (ROI = 0, recuperación no_aplica)", () => {
    // Make revenue == totalCosts: fixedCosts + variableCosts = revenue
    // 250 × 25.000 = 6.250.000; costs = fixedCosts + 250 × 12.000
    // 6.250.000 = fixedCosts + 3.000.000 → fixedCosts = 3.250.000
    const result = calcular({ ...COFFEE_SHOP_INPUTS, fixedCosts: 3_250_000 });
    expect(result.operatingProfit).toBe(0);
    expect(result.monthlyROI.status).toBe("valido");
    if (result.monthlyROI.status === "valido") {
      expect(result.monthlyROI.value).toBe(0);
    }
    expect(result.recoveryTimeMonths.status).toBe("no_aplica");
  });

  it("maneja valores con decimales sin artefactos visibles de punto flotante", () => {
    const result = calcular({
      ...COFFEE_SHOP_INPUTS,
      pricePerUnit: 25_000.5,
      variableCostPerUnit: 12_000.25,
    });
    expect(result.contributionMarginPerUnit).toBeCloseTo(13_000.25, 5);
    expect(result.contributionMarginPct.status).toBe("valido");
    // Verify no NaN or Infinity leaked
    expect(Number.isFinite(result.operatingProfit)).toBe(true);
    expect(Number.isNaN(result.operatingProfit)).toBe(false);
  });

  it("maneja valores monetarios grandes dentro del rango permitido", () => {
    const result = calcular({
      ...COFFEE_SHOP_INPUTS,
      fixedCosts: 500_000_000,
      pricePerUnit: 1_000_000,
      variableCostPerUnit: 200_000,
      estimatedUnits: 10_000,
      initialInvestment: 100_000_000_000,
    });
    expect(Number.isFinite(result.operatingProfit)).toBe(true);
    expect(Number.isFinite(result.monthlyRevenue)).toBe(true);
    expect(Number.isNaN(result.operatingProfit)).toBe(false);
    expect(Number.isNaN(result.monthlyRevenue)).toBe(false);
  });

  it("caso con pérdidas: devuelve utilidad negativa sin errores", () => {
    const result = calcular({
      ...COFFEE_SHOP_INPUTS,
      fixedCosts: 10_000_000, // pérdida asegurada con 250 unidades
    });
    expect(result.operatingProfit).toBeLessThan(0);
    // ROI should be valid (negative) when investment > 0
    expect(result.monthlyROI.status).toBe("valido");
    if (result.monthlyROI.status === "valido") {
      expect(result.monthlyROI.value).toBeLessThan(0);
    }
    // Recovery is not possible when profit < 0
    expect(result.recoveryTimeMonths.status).toBe("no_aplica");
  });
});
