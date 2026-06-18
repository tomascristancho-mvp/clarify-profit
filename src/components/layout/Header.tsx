const SCENARIO_BARS: Array<{ label: string; barClass: string; color: string }> = [
  { label: "Pes.", barClass: "h-4", color: "bg-red-400/60" },
  { label: "Esp.", barClass: "h-8", color: "bg-indigo-400/70" },
  { label: "Opt.", barClass: "h-12", color: "bg-emerald-400/70" },
];

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900">
      {/* Decorative glows — aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* ── Left column: copy ── */}
          <div>
            {/* Top badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-white/80 ring-1 ring-inset ring-white/20">
                <span aria-hidden="true" className="text-emerald-400">✦</span>
                Herramienta educativa gratuita para emprendedores
              </span>
            </div>

            {/* H1 */}
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Descubre si tu negocio{" "}
              <span className="text-indigo-300">es rentable</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Ingresa costos, precio y ventas estimadas. Obtén tu utilidad mensual,
              punto de equilibrio, nivel de riesgo y proyección de escenarios.
              Sin contabilidad.
            </p>

            {/* Value badges */}
            <ul
              aria-label="Características de la herramienta"
              className="mb-10 flex flex-wrap gap-2"
            >
              {[
                "Sin registro",
                "100% gratuito",
                "Nivel de riesgo",
                "Punto de equilibrio",
              ].map((v) => (
                <li
                  key={v}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 ring-1 ring-inset ring-white/10"
                >
                  <span aria-hidden="true" className="font-bold text-emerald-400">
                    ✓
                  </span>
                  {v}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a
              href="#form-section"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-900 shadow-lg shadow-black/20 transition-all duration-200 hover:bg-indigo-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900"
            >
              Calcular mi negocio
              <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* ── Right column: decorative mini-dashboard ──────────────────────────
              aria-hidden="true" — purely visual, no real financial data.
              hidden on mobile to avoid layout saturation.                       */}
          <div aria-hidden="true" className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm">

              {/* Card header */}
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/50">
                  Ejemplo
                </span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                  ✓ Bajo riesgo
                </span>
              </div>

              {/* Main metric */}
              <div className="mb-4">
                <p className="mb-1 text-xs text-white/40">Utilidad estimada / mes</p>
                <p className="text-3xl font-bold tracking-tight text-white">$1.248.000</p>
              </div>

              {/* Breakeven */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                <p className="text-xs text-white/50">Punto de equilibrio</p>
                <p className="text-sm font-semibold text-white">58 unidades</p>
              </div>

              {/* Scenario bars */}
              <div>
                <p className="mb-2.5 text-xs text-white/40">Escenarios de utilidad</p>
                <div className="flex items-end gap-2">
                  {SCENARIO_BARS.map(({ label, barClass, color }) => (
                    <div key={label} className="flex flex-1 flex-col items-center gap-1">
                      <div className={`w-full rounded-sm ${barClass} ${color}`} />
                      <span className="text-xs text-white/40">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
