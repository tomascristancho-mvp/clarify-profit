const WHATSAPP_PHONE = "573027167144";

export function buildWhatsAppReportUrl(businessName?: string): string {
  const negocioLine = businessName
    ? `Negocio: ${businessName}`
    : "Negocio: (sin nombre)";

  const message = [
    "Hola, quiero solicitar el reporte ejecutivo premium de Negocio Claro.",
    "",
    negocioLine,
    "Precio piloto: $9.900 COP.",
    "",
    "Quisiera saber cómo recibirlo.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
