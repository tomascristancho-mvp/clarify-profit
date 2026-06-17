import { describe, it, expect } from "vitest";
import { calcularMetaUtilidad } from "@/domain/reverseCalculator";
import { calcularPuntoEquilibrioUnidades } from "@/domain/calculations";

// ─── Fixtures ────────────────────────────────────────────────────────────────

// Cafetería: price=25 000, varCost=12 000, margin=13 000, fixedCosts=2 000 000
const CAFETERA = {
  margin: 13_000,
  fixedCosts: 2_000_000,
  price: 25_000,
};

// ─── Casos normales ───────────────────────────────────────────────────────────

describe("calcularMetaUtilidad — casos normales", () => {
  it("calcula las unidades y ventas necesarias para una meta positiva", () => {
    // (500 000 + 2 000 000) / 13 000 = 192.307... → ceil = 193
    const result = calcularMetaUtilidad(500_000, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(result.unitsNeeded).toBe(193);
    expect(result.revenueNeeded).toBe(193 * 25_000); // 4 825 000
  });

  it("calcula correctamente cuando la meta coincide exactamente con un número entero de unidades", () => {
    // (1 250 000 + 2 000 000) / 13 000 = 250 exacto
    const result = calcularMetaUtilidad(1_250_000, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(result.unitsNeeded).toBe(250);
    expect(result.revenueNeeded).toBe(250 * 25_000); // 6 250 000
  });

  it("unitsNeeded siempre es un entero (Math.ceil aplicado)", () => {
    // (300 000 + 2 000 000) / 13 000 = 176.923... → ceil = 177
    const result = calcularMetaUtilidad(300_000, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(Number.isInteger(result.unitsNeeded)).toBe(true);
    expect(result.unitsNeeded).toBe(177);
  });

  it("revenueNeeded = unitsNeeded × pricePerUnit", () => {
    const result = calcularMetaUtilidad(800_000, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(result.revenueNeeded).toBe(result.unitsNeeded * CAFETERA.price);
  });

  it("meta grande produce valores finitos y correctos", () => {
    const result = calcularMetaUtilidad(50_000_000, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(Number.isFinite(result.unitsNeeded)).toBe(true);
    expect(Number.isFinite(result.revenueNeeded)).toBe(true);
    // (50 000 000 + 2 000 000) / 13 000 = 4000
    expect(result.unitsNeeded).toBe(4_000);
  });
});

// ─── Meta = 0 (punto de equilibrio) ──────────────────────────────────────────

describe("calcularMetaUtilidad — meta = 0 (punto de equilibrio)", () => {
  it("con meta = 0 devuelve el punto de equilibrio", () => {
    // 2 000 000 / 13 000 = 153.846... → ceil = 154
    const result = calcularMetaUtilidad(0, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(result.unitsNeeded).toBe(154);
  });

  it("con meta = 0 el resultado es consistente con calcularPuntoEquilibrioUnidades", () => {
    const breakevenResult = calcularPuntoEquilibrioUnidades(CAFETERA.fixedCosts, CAFETERA.margin);
    expect(breakevenResult.status).toBe("valido");
    if (breakevenResult.status !== "valido") return;

    const reverseResult = calcularMetaUtilidad(0, CAFETERA.margin, CAFETERA.fixedCosts, CAFETERA.price);
    expect(reverseResult.status).toBe("alcanzable");
    if (reverseResult.status !== "alcanzable") return;

    expect(reverseResult.unitsNeeded).toBe(breakevenResult.value.minimumWholeUnits);
  });

  it("con meta = 0 y fixedCosts = 0 devuelve 0 unidades", () => {
    const result = calcularMetaUtilidad(0, CAFETERA.margin, 0, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(result.unitsNeeded).toBe(0);
    expect(result.revenueNeeded).toBe(0);
  });
});

// ─── Costos fijos = 0 ────────────────────────────────────────────────────────

describe("calcularMetaUtilidad — fixedCosts = 0", () => {
  it("sin costos fijos, las unidades necesarias dependen solo de la meta y el margen", () => {
    // 500 000 / 13 000 = 38.46... → ceil = 39
    const result = calcularMetaUtilidad(500_000, CAFETERA.margin, 0, CAFETERA.price);
    expect(result.status).toBe("alcanzable");
    if (result.status !== "alcanzable") return;
    expect(result.unitsNeeded).toBe(39);
    expect(result.revenueNeeded).toBe(39 * 25_000);
  });
});

// ─── No alcanzable ────────────────────────────────────────────────────────────

describe("calcularMetaUtilidad — no_alcanzable", () => {
  it("devuelve no_alcanzable cuando el margen de contribución es exactamente cero", () => {
    const result = calcularMetaUtilidad(500_000, 0, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("no_alcanzable");
  });

  it("devuelve no_alcanzable cuando el margen de contribución es negativo", () => {
    const result = calcularMetaUtilidad(500_000, -5_000, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("no_alcanzable");
  });

  it("no_alcanzable incluye un mensaje de razón no vacío", () => {
    const result = calcularMetaUtilidad(0, 0, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("no_alcanzable");
    if (result.status !== "no_alcanzable") return;
    expect(result.reason).toBeTruthy();
    expect(result.reason.length).toBeGreaterThan(10);
  });

  it("no_alcanzable incluso cuando la meta es 0", () => {
    const result = calcularMetaUtilidad(0, -1_000, CAFETERA.fixedCosts, CAFETERA.price);
    expect(result.status).toBe("no_alcanzable");
  });
});

// ─── Nunca produce NaN ni Infinity ───────────────────────────────────────────

describe("calcularMetaUtilidad — sin NaN ni Infinity", () => {
  const cases = [
    { target: 0, margin: 13_000, fixed: 2_000_000, price: 25_000 },
    { target: 1_000_000, margin: 1, fixed: 0, price: 100 },
    { target: 999_999_999, margin: 50_000, fixed: 10_000_000, price: 100_000 },
    { target: 0, margin: 0.01, fixed: 0, price: 1 },
  ];

  for (const { target, margin, fixed, price } of cases) {
    it(`nunca produce NaN/Infinity con target=${target} margin=${margin}`, () => {
      const result = calcularMetaUtilidad(target, margin, fixed, price);
      if (result.status === "alcanzable") {
        expect(Number.isNaN(result.unitsNeeded)).toBe(false);
        expect(Number.isNaN(result.revenueNeeded)).toBe(false);
        expect(Number.isFinite(result.unitsNeeded)).toBe(true);
        expect(Number.isFinite(result.revenueNeeded)).toBe(true);
      }
    });
  }
});
