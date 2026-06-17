export function EducationalNotice() {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-5 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-300">
            Los resultados son{" "}
            <strong className="font-semibold text-white">estimaciones educativas</strong>{" "}
            calculadas con los datos que ingresaste. No tienen en cuenta impuestos,
            costos de oportunidad ni imprevistos. Antes de tomar decisiones financieras
            importantes,{" "}
            <strong className="font-semibold text-white">
              consulta con un contador o asesor de confianza.
            </strong>
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold text-white">Negocio Claro</p>
          <p className="text-xs text-slate-500">
            Herramienta educativa gratuita para emprendedores
          </p>
        </div>
      </div>
    </footer>
  );
}
