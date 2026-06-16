export const SCENARIO_FACTORS = {
  pesimista: 0.7,
  esperado: 1.0,
  optimista: 1.3,
} as const;

export type ScenarioKey = keyof typeof SCENARIO_FACTORS;

export const SCENARIOS: Array<{ key: ScenarioKey; label: string; factor: number }> = [
  { key: "pesimista", label: "Pesimista", factor: SCENARIO_FACTORS.pesimista },
  { key: "esperado", label: "Esperado", factor: SCENARIO_FACTORS.esperado },
  { key: "optimista", label: "Optimista", factor: SCENARIO_FACTORS.optimista },
];
