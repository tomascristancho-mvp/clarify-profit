import { describe, it, expect } from "vitest";
import { generarInterpretaciones } from "@/domain/interpretations";
import { calcular } from "@/domain/calculations";
import { calcularEscenarios } from "@/domain/scenarios";
import { COFFEE_SHOP_INPUTS } from "@/test/fixtures/coffeeShopExample";

describe("generarInterpretaciones", () => {
  it("genera mensaje positivo cuando el negocio es rentable (cafetería)", () => {
    const result = calcular(COFFEE_SHOP_INPUTS);
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const messages = generarInterpretaciones(COFFEE_SHOP_INPUTS, result, scenarios);

    expect(messages.some((m) => m.type === "positivo")).toBe(true);
  });

  it("genera alerta cuando el precio no cubre el costo variable", () => {
    const inputs = {
      ...COFFEE_SHOP_INPUTS,
      pricePerUnit: 10_000,
      variableCostPerUnit: 15_000, // precio < costo variable
    };
    const result = calcular(inputs);
    const scenarios = calcularEscenarios(inputs);
    const messages = generarInterpretaciones(inputs, result, scenarios);

    expect(messages.some((m) => m.type === "alerta")).toBe(true);
    expect(
      messages.some((m) => m.message.toLowerCase().includes("costo variable"))
    ).toBe(true);
  });

  it("genera alerta cuando las ventas no alcanzan el punto de equilibrio", () => {
    const inputs = { ...COFFEE_SHOP_INPUTS, fixedCosts: 10_000_000 };
    const result = calcular(inputs);
    const scenarios = calcularEscenarios(inputs);
    const messages = generarInterpretaciones(inputs, result, scenarios);

    const alertas = messages.filter((m) => m.type === "alerta");
    expect(alertas.length).toBeGreaterThan(0);
  });

  it("genera alerta de recuperación cuando la inversión no puede recuperarse", () => {
    const inputs = { ...COFFEE_SHOP_INPUTS, fixedCosts: 10_000_000, initialInvestment: 5_000_000 };
    const result = calcular(inputs);
    const scenarios = calcularEscenarios(inputs);
    const messages = generarInterpretaciones(inputs, result, scenarios);

    expect(
      messages.some(
        (m) => m.type === "alerta" && m.message.toLowerCase().includes("inversión")
      )
    ).toBe(true);
  });

  it("genera mensaje de recuperación con meses cuando el negocio es rentable", () => {
    const result = calcular(COFFEE_SHOP_INPUTS);
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const messages = generarInterpretaciones(COFFEE_SHOP_INPUTS, result, scenarios);

    expect(
      messages.some(
        (m) =>
          m.type === "informacion" &&
          (m.message.includes("meses") || m.message.includes("mes"))
      )
    ).toBe(true);
  });

  it("alerta del escenario pesimista cuando produce pérdidas y el esperado no", () => {
    // estimatedUnits = 200:
    //   Expected: 200 × 25.000 = 5.000.000; costs = 2.000.000 + 200 × 12.000 = 4.400.000 → profit = +600.000
    //   Pessimistic: Math.round(200 × 0.7) = Math.round(140) = 140
    //                140 × 25.000 = 3.500.000; costs = 2.000.000 + 140 × 12.000 = 3.680.000 → profit = −180.000
    const inputs = { ...COFFEE_SHOP_INPUTS, estimatedUnits: 200 };
    const result = calcular(inputs);
    const scenarios = calcularEscenarios(inputs);

    expect(result.operatingProfit).toBeGreaterThan(0);
    expect(scenarios[0].operatingProfit).toBeLessThan(0);

    const messages = generarInterpretaciones(inputs, result, scenarios);
    expect(
      messages.some(
        (m) => m.type === "alerta" && m.message.toLowerCase().includes("pesimista")
      )
    ).toBe(true);
  });

  it("no genera mensajes sobre inversión cuando la inversión inicial es 0", () => {
    const inputs = { ...COFFEE_SHOP_INPUTS, initialInvestment: 0 };
    const result = calcular(inputs);
    const scenarios = calcularEscenarios(inputs);
    const messages = generarInterpretaciones(inputs, result, scenarios);

    expect(
      messages.every((m) => !m.message.toLowerCase().includes("inversión"))
    ).toBe(true);
  });

  it("genera mensaje positivo de superación del punto de equilibrio (cafetería + 96 unidades extras)", () => {
    const result = calcular(COFFEE_SHOP_INPUTS);
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const messages = generarInterpretaciones(COFFEE_SHOP_INPUTS, result, scenarios);

    // 250 estimated units − 154 breakeven = 96 units above breakeven
    expect(
      messages.some(
        (m) => m.type === "positivo" && m.message.includes("96")
      )
    ).toBe(true);
  });

  it("nunca devuelve mensajes con 'NaN', 'Infinity' ni 'undefined'", () => {
    const result = calcular(COFFEE_SHOP_INPUTS);
    const scenarios = calcularEscenarios(COFFEE_SHOP_INPUTS);
    const messages = generarInterpretaciones(COFFEE_SHOP_INPUTS, result, scenarios);

    for (const m of messages) {
      expect(m.message).not.toContain("NaN");
      expect(m.message).not.toContain("Infinity");
      expect(m.message).not.toContain("undefined");
    }
  });
});
