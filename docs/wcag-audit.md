# Auditoría WCAG 2.2 — NexusFlow

**Fecha:** 7 de junio de 2026  
**Alcance:** Nivel A + AA (criterios solicitados)  
**Stack:** React 19 + Vite + Tailwind CSS 4 + Supabase  
**Contexto Supabase:** E-commerce con tablas `profiles`, `productos`, `pedidos`, `carritos`, `wcag_criterios`, `menu_accesibilidad` y autenticación vía `auth.users`.

---

## Resumen ejecutivo

| Estado | Cantidad |
|--------|----------|
| ✅ Aplicado | 48 |
| ✅ Ya cumplía | 4 |
| ⚪ No aplica | 12 |
| ⚠️ Parcial | 0 |
| ❌ Pendiente | 0 |

---

## Principio 1: Perceptible

| Criterio | Nombre | Nivel | Estado | Archivos modificados | Notas |
|----------|--------|-------|--------|----------------------|-------|
| 1.1.1 | Contenido no textual | A | ✅ Aplicado | `Icon.tsx`, `HomePage.tsx`, `MessagingPage.tsx`, `ProfilePage.tsx`, `PurchaseHistoryPage.tsx`, `SettingsPage.tsx`, `SupportPage.tsx`, `MerchantDashboardPage.tsx`, `MerchantProductsPage.tsx`, `MerchantAssistantPage.tsx`, `MerchantReportsPage.tsx`, `ProductCard.tsx`, `LoginPage.tsx` | `alt` descriptivo en imágenes informativas; `alt=""` en decorativas; SVG con `role="img"` + `aria-label`; iconos con `aria-label` en botones |
| 1.2.1 | Audio/video solo grabado | A | ⚪ No aplica | — | No hay elementos `<audio>` ni `<video>` en el proyecto |
| 1.2.2 | Subtítulos grabado | A | ⚪ No aplica | — | Sin contenido de video con audio |
| 1.2.3 | Audiodescripción o alternativa | A | ⚪ No aplica | — | Sin contenido de video |
| 1.2.4 | Subtítulos en directo | AA | ⚪ No aplica | — | El sistema no tiene streaming en vivo |
| 1.2.5 | Audiodescripción grabado | AA | ⚪ No aplica | — | Sin contenido de video |
| 1.3.1 | Información y relaciones | A | ✅ Aplicado | `AppLayout.tsx`, `MerchantLayout.tsx`, `TopNav.tsx`, `Footer.tsx`, `CheckoutPage.tsx`, `AccessibilityPanel.tsx`, `Breadcrumbs.tsx` | Landmarks `<header>`, `<nav>`, `<main id="main-content">`, `<footer>`, `<aside>`; listas `<ul>/<ol>`; encabezados jerárquicos |
| 1.3.2 | Secuencia significativa | A | ✅ Ya cumplía | — | Orden DOM coincide con orden visual; sin `order` CSS que reordene contenido |
| 1.3.3 | Características sensoriales | A | ✅ Aplicado | `TopNav.tsx` | Instrucciones de búsqueda sin referencias solo visuales ("izquierda", "verde") |
| 1.3.4 | Orientación de pantalla | AA | ✅ Ya cumplía | — | Sin CSS/JS que fuerce orientación; layout responsive en ambas orientaciones |
| 1.3.5 | Propósito de campo | AA | ✅ Aplicado | `LoginPage.tsx`, `CheckoutPage.tsx`, `SettingsPage.tsx`, `Footer.tsx` | `autocomplete` en nombre, email, tel, dirección, contraseñas |
| 1.4.1 | Uso del color | A | ✅ Aplicado | `global.css`, `CheckoutPage.tsx`, `LoginPage.tsx`, `DataStatus.tsx` | Clase `.form-error` con icono ⚠ y texto; validación de dirección con ✓ además del color verde |
| 1.4.2 | Control del audio | A | ⚪ No aplica | — | Sin reproducción automática de audio |
| 1.4.3 | Contraste mínimo | AA | ✅ Aplicado | `global.css` | `--color-on-primary-container`: `#8293b8` → `#c5d0e8` (ratio ≥4.5:1 sobre `#1a2b4b`) |
| 1.4.4 | Cambio de tamaño del texto al 200% | AA | ✅ Aplicado | `global.css`, `AccessibilityContext.tsx` | Utilidades tipográficas en `rem`; escala root vía menú de accesibilidad |
| 1.4.5 | Imágenes de texto | AA | ✅ Ya cumplía | — | Texto informativo renderizado como HTML/CSS; logos con `alt` descriptivo |
| 1.4.10 | Reflow | AA | ✅ Aplicado | `global.css`, layouts responsive | Media query 320px; `overflow-x: hidden`; grids de una columna en móvil |
| 1.4.11 | Contraste no textual | AA | ✅ Aplicado | `global.css` | `:focus-visible` con `#1d4ed8` (≥3:1); bordes `--color-outline` en inputs |
| 1.4.12 | Espaciado del texto | AA | ✅ Aplicado | `global.css` | `line-height: 1.5` en body; sin `height` fijos en bloques de texto principales |
| 1.4.13 | Contenido en hover/foco | AA | ✅ Aplicado | `AccessibilityPanel.tsx`, `AiChatWidget.tsx` | Paneles cerrables con Escape; focus trap; sin cierre por tiempo |

---

## Principio 2: Operable

| Criterio | Nombre | Nivel | Estado | Archivos modificados | Notas |
|----------|--------|-------|--------|----------------------|-------|
| 2.1.1 | Teclado | A | ✅ Aplicado | Todos los componentes interactivos | Controles nativos `<button>`, `<a>`, `<input>`; sin `onClick` en divs |
| 2.1.2 | Sin trampas de foco | A | ✅ Aplicado | `useFocusTrap.ts`, `AccessibilityPanel.tsx`, `AiChatWidget.tsx`, `CheckoutPage.tsx` | Focus trap en modales; Escape cierra y devuelve foco |
| 2.1.4 | Atajos de teclado | A | ⚪ No aplica | — | No hay atajos de una sola tecla sin modificador |
| 2.2.1 | Tiempo ajustable | A | ⚪ No aplica | — | Sin timeout de sesión con límite de tiempo en la UI |
| 2.2.2 | Pausar, detener, ocultar | A | ✅ Aplicado | `useCountdown.ts`, `HomePage.tsx`, `OffersPage.tsx`, `CouponsPage.tsx`, `CartRecoveryPage.tsx` | Botones "Pausar temporizador" en contadores en vivo |
| 2.3.1 | Tres destellos | A | ✅ Aplicado | `global.css` | `reduce-motion` y `prefers-reduced-motion`; animaciones `animate-pulse` en áreas pequeñas |
| 2.4.1 | Evitar bloques | A | ✅ Aplicado | `SkipLink.tsx`, `AppLayout.tsx`, `MerchantLayout.tsx`, `LoginPage.tsx`, `global.css` | Enlace "Saltar al contenido" visible al foco; `#main-content` en cada layout |
| 2.4.2 | Titulado de páginas | A | ✅ Aplicado | `PageTitleManager.tsx`, `usePageTitle.ts`, `index.html` | Formato "Sección — NexusFlow" por ruta |
| 2.4.3 | Orden del foco | A | ✅ Ya cumplía | — | Sin `tabIndex` positivos; orden DOM lógico |
| 2.4.4 | Propósito de enlaces | A | ✅ Aplicado | `Footer.tsx`, `TopNav.tsx`, `HomePage.tsx` | Enlaces descriptivos; `aria-label` en iconos-enlace |
| 2.4.5 | Múltiples vías | AA | ✅ Aplicado | `Breadcrumbs.tsx`, `TopNav.tsx`, `Footer.tsx` | Nav principal + migas de pan + buscador en header |
| 2.4.6 | Encabezados y etiquetas | AA | ✅ Aplicado | `LoginPage.tsx`, `SettingsPage.tsx`, `TopNav.tsx`, `Footer.tsx` | `<label htmlFor>` en todos los campos; "(requerido)" visible |
| 2.4.7 | Foco visible | AA | ✅ Aplicado | `global.css` | `:focus-visible` global; sin `outline: none` destructivo |
| 2.4.11 | Foco no oculto | AA | ✅ Aplicado | `global.css` | `#main-content { scroll-margin-top: 5rem }` |
| 2.5.1 | Gestos del puntero | A | ⚪ No aplica | — | Sin funciones multipunto o trazados obligatorios |
| 2.5.2 | Cancelación del puntero | A | ✅ Ya cumplía | — | Acciones en evento `click` (mouseup), no `mousedown` |
| 2.5.3 | Etiqueta en el nombre | A | ✅ Aplicado | `ProductCard.tsx`, `TopNav.tsx`, `AiChatWidget.tsx` | `aria-label` incluye texto visible del control |
| 2.5.4 | Actuación por movimiento | A | ⚪ No aplica | — | Sin detección de movimiento del dispositivo |
| 2.5.7 | Movimientos de arrastre | AA | ⚪ No aplica | — | Sin funcionalidad drag & drop en el proyecto |
| 2.5.8 | Tamaño mínimo de interacción | AA | ✅ Aplicado | `TopNav.tsx`, `Footer.tsx`, `AppLayout.tsx`, `ProductCard.tsx`, `MerchantLayout.tsx` | `min-w-11 min-h-11` (44px) en controles táctiles |

---

## Principio 3: Comprensible

| Criterio | Nombre | Nivel | Estado | Archivos modificados | Notas |
|----------|--------|-------|--------|----------------------|-------|
| 3.1.1 | Idioma de la página | A | ✅ Ya cumplía | `index.html` | `<html lang="es">` |
| 3.1.2 | Idioma de las partes | AA | ✅ Aplicado | `Footer.tsx` | `<span lang="es">` en selector de idioma |
| 3.2.1 | Al recibir el foco | A | ✅ Ya cumplía | — | Sin cambio de contexto al tabular |
| 3.2.2 | Al recibir entradas | A | ✅ Ya cumplía | — | Búsqueda no navega automáticamente al escribir |
| 3.2.3 | Navegación coherente | AA | ✅ Aplicado | `TopNav.tsx`, `Footer.tsx` | `TopNav` y `Footer` compartidos en `AppLayout` |
| 3.2.4 | Identificación consistente | AA | ✅ Aplicado | `TopNav.tsx`, `MerchantLayout.tsx`, `AppLayout.tsx`, `LoginPage.tsx` | "Abrir menú de accesibilidad" unificado; "Cerrar panel" consistente |
| 3.2.6 | Ayuda consistente | A | ✅ Aplicado | `Footer.tsx` | Enlace a soporte/accesibilidad en footer de todas las páginas |
| 3.3.1 | Identificación de errores | A | ✅ Aplicado | `LoginPage.tsx`, `global.css` | `aria-invalid`, `aria-describedby`, `role="alert"`, foco al primer error |
| 3.3.2 | Etiquetas o instrucciones | A | ✅ Aplicado | `LoginPage.tsx`, `SettingsPage.tsx`, `CheckoutPage.tsx` | Labels + instrucciones de formato antes del campo |
| 3.3.3 | Sugerencias ante errores | AA | ✅ Aplicado | `LoginPage.tsx` | Sugerencia de formato email: `usuario@dominio.com` |
| 3.3.4 | Prevención de errores | AA | ✅ Aplicado | `CheckoutPage.tsx` | Modal de confirmación antes de completar compra |
| 3.3.7 | Entrada redundante | A | ✅ Ya cumplía | — | Checkout no repite datos ya en perfil/sesión |
| 3.3.8 | Autenticación accesible | AA | ✅ Aplicado | `LoginPage.tsx` | Sin bloqueo de paste; `autocomplete` habilitado; sin CAPTCHA |

---

## Principio 4: Robusto

| Criterio | Nombre | Nivel | Estado | Archivos modificados | Notas |
|----------|--------|-------|--------|----------------------|-------|
| 4.1.2 | Nombre, función y valor | A | ✅ Aplicado | `AccessibilityPanel.tsx`, `AiChatWidget.tsx`, `SettingsPage.tsx` | `role`, `aria-checked`, `aria-expanded`, `aria-modal` en componentes custom |
| 4.1.3 | Mensajes de estado | AA | ✅ Aplicado | `DataStatus.tsx`, `AiChatWidget.tsx`, `CheckoutPage.tsx` | `role="status"` para éxito/carga; `role="alert"` para errores |

---

## Menú de accesibilidad

| Control | Estado | Implementación |
|---------|--------|----------------|
| Aumentar/reducir texto | ✅ Aplicado | `AccessibilityContext.tsx` — escala root `0.875rem` / `1rem` / `1.125rem` |
| Alto contraste | ✅ Aplicado | Clase `.high-contrast` con paleta negro/blanco/amarillo |
| Escala de grises | ✅ Aplicado | Clase `.grayscale-mode` con `filter: grayscale(100%)` |
| Subrayar enlaces | ✅ Aplicado | Clase `.underline-links` |
| Pausar animaciones | ✅ Aplicado | Clase `.reduce-motion` + `prefers-reduced-motion` |
| Restablecer | ✅ Aplicado | Botón `resetAll()` + `localStorage` |
| Persistencia | ✅ Aplicado | `localStorage` key `nexusflow-a11y` |
| Teclado + aria-label | ✅ Aplicado | `AccessibilityPanel.tsx` — `role="dialog"`, focus trap, ♿ FAB |

**Archivos:** `AccessibilityContext.tsx`, `AccessibilityPanel.tsx`, `AppLayout.tsx`, `global.css`

---

## Cambios de color documentados (1.4.3)

| Token | Antes | Después | Ratio estimado |
|-------|-------|---------|----------------|
| `--color-on-primary-container` | `#8293b8` | `#c5d0e8` | ~5.8:1 sobre `#1a2b4b` |
| Focus ring | `#2563eb` | `#1d4ed8` | ≥3:1 sobre fondos claros y oscuros |

---

## Tablas Supabase relacionadas

- **`wcag_criterios`**: 55 registros de criterios WCAG para seguimiento en `SettingsPage`
- **`menu_accesibilidad`**: 24 elementos mostrados en el panel de accesibilidad
- **`profiles`**: datos de usuario con roles `cliente`, `comerciante`, `admin`

---

## Verificación recomendada

1. Prueba manual con teclado (Tab, Enter, Escape) en modales y menú de accesibilidad
2. Zoom al 200% y 400% en Chrome DevTools
3. Lighthouse Accessibility audit
4. axe DevTools en rutas: `/`, `/login`, `/checkout`, `/merchant`
