const WHATSAPP_PHONE = "573027167144";

export interface ReportMessageData {
  businessName: string;
  pricePerUnit: string;
  estimatedUnits: string;
  monthlyRevenue: string;
  fixedCosts: string;
  variableCostPerUnit: string;
  operatingProfit: string;
  contributionMarginPct: string;
  breakevenUnits: string;
  monthlyROI: string;
  recoveryTimeMonths: string;
  riskLevel: string;
  mainRiskFactor: string;
}

function buildEnrichedMessage(data: ReportMessageData): string {
  return [
    "Hola, quiero solicitar el reporte ejecutivo premium de Negocio Claro.",
    "",
    `Negocio: ${data.businessName || "(sin nombre)"}`,
    "Precio piloto: $9.900 COP.",
    "",
    "Datos para el reporte:",
    "",
    `* Precio de venta: ${data.pricePerUnit}`,
    `* Unidades mensuales estimadas: ${data.estimatedUnits}`,
    `* Ingresos mensuales estimados: ${data.monthlyRevenue}`,
    `* Costos fijos mensuales: ${data.fixedCosts}`,
    `* Costo variable unitario: ${data.variableCostPerUnit}`,
    `* Utilidad mensual estimada: ${data.operatingProfit}`,
    `* Margen de contribución: ${data.contributionMarginPct}`,
    `* Punto de equilibrio: ${data.breakevenUnits}`,
    `* ROI estimado: ${data.monthlyROI}`,
    `* Tiempo de recuperación: ${data.recoveryTimeMonths}`,
    `* Nivel de riesgo: ${data.riskLevel}`,
    `* Principal factor de riesgo: ${data.mainRiskFactor}`,
    "",
    "Correo para recibirlo:",
    "[escribir correo]",
    "",
    "Quisiera saber cómo pagar y recibir el reporte.",
  ].join("\n");
}

function buildSimpleMessage(businessName?: string): string {
  const negocioLine = businessName
    ? `Negocio: ${businessName}`
    : "Negocio: (sin nombre)";
  return [
    "Hola, quiero solicitar el reporte ejecutivo premium de Negocio Claro.",
    "",
    negocioLine,
    "Precio piloto: $9.900 COP.",
    "",
    "Quisiera saber cómo recibirlo.",
  ].join("\n");
}

// Overload 1: enriched message with full financial data (used by ExecutiveReportPreview)
export function buildWhatsAppReportUrl(data: ReportMessageData): string;
// Overload 2: simple message with business name only (legacy, used by ExecutiveReportTeaser)
export function buildWhatsAppReportUrl(businessName?: string): string;
export function buildWhatsAppReportUrl(arg?: ReportMessageData | string): string {
  const message =
    typeof arg === "object" && arg !== null
      ? buildEnrichedMessage(arg)
      : buildSimpleMessage(arg);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
