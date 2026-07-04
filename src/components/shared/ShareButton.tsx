"use client";

import { useState } from "react";

const SHARE_URL = "https://clarify-profit.vercel.app";
const SHARE_TEXT =
  "Calculé la rentabilidad de mi negocio gratis con Negocio Claro: utilidad mensual, punto de equilibrio y nivel de riesgo en 2 minutos.";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Web Share API on mobile; clipboard fallback on desktop
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Negocio Claro",
          text: SHARE_TEXT,
          url: SHARE_URL,
        });
      } catch {
        // User cancelled the share sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable (old browser / http) — silently ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
        <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      </svg>
      {copied ? "¡Enlace copiado!" : "Compartir"}
    </button>
  );
}
