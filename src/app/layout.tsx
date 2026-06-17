import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Negocio Claro — Calculadora de rentabilidad",
  description:
    "Descubre cuánto necesitas vender, cuánto podrías ganar y en cuánto tiempo recuperarías tu inversión. Herramienta educativa gratuita para emprendedores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
