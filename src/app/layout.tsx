import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://clarify-profit.vercel.app";
const SITE_TITLE = "Negocio Claro — Calculadora de rentabilidad";
const SITE_DESCRIPTION =
  "Descubre cuánto necesitas vender, cuánto podrías ganar y en cuánto tiempo recuperarías tu inversión. Herramienta educativa gratuita para emprendedores.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "Negocio Claro",
  authors: [{ name: "AI Health Colombia" }],
  creator: "AI Health Colombia",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Negocio Claro",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Browser chrome (address bar, status bar) matches the active theme.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

// Applies the saved (or system) theme before first paint to avoid a flash
// of the wrong mode. Must be inline and synchronous — do not move to a module.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col font-sans text-slate-900 dark:text-slate-100">
        {/* Keyboard users can jump straight to the calculator (WCAG 2.4.1) */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
