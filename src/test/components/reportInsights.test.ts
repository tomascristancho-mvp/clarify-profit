import { describe, it, expect } from "vitest";
import type { WhatIfSimulation } from "@/domain/whatIf";
import type { RiskLevel } from "@/domain/diagnosis";
import {
  getBestOpportunity,
  getMostDangerousVariable,
  getWeeklyBreakevenTarget,
  getActionPlan,
  getChecklist,
  getRiskRecommendations,
} from "@/components/report/reportInsights";

const RISK_LEVELS: RiskLevel[] = ["bajo", "medio", "alto", "no_viable"];

function sim(overrides: Partial<WhatIfSimulation>): WhatIfSimulation {
  return {
    variable: "price",
    adjustmentPct: 0.1,
    label: "Precio +10%",
    newProfit: 100_000,
    profitDelta: 50_000,
    newBreakevenUnits: 100,
    riskLevel: "bajo",
    ...overrides,
  };
}

describe("getBestOpportunity", () => {
  it("devuelve la simulación con el mayor delta positivo", () => {
    const sims = [
      sim({ label: "A", profitDelta: 10_000 }),
      sim({ label: "B", profitDelta: 90_000 }),
      sim({ label: "C", profitDelta: 40_000 }),
    ];
    expect(getBestOpportunity(sims)?.label).toBe("B");
  });

  it("ignora deltas negativos y cero", () => {
    const sims = [
      sim({ label: "A", profitDelta: -100_000 }),
      sim({ label: "B", profitDelta: 0 }),
      sim({ label: "C", profitDelta: 5_000 }),
    ];
    expect(getBestOpportunity(sims)?.label).toBe("C");
  });

  it("devuelve null cuando no hay deltas positivos", () => {
    const sims = [
      sim({ profitDelta: -10_000 }),
      sim({ profitDelta: 0 }),
    ];
    expect(getBestOpportunity(sims)).toBeNull();
  });

  it("devuelve null con lista vacía", () => {
    expect(getBestOpportunity([])).toBeNull();
  });
});

describe("getMostDangerousVariable", () => {
  it("devuelve la simulación con el delta más negativo", () => {
    const sims = [
      sim({ label: "A", profitDelta: -10_000 }),
      sim({ label: "B", profitDelta: -90_000 }),
      sim({ label: "C", profitDelta: 40_000 }),
    ];
    expect(getMostDangerousVariable(sims)?.label).toBe("B");
  });

  it("devuelve null cuando no hay deltas negativos", () => {
    const sims = [sim({ profitDelta: 0 }), sim({ profitDelta: 10_000 })];
    expect(getMostDangerousVariable(sims)).toBeNull();
  });

  it("devuelve null con lista vacía", () => {
    expect(getMostDangerousVariable([])).toBeNull();
  });
});

describe("getWeeklyBreakevenTarget", () => {
  it("divide el equilibrio mensual entre 4,3 semanas y redondea hacia arriba", () => {
    // 154 / 4.3 = 35.81… → 36
    expect(getWeeklyBreakevenTarget(154)).toBe(36);
  });

  it("no redondea hacia arriba cuando la división es exacta", () => {
    // 43 / 4.3 = 10 exacto
    expect(getWeeklyBreakevenTarget(43)).toBe(10);
  });

  it("devuelve 1 para equilibrios muy pequeños (nunca 0 si hay unidades)", () => {
    expect(getWeeklyBreakevenTarget(1)).toBe(1);
  });

  it("devuelve 0 cuando el equilibrio es 0", () => {
    expect(getWeeklyBreakevenTarget(0)).toBe(0);
  });
});

describe("getActionPlan", () => {
  it.each(RISK_LEVELS)("nivel %s: devuelve 4 semanas con acciones no vacías", (level) => {
    const plan = getActionPlan(level);
    expect(plan).toHaveLength(4);
    for (const week of plan) {
      expect(week.week).toMatch(/^Semana [1-4]$/);
      expect(week.actions.length).toBeGreaterThan(0);
      for (const action of week.actions) {
        expect(action.trim()).not.toBe("");
      }
    }
  });
});

describe("getChecklist", () => {
  it.each(RISK_LEVELS)("nivel %s: devuelve 7 ítems no vacíos", (level) => {
    const checklist = getChecklist(level);
    expect(checklist).toHaveLength(7);
    for (const item of checklist) {
      expect(item.trim()).not.toBe("");
    }
  });
});

describe("getRiskRecommendations", () => {
  it.each(RISK_LEVELS)("nivel %s: devuelve 3 recomendaciones no vacías", (level) => {
    const recs = getRiskRecommendations(level);
    expect(recs).toHaveLength(3);
    for (const rec of recs) {
      expect(rec.trim()).not.toBe("");
    }
  });
});
