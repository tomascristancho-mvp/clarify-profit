export function EducationalNotice() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="text-sm leading-relaxed text-amber-800">
            Los resultados son estimaciones educativas calculadas con los datos que ingresaste.
            No tienen en cuenta impuestos, costos de oportunidad ni imprevistos.
            Antes de tomar decisiones financieras importantes,{" "}
            <strong>consulta con un contador o asesor de confianza.</strong>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Negocio Claro · Herramienta educativa para emprendedores
        </p>
      </div>
    </footer>
  );
}
