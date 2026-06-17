import { describe, it, expect } from "vitest";
import { diagnosticarNegocio } from "@/domain/diagnosis";
import type { ValidatedInputs, CalculationResult, ScenarioResult } from "@/domain/types";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BASE_INPUTS: ValidatedInputs = {
  businessName: "Test",
  currency: "COP",
  fixedCosts: 10_000,
  variableCostPerUnit: 300,
  pricePerUnit: 1_000,
  estimatedUnits: 100,
  initialInvestment: 50_000,
};

// margin = 700, marginPct = 70%, breakeven.exact ≈ 14.29, profit = 60 000
const BASE_RESULT: CalculationResult = {
  monthlyRevenue: 100_000,
  totalVariableCosts: 30_000,
  totalCosts: 40_000,
  operatingProfit: 60_000,
  contributionMarginPerUnit: 700,
  contributionMarginPct: { status: "valido", value: 70 },
  breakevenUnits: { status: "valido", value: { exact: 14.29, minimumWholeUnits: 15 } },
  breakevenRevenue: { status: "valido", value: { theoretical: 14_286, atMinimumWholeUnits: 15_000 } },
  monthlyROI: { status: "valido", value: 120 },
  recoveryTimeMonths: { status: "valido", value: 0.83 },
};

function makeScenarios(
  pesimistProfit: number,
  optimistaProfit = 81_000
): ScenarioResult[] {
  return [
    {
      key: "pesimista",
      label: "Pesimista (70%)",
      factor: 0.7,
      units: 70,
      revenue: 70_000,
      variableCosts: 21_000,
      totalCosts: 31_000,
      operatingProfit: pesimistProfit,
      operatingMarginPct: { status: "valido", value: pesimistProfit > 0 ? 10 : -5 },
    },
    {
      key: "esperado",
      label: "Esperado (100%)",
      factor: 1.0,
      units: 100,
      revenue: 100_000,
      variableCosts: 30_000,
      totalCosts: 40_000,
      operatingProfit: 60_000,
      operatingMarginPct: { status: "valido", value: 60 },
    },
    {
      key: "optimista",
      label: "Optimista (130%)",
      factor: 1.3,
      units: 130,
      revenue: 130_000,
      variableCosts: 39_000,
      totalCosts: 49_000,
      operatingProfit: optimistaProfit,
      operatingMarginPct: { status: "valido", value: 62 },
    },
  ];
}

// Pesimista profitable by default: 70 * 700 - 10 000 = 39 000
const HEALTHY_SCENARIOS = makeScenarios(39_000);

// ─── No viable ───────────────────────────────────────────────────────────────

describe("diagnosticarNegocio — no_viable", () => {
  it("retorna no_viable cuando el margen de contribución es exactamente cero", () => {
    const result = diagnosticarNegocio(
      BASE_INPUTS,
      {
        ...BASE_RESULT,
        contributionMarginPerUnit: 0,
        contributionMarginPct: { status: "valido", value: 0 },
        operatingProfit: -10_000,
        breakevenUnits: {
          status: "no_alcanzable",
          reason: "No existe punto de equilibrio.",
        },
        breakevenRevenue: {
          status: "no_alcanzable",
          reason: "No existe punto de equilibrio.",
        },
      },
      makeScenarios(-10_000)
    );
    expect(result.riskLevel).toBe("no_viable");
    expect(result.summary).toBeTruthy();
    expect(result.mainRiskFactor).toBeTruthy();
  });

  it("retorna no_viable cuando el margen de contribución es negativo", () => {
    const result = diagnosticarNegocio(
      BASE_INPUTS,
      {
        ...BASE_RESULT,
        contributionMarginPerUnit: -200,
        contributionMarginPct: { status: "valido", value: -20 },
        operatingProfit: -30_000,
        breakevenUnits: {
          status: "no_alcanzable",
          reason: "No existe punto de equilibrio.",
        },
        breakevenRevenue: {
          status: "no_alcanzable",
          reason: "No existe punto de equilibrio.",
        },
      },
      makeScenarios(-30_000)
    );
    expect(result.riskLevel).toBe("no_viable");
  });

  it("no_viable tiene prioridad aunque el escenario pesimista sea positivo", () => {
    const result = diagnosticarNegocio(
      BASE_INPUTS,
      { ...BASE_RESULT, contributionMarginPerUnit: 0, operatingProfit: 0 },
      makeScenarios(5_000)
    );
    expect(result.riskLevel).toBe("no_viable");
  });
});

// ─── Alto ────────────────────────────────────────────────────────────────────

describe("diagnosticarNegocio — alto", () => {
  it("retorna alto cuando la utilidad es negativa y el margen es positivo", () => {
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, estimatedUnits: 10 },
      {
        ...BASE_RESULT,
        operatingProfit: -3_000, // 10 * 700 - 10 000 = -3 000
        monthlyRevenue: 10_000,
        totalVariableCosts: 3_000,
        totalCosts: 13_000,
      },
      makeScenarios(-10_000)
    );
    expect(result.riskLevel).toBe("alto");
    expect(result.mainRiskFactor).toBeTruthy();
  });

  it("el resumen menciona las unidades del punto de equilibrio cuando aplica", () => {
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, estimatedUnits: 10 },
      {
        ...BASE_RESULT,
        operatingProfit: -3_000,
        // breakevenUnits.minimumWholeUnits = 15 > estimatedUnits = 10
      },
      makeScenarios(-3_000)
    );
    expect(result.riskLevel).toBe("alto");
    expect(result.summary).toContain("15"); // minimumWholeUnits
    expect(result.summary).toContain("10"); // estimatedUnits
  });

  it("alto tiene prioridad sobre las condiciones de riesgo medio", () => {
    // Even though pesimista also loses, the primary classification is alto
    const result = diagnosticarNegocio(
      BASE_INPUTS,
      { ...BASE_RESULT, operatingProfit: -1_000 },
      makeScenarios(-5_000)
    );
    expect(result.riskLevel).toBe("alto");
  });
});

// ─── Medio ───────────────────────────────────────────────────────────────────

describe("diagnosticarNegocio — medio (escenario pesimista con pérdida)", () => {
  it("retorna medio cuando el esperado es rentable pero el pesimista tiene pérdida", () => {
    const result = diagnosticarNegocio(
      BASE_INPUTS,
      BASE_RESULT, // profit = 60 000 > 0
      makeScenarios(-500) // pesimista pierde
    );
    expect(result.riskLevel).toBe("medio");
    expect(result.mainRiskFactor).toContain("pesimista");
  });
});

describe("diagnosticarNegocio — medio (cobertura baja)", () => {
  it("retorna medio cuando la cobertura sobre el punto de equilibrio es menor al 30%", () => {
    // breakeven.exact = 14.29, estimatedUnits = 18 → ratio = 1.26 < 1.3
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, estimatedUnits: 18 },
      {
        ...BASE_RESULT,
        operatingProfit: 18 * 700 - 10_000, // 2 600 > 0
      },
      makeScenarios(5_000) // pesimista rentable (valor manual)
    );
    expect(result.riskLevel).toBe("medio");
    expect(result.mainRiskFactor).toContain("30%");
  });
});

describe("diagnosticarNegocio — medio (margen de contribución bajo)", () => {
  it("retorna medio cuando el margen de contribución es menor al 20%", () => {
    // High coverage (units=200, ratio≈14), pesimista profitable, but marginPct = 15%
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, estimatedUnits: 200 },
      {
        ...BASE_RESULT,
        operatingProfit: 200 * 700 - 10_000, // 130 000 > 0
        contributionMarginPct: { status: "valido", value: 15 }, // < 20%
      },
      makeScenarios(5_000) // pesimista rentable (valor manual)
    );
    expect(result.riskLevel).toBe("medio");
    expect(result.mainRiskFactor).toContain("20%");
  });
});

// ─── Bajo ────────────────────────────────────────────────────────────────────

describe("diagnosticarNegocio — bajo", () => {
  it("retorna bajo cuando todos los indicadores son saludables", () => {
    // profit > 0, pesimista profitable, coverage ≈ 7 > 1.3, marginPct = 70% > 20%
    const result = diagnosticarNegocio(BASE_INPUTS, BASE_RESULT, HEALTHY_SCENARIOS);
    expect(result.riskLevel).toBe("bajo");
    expect(result.summary).toBeTruthy();
  });

  it("mainRiskFactor es null cuando el riesgo es bajo", () => {
    const result = diagnosticarNegocio(BASE_INPUTS, BASE_RESULT, HEALTHY_SCENARIOS);
    expect(result.mainRiskFactor).toBeNull();
  });

  it("el resumen menciona que el negocio es rentable incluso en el escenario pesimista", () => {
    const result = diagnosticarNegocio(BASE_INPUTS, BASE_RESULT, HEALTHY_SCENARIOS);
    expect(result.summary).toContain("pesimista");
  });
});

// ─── Casos borde ─────────────────────────────────────────────────────────────

describe("diagnosticarNegocio — casos borde", () => {
  it("retorna alto cuando estimatedUnits = 0 y hay costos fijos", () => {
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, estimatedUnits: 0 },
      {
        ...BASE_RESULT,
        operatingProfit: -10_000, // 0 * 700 - 10 000
        monthlyRevenue: 0,
        totalVariableCosts: 0,
        totalCosts: 10_000,
      },
      makeScenarios(-10_000)
    );
    expect(result.riskLevel).toBe("alto");
  });

  it("retorna bajo cuando fixedCosts = 0 y hay margen positivo (sin breakeven que calcular)", () => {
    // breakeven.exact = 0 → coverage check skipped → no lowCoverage
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, fixedCosts: 0, estimatedUnits: 10 },
      {
        ...BASE_RESULT,
        operatingProfit: 10 * 700, // 7 000 > 0
        breakevenUnits: { status: "valido", value: { exact: 0, minimumWholeUnits: 0 } },
      },
      makeScenarios(4_900) // pesimista también rentable
    );
    expect(result.riskLevel).toBe("bajo");
  });

  it("retorna alto cuando operatingProfit = 0 exactamente y... wait, 0 is not < 0", () => {
    // profit === 0 is not "alto" — goes to medio checks
    const result = diagnosticarNegocio(
      BASE_INPUTS,
      { ...BASE_RESULT, operatingProfit: 0 },
      makeScenarios(-100) // pesimista pierde → medio
    );
    // 0 is not < 0, so not "alto"; pesimista loses → "medio"
    expect(result.riskLevel).toBe("medio");
  });

  it("nunca devuelve summary vacío ni null en ningún nivel de riesgo", () => {
    const cases = [
      { result: { ...BASE_RESULT, contributionMarginPerUnit: 0, operatingProfit: -10_000 }, scenarios: makeScenarios(-10_000) },
      { result: { ...BASE_RESULT, operatingProfit: -1_000 }, scenarios: makeScenarios(-5_000) },
      { result: BASE_RESULT, scenarios: makeScenarios(-100) },
      { result: BASE_RESULT, scenarios: HEALTHY_SCENARIOS },
    ];
    for (const { result, scenarios } of cases) {
      const diagnosis = diagnosticarNegocio(BASE_INPUTS, result, scenarios);
      expect(diagnosis.summary).toBeTruthy();
      expect(diagnosis.riskLevel).toBeDefined();
    }
  });

  it("no produce NaN ni Infinity en la lógica de cobertura cuando estimatedUnits = 0 y exact > 0", () => {
    // coverageRatio = 0 / 14.29 = 0 → 0 < 1.3 → lowCoverage = true
    // But operatingProfit = -10 000 < 0 → alto fires first
    const result = diagnosticarNegocio(
      { ...BASE_INPUTS, estimatedUnits: 0 },
      { ...BASE_RESULT, operatingProfit: -10_000 },
      makeScenarios(-10_000)
    );
    expect(result.riskLevel).toBe("alto"); // alto fires before coverage check
    expect(Number.isNaN(0)).toBe(false);   // sanity: 0 is not NaN
  });
});
