import { ImageResponse } from "next/og";

export const alt =
  "Negocio Claro — Calculadora de rentabilidad para emprendedores";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded card shown when the link is shared on WhatsApp, social media, etc.
// Pure JSX + inline styles — ImageResponse does not support Tailwind classes.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 55%, #4c1d95 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 22px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.85)",
              fontSize: "24px",
            }}
          >
            Herramienta educativa gratuita
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "82px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          ¿Tu negocio es rentable?
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "34px",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.4,
            marginBottom: "48px",
            maxWidth: "820px",
          }}
        >
          Utilidad mensual, punto de equilibrio, nivel de riesgo y escenarios —
          en 2 minutos, sin contabilidad.
        </div>

        {/* Brand row with scenario bars */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "36px",
              fontWeight: 700,
              color: "#a5b4fc",
              letterSpacing: "0.05em",
            }}
          >
            Negocio Claro
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                width: "56px",
                height: "52px",
                borderRadius: "8px",
                backgroundColor: "rgba(248,113,113,0.75)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: "56px",
                height: "88px",
                borderRadius: "8px",
                backgroundColor: "rgba(129,140,248,0.85)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: "56px",
                height: "128px",
                borderRadius: "8px",
                backgroundColor: "rgba(52,211,153,0.85)",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
