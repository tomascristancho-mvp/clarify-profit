# Negocio Claro

Calculadora educativa de rentabilidad para emprendedores y micronegocios. Ingresa costos, precio y ventas estimadas y obtén al instante: utilidad mensual, punto de equilibrio, nivel de riesgo, ROI, tiempo de recuperación y proyección de escenarios — en lenguaje claro, sin contabilidad.

**Producción:** https://clarify-profit.vercel.app

Un producto de **AI Health Colombia**.

## Características

- **Calculadora completa** — utilidad operativa, margen de contribución, punto de equilibrio (unidades e ingresos), ROI mensual y tiempo de recuperación
- **Diagnóstico ejecutivo** — nivel de riesgo (bajo / moderado / alto / no viable) con lectura interpretativa basada en reglas explícitas
- **Escenarios** — pesimista (70%), esperado (100%) y optimista (130%) con gráfica comparativa
- **Simulador "¿qué pasa si…?"** — mejor palanca y mayor riesgo del negocio
- **Calculadora inversa** — cuánto vender para alcanzar una meta de utilidad
- **Reporte ejecutivo premium** (piloto) — vista previa parcial en pantalla; solicitud por WhatsApp con resumen financiero prellenado
- **Modo claro/oscuro** — con detección de preferencia del sistema y persistencia
- **100% client-side** — sin backend, sin registro, sin almacenamiento de datos
- **PWA instalable**, SEO técnico completo (Open Graph, JSON-LD, sitemap) y accesibilidad WCAG 2.2 AA

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript estricto
- Tailwind CSS 4 (configuración CSS-first en `src/app/globals.css`)
- Vitest + Testing Library

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:3000
```

### Verificaciones

```bash
npx tsc --noEmit   # tipos
npm run lint       # ESLint
npm run test       # suite de pruebas (Vitest)
npm run build      # build de producción
```

## Arquitectura

```
src/
├── app/          # rutas, metadatos, SEO (App Router)
├── config/       # monedas, escenarios, límites, ejemplo
├── domain/       # lógica financiera pura — sin React, 100% testeable
├── validation/   # validación manual por campo
├── format/       # formato de moneda y porcentaje (Intl.NumberFormat)
├── hooks/        # useCalculatorState: orquesta validación → cálculo
├── components/   # presentación — nunca recalcula lógica financiera
└── test/         # suite de pruebas espejo de la estructura
```

Principio clave: `domain/`, `validation/` y `format/` no importan React. Los indicadores usan el tipo discriminado `IndicatorResult<T>` (`valido` / `no_aplica` / `no_alcanzable`), lo que hace imposible por construcción mostrar `NaN` o `Infinity` en la interfaz.

## Documentación adicional

- [`docs/reporte-ejecutivo-prompt.md`](docs/reporte-ejecutivo-prompt.md) — prompt maestro para generar el reporte ejecutivo premium con IA a partir del mensaje de WhatsApp del cliente

## Aviso

Negocio Claro es una herramienta educativa de apoyo a la toma de decisiones. Los resultados son estimaciones basadas en los datos ingresados y no constituyen asesoría financiera, contable ni tributaria formal.
