import { describe, it, expect } from "vitest";
import {
  buildWhatsAppReportUrl,
  type ReportMessageData,
} from "@/components/conversion/whatsappReportUrl";

function reportData(overrides: Partial<ReportMessageData> = {}): ReportMessageData {
  return {
    businessName: "Cafetería de ejemplo",
    pricePerUnit: "$ 25.000",
    estimatedUnits: "250",
    monthlyRevenue: "$ 6.250.000",
    fixedCosts: "$ 2.000.000",
    variableCostPerUnit: "$ 12.000",
    operatingProfit: "$ 1.250.000",
    contributionMarginPct: "52,0 %",
    breakevenUnits: "154 unidades/mes",
    monthlyROI: "25,0 %",
    recoveryTimeMonths: "4 meses",
    riskLevel: "Bajo riesgo",
    mainRiskFactor: "No identificado",
    ...overrides,
  };
}

function decodeMessage(url: string): string {
  const text = new URL(url).searchParams.get("text");
  expect(text).not.toBeNull();
  return text as string;
}

describe("buildWhatsAppReportUrl", () => {
  it("apunta al número de WhatsApp correcto", () => {
    const url = buildWhatsAppReportUrl(reportData());
    expect(url.startsWith("https://wa.me/573027167144?text=")).toBe(true);
  });

  it("el mensaje decodificado contiene todos los datos financieros", () => {
    const message = decodeMessage(buildWhatsAppReportUrl(reportData()));

    expect(message).toContain("Negocio: Cafetería de ejemplo");
    expect(message).toContain("Precio piloto: $9.900 COP.");
    expect(message).toContain("* Precio de venta: $ 25.000");
    expect(message).toContain("* Unidades mensuales estimadas: 250");
    expect(message).toContain("* Ingresos mensuales estimados: $ 6.250.000");
    expect(message).toContain("* Costos fijos mensuales: $ 2.000.000");
    expect(message).toContain("* Costo variable unitario: $ 12.000");
    expect(message).toContain("* Utilidad mensual estimada: $ 1.250.000");
    expect(message).toContain("* Margen de contribución: 52,0 %");
    expect(message).toContain("* Punto de equilibrio: 154 unidades/mes");
    expect(message).toContain("* ROI estimado: 25,0 %");
    expect(message).toContain("* Tiempo de recuperación: 4 meses");
    expect(message).toContain("* Nivel de riesgo: Bajo riesgo");
    expect(message).toContain("* Principal factor de riesgo: No identificado");
    expect(message).toContain("Correo para recibirlo:");
    expect(message).toContain("Quisiera saber cómo pagar y recibir el reporte.");
  });

  it("usa '(sin nombre)' cuando el negocio no tiene nombre", () => {
    const message = decodeMessage(
      buildWhatsAppReportUrl(reportData({ businessName: "" }))
    );
    expect(message).toContain("Negocio: (sin nombre)");
  });

  it("conserva caracteres especiales del nombre tras codificar y decodificar", () => {
    const message = decodeMessage(
      buildWhatsAppReportUrl(reportData({ businessName: "Café & Té 100% Ñoño" }))
    );
    expect(message).toContain("Negocio: Café & Té 100% Ñoño");
  });

  it("no produce caracteres sin codificar que rompan la URL", () => {
    const url = buildWhatsAppReportUrl(reportData());
    const textParam = url.split("?text=")[1];
    // Un query string válido no contiene espacios, saltos de línea ni '&' crudos
    expect(textParam).not.toMatch(/[\s&]/);
  });

  it("transmite los indicadores no disponibles tal cual", () => {
    const message = decodeMessage(
      buildWhatsAppReportUrl(
        reportData({
          monthlyROI: "No disponible",
          recoveryTimeMonths: "No disponible",
        })
      )
    );
    expect(message).toContain("* ROI estimado: No disponible");
    expect(message).toContain("* Tiempo de recuperación: No disponible");
  });
});
