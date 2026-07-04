import { Header } from "@/components/layout/Header";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { EducationalNotice } from "@/components/layout/EducationalNotice";
import { CalculatorApp } from "@/components/CalculatorApp";

// Structured data so search engines understand this is a free finance web app.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Negocio Claro",
  url: "https://clarify-profit.vercel.app",
  description:
    "Calculadora educativa de rentabilidad para emprendedores: utilidad mensual, punto de equilibrio, nivel de riesgo y escenarios.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "es",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "COP",
  },
  creator: {
    "@type": "Organization",
    name: "AI Health Colombia",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Header />
      <HowItWorks />
      <CalculatorApp />
      <EducationalNotice />
    </>
  );
}
