import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/format/currency";

describe("formatCurrency — COP", () => {
  it("formatea sin decimales (0 decimal places para COP)", () => {
    // 1000.99 rounded to 0 decimals should not show ".99" or ",99"
    const result = formatCurrency(1_000.99, "COP");
    expect(result).not.toMatch(/[.,]99/);
  });

  it("formatea 0 sin decimales", () => {
    const result = formatCurrency(0, "COP");
    expect(result).toContain("0");
    expect(result).not.toMatch(/[.,]\d{2}/);
  });

  it("formatea el valor del ejemplo de referencia con separadores de miles", () => {
    const result = formatCurrency(6_250_000, "COP");
    // es-CO locale uses "." as thousands separator — remove spaces and verify
    const clean = result.replace(/[\s ]/g, "");
    expect(clean).toContain("6.250.000");
  });
});

describe("formatCurrency — USD", () => {
  it("formatea con 2 decimales y símbolo $", () => {
    const result = formatCurrency(1_234.56, "USD");
    expect(result).toContain("$");
    expect(result).toContain("1,234.56");
  });

  it("formatea 0 con 2 decimales", () => {
    const result = formatCurrency(0, "USD");
    expect(result).toContain("0.00");
  });

  it("formatea valor negativo correctamente", () => {
    const result = formatCurrency(-500.5, "USD");
    expect(result).toContain("-");
    expect(result).toContain("500.50");
  });
});

describe("formatCurrency — EUR", () => {
  it("formatea con símbolo € y 2 decimales", () => {
    const result = formatCurrency(1_234.56, "EUR");
    expect(result).toContain("€");
    // 2 decimal places: look for a separator (. or ,) followed by exactly 2 digits
    expect(result).toMatch(/[.,]\d{2}(\s|$| )/);
  });

  it("formatea 0 con 2 decimales", () => {
    const result = formatCurrency(0, "EUR");
    expect(result).toContain("€");
    expect(result).toMatch(/0[.,]00/);
  });
});
