import type { RiskLevel } from "@/domain/diagnosis";
import type { WhatIfSimulation } from "@/domain/whatIf";

export interface ActionWeek {
  readonly week: string;
  readonly actions: readonly string[];
}

export function getBestOpportunity(
  simulations: WhatIfSimulation[]
): WhatIfSimulation | null {
  const positive = simulations.filter((s) => s.profitDelta > 0);
  if (positive.length === 0) return null;
  return positive.reduce((best, s) =>
    s.profitDelta > best.profitDelta ? s : best
  );
}

export function getMostDangerousVariable(
  simulations: WhatIfSimulation[]
): WhatIfSimulation | null {
  const negative = simulations.filter((s) => s.profitDelta < 0);
  if (negative.length === 0) return null;
  return negative.reduce((worst, s) =>
    s.profitDelta < worst.profitDelta ? s : worst
  );
}

export function getWeeklyBreakevenTarget(minimumWholeUnits: number): number {
  return Math.ceil(minimumWholeUnits / 4.3);
}

const ACTION_PLANS: Record<RiskLevel, readonly ActionWeek[]> = {
  bajo: [
    { week: "Semana 1", actions: ["Documenta los procesos que generan más margen.", "Identifica qué canales tienen mayor conversión."] },
    { week: "Semana 2", actions: ["Evalúa si puedes subir el precio sin reducir la demanda.", "Analiza si puedes añadir un producto o servicio complementario."] },
    { week: "Semana 3", actions: ["Optimiza costos fijos sin sacrificar calidad.", "Mide la satisfacción de tus clientes actuales."] },
    { week: "Semana 4", actions: ["Revisa si puedes aumentar el volumen de ventas.", "Define una meta de crecimiento concreta para el mes siguiente."] },
  ],
  medio: [
    { week: "Semana 1", actions: ["Identifica qué costos fijos puedes reducir a corto plazo.", "Compara tu precio con al menos dos competidores directos."] },
    { week: "Semana 2", actions: ["Aumenta el esfuerzo de ventas para acercarte al punto de equilibrio.", "Evalúa si hay gastos prescindibles este mes."] },
    { week: "Semana 3", actions: ["Prepara un plan de contingencia para el escenario pesimista.", "Negocia condiciones con tus principales proveedores."] },
    { week: "Semana 4", actions: ["Mide el resultado real frente al estimado.", "Ajusta precio o volumen si los números no mejoran."] },
  ],
  alto: [
    { week: "Semana 1", actions: ["Reduce los costos fijos no esenciales de forma inmediata.", "Revisa si el precio puede subir sin perder clientes clave."] },
    { week: "Semana 2", actions: ["Enfoca todos los esfuerzos en alcanzar el punto de equilibrio.", "Elimina actividades que consuman recursos sin generar ingresos."] },
    { week: "Semana 3", actions: ["Evalúa si el modelo de negocio es sostenible a 90 días.", "Busca asesoría de un contador o asesor de confianza."] },
    { week: "Semana 4", actions: ["Define una fecha límite para evaluar si continúas o ajustas el modelo.", "Compara resultados reales con el punto de equilibrio calculado."] },
  ],
  no_viable: [
    { week: "Semana 1", actions: ["Revisa urgentemente el precio frente al costo variable por unidad.", "Cada venta aumenta la pérdida: detén el crecimiento de ventas por ahora."] },
    { week: "Semana 2", actions: ["Busca alternativas para reducir el costo variable (proveedores, proceso).", "Evalúa si puedes aumentar el precio sin perder toda la demanda."] },
    { week: "Semana 3", actions: ["Consulta con un asesor antes de seguir invirtiendo capital.", "Analiza si el producto requiere un rediseño de precio o costos."] },
    { week: "Semana 4", actions: ["Define si continúas, pivoteas o pausas el negocio.", "No amplíes operaciones hasta tener margen de contribución positivo."] },
  ],
};

export function getActionPlan(riskLevel: RiskLevel): readonly ActionWeek[] {
  return ACTION_PLANS[riskLevel];
}

const CHECKLISTS: Record<RiskLevel, readonly string[]> = {
  bajo: [
    "Confirma que todos los costos fijos están registrados.",
    "Verifica que el precio de venta refleja el valor que ofreces.",
    "Mide cuántas unidades vendiste realmente el último mes.",
    "Revisa si hay costos variables que puedas optimizar.",
    "Evalúa si puedes subir el precio entre un 5 y un 10%.",
    "Define una meta de ventas para el próximo mes.",
    "Calcula cuánto necesitas para crecer al doble del punto de equilibrio.",
  ],
  medio: [
    "Lista todos los costos fijos y marca cuáles son reducibles.",
    "Compara el precio con al menos dos competidores directos.",
    "Mide cuántas unidades vendiste el último mes vs. el estimado.",
    "Identifica en qué semana fue más difícil vender y por qué.",
    "Revisa si hay gastos que puedas diferir o eliminar.",
    "Habla con al menos un cliente sobre por qué te compra.",
    "Calcula cuánto necesitas vender más para bajar el nivel de riesgo.",
  ],
  alto: [
    "Identifica los 3 costos fijos más altos y evalúa si son necesarios.",
    "Verifica que el precio de venta cubra el costo variable más un margen mínimo.",
    "Compara las ventas reales del mes con el punto de equilibrio.",
    "Lista todos los gastos del mes y clasifica: esencial o prescindible.",
    "Habla esta semana con un contador o asesor de confianza.",
    "Define cuál es el mínimo de ventas para no aumentar la deuda.",
    "Prepara un escenario de ajuste si los números no mejoran en 30 días.",
  ],
  no_viable: [
    "Verifica que el precio de venta supera el costo variable por unidad.",
    "Lista opciones para reducir el costo variable (urgente).",
    "Evalúa si puedes subir el precio en al menos un 10–20%.",
    "Pausa cualquier plan de expansión hasta tener margen positivo.",
    "Consulta con un asesor antes de seguir invirtiendo.",
    "Analiza si el modelo de negocio es viable con los costos actuales.",
    "Define una fecha límite para tomar una decisión estratégica.",
  ],
};

export function getChecklist(riskLevel: RiskLevel): readonly string[] {
  return CHECKLISTS[riskLevel];
}

const RISK_RECOMMENDATIONS: Record<RiskLevel, readonly string[]> = {
  bajo: [
    "Documenta qué está funcionando bien para poder replicarlo o escalar.",
    "Explora si puedes aumentar el precio entre un 5 y un 10% sin perder demanda.",
    "Considera diversificar los ingresos para reducir dependencia de un solo producto.",
  ],
  medio: [
    "Enfoca el esfuerzo en vender entre un 10 y un 15% más antes de subir costos.",
    "Revisa los costos fijos: un ajuste del 10% puede cambiar el nivel de riesgo.",
    "Prepara un plan de contingencia para el escenario pesimista (ventas −30%).",
  ],
  alto: [
    "Prioriza alcanzar el punto de equilibrio antes de pensar en crecer.",
    "Revisa si el modelo de negocio actual es sostenible con los costos actuales.",
    "Reduce costos fijos o sube precios en las próximas dos semanas.",
  ],
  no_viable: [
    "El precio de venta no cubre el costo variable: es la prioridad número uno.",
    "No amplíes ventas ni inversión hasta tener margen de contribución positivo.",
    "Considera asesoría profesional antes de tomar cualquier decisión de capital.",
  ],
};

export function getRiskRecommendations(riskLevel: RiskLevel): readonly string[] {
  return RISK_RECOMMENDATIONS[riskLevel];
}
