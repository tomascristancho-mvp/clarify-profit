# Prompt maestro — Reporte Ejecutivo Premium Negocio Claro

## Instrucciones de uso

Este archivo contiene el prompt maestro para generar un reporte ejecutivo premium en HTML a partir del mensaje de WhatsApp que envía el cliente al solicitar el reporte.

**Flujo de trabajo:**

1. El cliente hace clic en "Solicitar reporte completo" dentro de la calculadora de Negocio Claro.
2. Se abre WhatsApp con un mensaje prellenado con los datos financieros del negocio.
3. El cliente envía el mensaje.
4. Tú copias el mensaje recibido.
5. Abres Claude o ChatGPT.
6. Copias el prompt completo de la sección siguiente.
7. Reemplazas la sección `[PEGAR MENSAJE DE WHATSAPP AQUÍ]` con el mensaje real del cliente.
8. Envías el prompt a la IA.
9. La IA devuelve un documento HTML completo.
10. Copias el HTML, lo guardas como `reporte-[nombre-negocio].html`, lo abres en Chrome y usas "Imprimir → Guardar como PDF".
11. Envías el PDF al cliente.

---

## Prompt para copiar y pegar

```
Actúa simultáneamente como:
- Consultor financiero especializado en micronegocios y negocios informales latinoamericanos
- Analista de rentabilidad con enfoque en punto de equilibrio y margen de contribución
- Diseñador editorial de reportes ejecutivos de consultoría
- Redactor profesional en español claro, directo y sin jerga innecesaria

Tu tarea es generar un REPORTE EJECUTIVO PREMIUM completo en HTML para el cliente que aparece en el mensaje de WhatsApp a continuación.

---

MENSAJE DEL CLIENTE:

[PEGAR MENSAJE DE WHATSAPP AQUÍ]

---

INSTRUCCIONES DE SALIDA:

Genera un documento HTML completo con las siguientes características técnicas:

- Un único archivo HTML autocontenido
- CSS interno dentro de una etiqueta <style> en el <head>
- Sin dependencias externas (sin CDN, sin fuentes de Google, sin imágenes externas)
- Sin JavaScript ni scripts de ningún tipo
- Optimizado para impresión y exportación a PDF desde Chrome
- Tamaño de página tipo A4 (210mm × 297mm)
- Márgenes de impresión: 15mm superior/inferior, 18mm izquierdo/derecho
- Reglas @media print incluidas
- page-break-inside: avoid en cards y secciones importantes
- Clase .page-break para separar secciones en páginas nuevas donde corresponda

TIPOGRAFÍA:
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

PALETA DE COLORES (usa exactamente estos):
- Fondo principal: #ffffff
- Fondo secundario (cards, filas alternadas): #f8f9fa
- Fondo de portada: #1e293b (slate oscuro)
- Texto principal: #1e293b
- Texto secundario: #64748b
- Acento principal: #1d4ed8 (azul oscuro)
- Acento dorado (énfasis, títulos de sección): #92400e convertido en borde o subrayado sutil con #f59e0b
- Riesgo bajo (verde): #065f46 fondo #d1fae5
- Riesgo medio (amarillo/ámbar): #78350f fondo #fef3c7
- Riesgo alto (naranja): #9a3412 fondo #ffedd5
- No viable (rojo): #991b1b fondo #fee2e2
- Separadores: #e2e8f0
- Texto de advertencia: #64748b

DISEÑO:
- Estética premium tipo consultoría financiera, no startup
- Cards con bordes sutiles (1px solid #e2e8f0), esquinas redondeadas (8px), sin sombras pesadas
- Tablas limpias con cabecera en #1e293b texto blanco, filas alternadas #f8f9fa
- Jerarquía visual clara: portada → resumen → tablas → diagnóstico → plan → cierre
- No usar emojis en exceso (máximo 1 por sección como acento, y solo si suma claridad)
- No usar lenguaje exagerado ni promesas de rentabilidad
- No usar colores chillones ni gradientes complejos

---

ESTRUCTURA DEL DOCUMENTO (generar en este orden exacto):

### SECCIÓN 1 — PORTADA

Página completa con fondo #1e293b. Contenido centrado verticalmente.

Incluir:
- Marca: "Negocio Claro" en texto pequeño (14px), color #94a3b8, letra espaciada (letter-spacing: 0.15em), en mayúsculas
- Título principal: "Reporte Ejecutivo Premium" en blanco, 32px, font-weight 700
- Subtítulo: "Diagnóstico financiero y plan de acción" en #94a3b8, 16px
- Nombre del negocio del cliente en blanco, 20px, font-weight 600, con un separador horizontal fino (#334155) arriba y abajo
- Fecha del reporte (usar la fecha actual del sistema o la que aparezca en el mensaje)
- Badge "Versión piloto" con fondo #334155, texto #94a3b8, borde redondeado, tamaño pequeño
- Nota al pie de portada: "Herramienta educativa de apoyo a la toma de decisiones · No reemplaza asesoría financiera profesional" en #64748b, 11px

Agregar page-break-after a la portada.

---

### SECCIÓN 2 — RESUMEN EJECUTIVO

Título de sección: "Resumen ejecutivo"

Incluir:
- Párrafo de conclusión general en 4–6 líneas: escribe una síntesis clara de la situación financiera del negocio basada en los datos. Tono: directo, profesional, empático. No genérico.
- Grid de 3 columnas con las métricas principales en cards:
  * Utilidad mensual estimada (con color verde si positiva, rojo si negativa)
  * Ingresos mensuales estimados
  * Margen de contribución
  * Punto de equilibrio
  * ROI estimado (o "No disponible" si no hay inversión inicial)
  * Tiempo de recuperación (o "No disponible")
- Badge de nivel de riesgo con color correspondiente, centrado debajo de las métricas
- Semáforo visual en HTML/CSS puro: tres círculos (verde, amarillo, rojo) donde el color activo tiene tamaño completo y brillo, los otros están opacos. Usar divs con border-radius: 50%. Indicar debajo del semáforo en texto: el nivel de riesgo y una frase de una línea.

No agregar page-break dentro del resumen ejecutivo.

---

### SECCIÓN 3 — TABLA DE MÉTRICAS PRINCIPALES

Título de sección: "Métricas principales"

Tabla con 4 columnas:
- Métrica
- Valor (del mensaje del cliente)
- Interpretación breve (1 línea, escrita por la IA)
- Nivel de atención: badge con texto "Revisar" (ámbar), "Crítico" (rojo) o "Favorable" (verde)

Incluir estas filas (si el dato no está disponible, escribir "Dato no disponible"):
1. Precio de venta por unidad
2. Costo variable por unidad
3. Margen de contribución por unidad (calcular: precio - costo variable)
4. Margen de contribución porcentual
5. Unidades mensuales estimadas
6. Ingresos mensuales estimados
7. Costos fijos mensuales
8. Utilidad operativa mensual
9. Punto de equilibrio en unidades
10. Punto de equilibrio en ingresos (calcular: equilibrio_unidades × precio)
11. ROI mensual estimado
12. Tiempo de recuperación estimado

Agregar page-break-before a esta sección.

---

### SECCIÓN 4 — DIAGNÓSTICO FINANCIERO

Título de sección: "Diagnóstico financiero"

Escribir 5 subsecciones, cada una con un título pequeño (h4) y un párrafo de 3–5 líneas:

1. **Lectura de rentabilidad**: ¿El negocio genera utilidad o pérdida? ¿Por cuánto? ¿Qué significa eso en términos prácticos para el dueño?
2. **Lectura del margen**: ¿El margen de contribución es saludable? ¿Cuánto queda por unidad para pagar costos fijos? ¿Qué implica para el precio?
3. **Lectura del punto de equilibrio**: ¿Qué tan lejos o cerca está el negocio del equilibrio? ¿Cuántas unidades más o menos necesita vender?
4. **Lectura del ROI y recuperación**: Si hay inversión, ¿el retorno es razonable? ¿En cuánto tiempo se recupera? ¿Qué lo afecta?
5. **Qué debe vigilar**: Las 2–3 variables más importantes que el dueño debe monitorear semanalmente, con razón concreta.

Cada subsección en una card con borde izquierdo de color acento (#1d4ed8, 3px).

---

### SECCIÓN 5 — VARIABLE MÁS PELIGROSA

Título de sección: "Variable más peligrosa"

Con base en los datos disponibles, identificar la variable que, si cambia negativamente, más impacta la utilidad. Opciones posibles: precio de venta, costo variable, volumen de ventas, costos fijos.

Card destacada con borde superior rojo (3px, #dc2626). Incluir:
- Nombre de la variable identificada (en negrita, grande)
- Por qué es la más peligrosa (2–3 líneas): qué pasa si baja el precio un 10%, si sube el costo variable, si caen las ventas
- Recomendación concreta: una acción específica que el dueño puede tomar en los próximos 7 días
- Acción inmediata: una frase corta, en negrita, con lo más urgente

Agregar page-break-before a esta sección.

---

### SECCIÓN 6 — MAYOR OPORTUNIDAD DE MEJORA

Título de sección: "Mayor oportunidad de mejora"

Card destacada con borde superior verde (#059669, 3px). Incluir:
- Nombre de la oportunidad identificada (en negrita, grande)
- Por qué es la mejor palanca disponible con estos números (2–3 líneas)
- Cómo aprovecharla: pasos o condiciones prácticas
- Impacto potencial estimado: con los datos disponibles, estimar un rango razonable de mejora en utilidad si se ejecuta. Ser conservador y honesto.
- Indicador a monitorear: ¿qué número debe ver el dueño para saber que está funcionando?

---

### SECCIÓN 7 — PLAN DE ACCIÓN — 30 DÍAS

Título de sección: "Plan de acción — 30 días"

4 cards, una por semana. Cada card incluye:
- Título: "Semana X"
- Objetivo de la semana (1 frase)
- Lista de 3 acciones concretas (no genéricas, específicas para este negocio)
- Indicador a revisar al final de la semana
- Resultado esperado (1 línea)

Orientación general por semana:
- Semana 1: Ordenar información, validar costos, confirmar punto de equilibrio real
- Semana 2: Mejorar margen o revisar precio; comparar con competidores
- Semana 3: Controlar costos fijos, identificar gastos prescindibles, revisar equilibrio
- Semana 4: Seguimiento de resultados, ajustar metas, decidir próximos pasos

Las acciones deben ser específicas al negocio del cliente. No usar acciones genéricas como "busca clientes nuevos". Usar datos del mensaje para contextualizar.

Agregar page-break-before a esta sección.

---

### SECCIÓN 8 — META MÍNIMA SEMANAL

Título de sección: "Meta mínima semanal"

Card con borde acento (#1d4ed8):
- Calcular meta semanal: punto_de_equilibrio_mensual ÷ 4,3 (redondear hacia arriba)
- Calcular meta diaria aproximada: meta_semanal ÷ 5 (días hábiles, redondear hacia arriba)
- Explicar en 2–3 líneas cómo usar esta cifra en la operación diaria

Tabla simple con 3 filas:
| Período     | Meta mínima          | Nota                         |
|-------------|----------------------|------------------------------|
| Semanal     | X unidades           | Para no operar en pérdida    |
| Diaria      | X unidades           | En 5 días hábiles            |
| Alerta      | Si no se cumple...   | Acción sugerida              |

Nota al pie de la sección: "Este es el piso mínimo, no la meta ideal. Para crecer, el objetivo debe estar al menos un 20–30% por encima del punto de equilibrio."

---

### SECCIÓN 9 — CHECKLIST OPERATIVO SEMANAL

Título de sección: "Checklist operativo semanal"

Instrucción al inicio: "Revisa estos ítems cada semana para mantener el control de tu negocio."

Lista de 10–12 ítems con casillas visuales (cuadrado SVG o CSS puro, sin imagen). Estilo lista de verificación. Cada ítem en una línea clara.

Categorías sugeridas (adaptar al tipo de negocio si es posible):
- Ventas: ¿Alcancé la meta semanal mínima?
- Caja: ¿Registré todos los ingresos y gastos?
- Costos fijos: ¿Revisé si hay algún costo que pueda reducir o diferir?
- Costo variable: ¿El costo por unidad sigue siendo el mismo que calculé?
- Precio: ¿Mi precio sigue siendo competitivo y cubre el costo variable con margen?
- Inventario: ¿Tengo suficiente stock para la próxima semana sin exceso?
- Clientes: ¿Hablé con al menos un cliente sobre su experiencia?
- Punto de equilibrio: ¿Ya superé el punto de equilibrio esta semana?
- Gastos imprevistos: ¿Tuve gastos que no estaban en el plan?
- Meta del mes: ¿Voy en línea con la meta mensual?
- Decisión: ¿Hay algo que deba cambiar la próxima semana?

Agregar page-break-before a esta sección.

---

### SECCIÓN 10 — RECOMENDACIONES POR NIVEL DE RIESGO

Título de sección: "Recomendaciones según el diagnóstico"

Según el nivel de riesgo del cliente (identificar del mensaje), mostrar UN solo bloque principal:

SI EL RIESGO ES BAJO:
Card verde. Título: "Negocio con fundamentos sólidos — enfócate en crecer". 
Contenido: 4–5 recomendaciones para consolidar y escalar de forma controlada. 
Énfasis en: documentar procesos, evaluar aumento de precio, diversificar ingresos, proyectar crecimiento.

SI EL RIESGO ES MEDIO:
Card ámbar. Título: "Negocio en zona de precaución — protege el margen".
Contenido: 4–5 recomendaciones para estabilizar antes de crecer.
Énfasis en: reducir costos fijos, revisar precio frente a competencia, medir ventas semanalmente, plan de contingencia.

SI EL RIESGO ES ALTO:
Card naranja. Título: "Negocio con señales de alerta — actúa en los próximos 30 días".
Contenido: 4–5 recomendaciones urgentes.
Énfasis en: reducir costos no esenciales de forma inmediata, revisar si el modelo es sostenible, considerar asesoría, no ampliar inversión.

SI EL NIVEL ES NO VIABLE:
Card roja. Título: "Situación crítica — revisar el modelo antes de continuar".
Contenido: 4–5 recomendaciones de supervivencia.
Énfasis en: detener el crecimiento de ventas, revisar urgentemente precio vs. costo variable, buscar asesoría antes de invertir más capital.

Después del bloque principal, agregar una nota small en gris: "Estas recomendaciones son orientativas. Para decisiones de capital, crédito o expansión, consulta con un contador o asesor financiero de confianza."

---

### SECCIÓN 11 — ESCENARIO DE DECISIÓN

Título de sección: "¿Qué hago si...?"

3 cards lado a lado (o apiladas en móvil/impresión):

Card 1 — "Si las ventas bajan":
- Qué impacto tiene en utilidad y punto de equilibrio con estos números
- Qué acciones tomar de forma inmediata
- Cuál es el piso mínimo de ventas antes de entrar en pérdida

Card 2 — "Si los costos suben":
- Qué pasa con el margen si el costo variable sube un 10–15%
- Opciones: subir precio, reducir costos en otro lado, absorber el aumento
- Cuándo es urgente actuar

Card 3 — "Si quiero crecer":
- Cuánto más necesito vender para justificar un aumento de costos fijos
- Condición mínima antes de escalar
- Señal clara de que el negocio está listo para crecer

Cada card debe usar datos reales del mensaje, no ejemplos genéricos.

Agregar page-break-before a esta sección.

---

### SECCIÓN 12 — CIERRE EJECUTIVO

Título de sección: "Conclusión y próximos pasos"

Incluir:
- Lista de las 3 prioridades más importantes para este negocio específico (numeradas, en negrita)
- Próximo paso recomendado: una sola acción concreta para los próximos 7 días
- Párrafo de cierre: 3–4 líneas, tono profesional y empático, sin exageraciones ni promesas

Card de cierre con fondo #f8f9fa, borde #e2e8f0.

---

### SECCIÓN 13 — ADVERTENCIA RESPONSABLE

Pie de documento. Fondo #f1f5f9, texto #64748b, 11px, sin page-break.

Texto:
"Este reporte es una herramienta educativa de apoyo a la toma de decisiones financieras básicas para micronegocios. No constituye asesoría financiera, contable, legal ni tributaria formal. Los cálculos y recomendaciones están basados en los datos proporcionados por el usuario y pueden contener simplificaciones. Antes de tomar decisiones importantes sobre inversión, crédito, expansión o cierre del negocio, consulta con un contador público, asesor financiero certificado o profesional idóneo. Los resultados no garantizan rentabilidad ni éxito comercial."

Separador fino (#e2e8f0), luego:
"Generado con Negocio Claro · Herramienta educativa de apoyo financiero · Versión piloto"

---

REGLAS DE ANÁLISIS (no negociables):

1. No inventar datos que no estén en el mensaje del cliente. Si falta un dato, escribir "Dato no disponible".
2. No hacer cálculos que requieran datos ausentes. Si no hay inversión inicial, el ROI y el tiempo de recuperación son "No disponible".
3. Sí puedes hacer interpretaciones razonables a partir de los datos: explicar qué significa un margen del 53%, qué implica un punto de equilibrio alto, qué riesgo tiene un ROI bajo.
4. Sí puedes calcular: margen de contribución por unidad (precio − costo variable), punto de equilibrio en ingresos (unidades × precio), meta semanal (punto de equilibrio ÷ 4,3).
5. Todos los valores monetarios deben usar la moneda del cliente (COP, USD o EUR según lo que aparezca en el mensaje).
6. El reporte debe sonar específico para este negocio, no genérico. Menciona el nombre del negocio en varios puntos del documento.
7. Mantén claridad para alguien sin formación financiera. Explica los términos la primera vez que aparecen.
8. Evita jerga: no uses "EBITDA", "WACC", "leverage", ni términos que el dueño de un micronegocio no conozca.
9. No uses frases como "garantizado", "seguro ganarás", "nunca perderás", "éxito asegurado".
10. El tono debe ser: profesional, directo, empático, honesto.

---

VERIFICACIÓN FINAL ANTES DE ENTREGAR:

Antes de generar el HTML, verifica internamente que:
- Incluiste los 13 bloques en el orden indicado
- Usaste únicamente los datos del mensaje (sin inventar)
- El HTML no tiene dependencias externas
- No hay JavaScript en el documento
- Hay reglas @media print
- Hay page-break-inside: avoid en cards y tablas
- La portada tiene page-break-after
- El documento se ve completo, no cortado

Genera ÚNICAMENTE el HTML. No incluyas explicaciones fuera del HTML. El documento debe comenzar con <!DOCTYPE html> y terminar con </html>.
```

---

## Notas adicionales

**Longitud esperada del reporte:** Entre 8 y 14 páginas A4 impreso, dependiendo del nivel de detalle de los datos del cliente.

**Herramientas compatibles:** Claude Opus, Claude Sonnet, ChatGPT-4o o superior. Modelos más capaces producen mejores diagnósticos y análisis. No usar modelos básicos para este prompt.

**Cómo convertir a PDF:**
1. Guardar el HTML generado como `reporte-[nombre-negocio]-[fecha].html`
2. Abrir en Google Chrome
3. `Ctrl + P` (o `Cmd + P` en Mac)
4. Destino: "Guardar como PDF"
5. Tamaño: A4
6. Márgenes: Mínimos o Ninguno (el HTML ya controla los márgenes)
7. Activar "Gráficos de fondo" para que los fondos de color se impriman
8. Guardar

**Nombre de archivo sugerido para el PDF:**
`Reporte-Ejecutivo-[Nombre-Negocio]-[AAAA-MM-DD].pdf`
