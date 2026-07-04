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

export function buildWhatsAppReportUrl(data: ReportMessageData): string {
  const message = [
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

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
