import { describe, it, expect } from "vitest";
import { validateInputs } from "@/validation/validateInputs";
import type { FormInputs } from "@/domain/types";

const VALID_INPUTS: FormInputs = {
  businessName: "Test",
  currency: "COP",
  fixedCosts: "2000000",
  variableCostPerUnit: "12000",
  pricePerUnit: "25000",
  estimatedUnits: "250",
  initialInvestment: "5000000",
};

describe("validateInputs — entradas válidas", () => {
  it("acepta entradas válidas y parsea los números correctamente", () => {
    const result = validateInputs(VALID_INPUTS);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.fixedCosts).toBe(2_000_000);
      expect(result.data.variableCostPerUnit).toBe(12_000);
      expect(result.data.pricePerUnit).toBe(25_000);
      expect(result.data.estimatedUnits).toBe(250);
      expect(result.data.initialInvestment).toBe(5_000_000);
    }
  });

  it("acepta 0 en costos fijos", () => {
    const result = validateInputs({ ...VALID_INPUTS, fixedCosts: "0" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.fixedCosts).toBe(0);
    }
  });

  it("acepta 0 en costo variable por unidad", () => {
    const result = validateInputs({ ...VALID_INPUTS, variableCostPerUnit: "0" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.variableCostPerUnit).toBe(0);
    }
  });

  it("acepta 0 en unidades estimadas", () => {
    const result = validateInputs({ ...VALID_INPUTS, estimatedUnits: "0" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.estimatedUnits).toBe(0);
    }
  });

  it("acepta 0 en inversión inicial", () => {
    const result = validateInputs({ ...VALID_INPUTS, initialInvestment: "0" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.initialInvestment).toBe(0);
    }
  });

  it("hace trim del nombre del negocio", () => {
    const result = validateInputs({ ...VALID_INPUTS, businessName: "  Mi Tienda  " });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.businessName).toBe("Mi Tienda");
    }
  });

  it("elimina comas (separador de miles) sin alterar el valor matemático", () => {
    const result = validateInputs({ ...VALID_INPUTS, fixedCosts: "2,000,000" });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.fixedCosts).toBe(2_000_000);
    }
  });
});

describe("validateInputs — campos vacíos (rechazados)", () => {
  it("rechaza costos fijos vacíos con mensaje específico", () => {
    const result = validateInputs({ ...VALID_INPUTS, fixedCosts: "" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.fixedCosts).toBeDefined();
      expect(result.errors.fixedCosts).toContain("número");
    }
  });

  it("rechaza precio de venta vacío con mensaje específico", () => {
    const result = validateInputs({ ...VALID_INPUTS, pricePerUnit: "" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.pricePerUnit).toBeDefined();
      expect(result.errors.pricePerUnit).toContain("número");
    }
  });

  it("rechaza unidades estimadas vacías con mensaje específico", () => {
    const result = validateInputs({ ...VALID_INPUTS, estimatedUnits: "" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.estimatedUnits).toBeDefined();
    }
  });
});

describe("validateInputs — valores negativos (rechazados)", () => {
  it("rechaza costos fijos negativos con mención de 'negativo'", () => {
    const result = validateInputs({ ...VALID_INPUTS, fixedCosts: "-1000" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.fixedCosts).toContain("negativo");
    }
  });

  it("rechaza precio de venta negativo", () => {
    const result = validateInputs({ ...VALID_INPUTS, pricePerUnit: "-500" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.pricePerUnit).toContain("negativo");
    }
  });

  it("rechaza unidades estimadas negativas", () => {
    const result = validateInputs({ ...VALID_INPUTS, estimatedUnits: "-10" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.estimatedUnits).toContain("negativ");
    }
  });

  it("rechaza inversión inicial negativa", () => {
    const result = validateInputs({ ...VALID_INPUTS, initialInvestment: "-100" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.initialInvestment).toContain("negativo");
    }
  });
});

describe("validateInputs — precio de venta = 0 (rechazado)", () => {
  it("rechaza precio de venta igual a cero con mensaje que menciona 'mayor que cero'", () => {
    const result = validateInputs({ ...VALID_INPUTS, pricePerUnit: "0" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.pricePerUnit).toContain("mayor que cero");
    }
  });
});

describe("validateInputs — texto no numérico (rechazado)", () => {
  it("rechaza texto en campo numérico con mensaje que menciona 'número'", () => {
    const result = validateInputs({ ...VALID_INPUTS, fixedCosts: "dos millones" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.fixedCosts).toContain("número");
    }
  });
});

describe("validateInputs — unidades decimales (rechazadas)", () => {
  it("rechaza unidades con decimal e indica que debe ser entero", () => {
    const result = validateInputs({ ...VALID_INPUTS, estimatedUnits: "250.5" });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.estimatedUnits).toContain("entero");
    }
  });
});

describe("validateInputs — múltiples errores simultáneos", () => {
  it("acumula errores de varios campos a la vez sin perder ninguno", () => {
    const result = validateInputs({
      ...VALID_INPUTS,
      fixedCosts: "-100",
      pricePerUnit: "0",
      estimatedUnits: "abc",
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errors.fixedCosts).toBeDefined();
      expect(result.errors.pricePerUnit).toBeDefined();
      expect(result.errors.estimatedUnits).toBeDefined();
    }
  });
});
