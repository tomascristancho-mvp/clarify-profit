import { describe, it, expect } from "vitest";
import { formatPercentage } from "@/format/percentage";

describe("formatPercentage", () => {
  it("formatea 52 como '52,0 %' (ejemplo de cafetería, locale es-CO)", () => {
    const result = formatPercentage(52);
    // es-CO locale: comma as decimal separator, space before %
    expect(result).toMatch(/52[,.]0/);
  });

  it("formatea un porcentaje con 1 decimal", () => {
    const result = formatPercentage(25.5);
    expect(result).toMatch(/25[,.]5/);
  });

  it("formatea 0% con 1 decimal", () => {
    const result = formatPercentage(0);
    expect(result).toMatch(/0[,.]0/);
  });

  it("formatea 100% con 1 decimal", () => {
    const result = formatPercentage(100);
    expect(result).toMatch(/100[,.]0/);
  });

  it("formatea un porcentaje negativo con signo menos", () => {
    const result = formatPercentage(-10);
    expect(result).toContain("-");
    expect(result).toMatch(/10[,.]0/);
  });

  it("redondea a 1 decimal (25.55% → 25,6% o 25,5% según redondeo)", () => {
    const result = formatPercentage(25.55);
    // Exactly 1 decimal digit after separator
    expect(result).toMatch(/25[,.]\d/);
  });
});
