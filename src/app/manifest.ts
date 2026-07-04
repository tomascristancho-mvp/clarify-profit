import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Negocio Claro — Calculadora de rentabilidad",
    short_name: "Negocio Claro",
    description:
      "Calculadora educativa de rentabilidad para emprendedores: utilidad mensual, punto de equilibrio, nivel de riesgo y escenarios.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#312e81",
    lang: "es",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
