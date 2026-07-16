# Formularios de Accesibilidad — AccessShop
**Documento de referencia:** F1-3-UA-2026 revisión 1 | Ing. Wilian Delgado Muentes  
**Objetivo:** Nivel A + AA (55 criterios)  
**Leyenda:** (1) Todos los formularios · (2) En ciertos formularios

## Principio 1 — Perceptible

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 1.1.1 | Contenido no textual: toda imagen/icono tiene alt descriptivo | A | `alt` descriptivo; `alt=""` si decorativa; `aria-label` en controles sin texto | 1 |
| 1.3.1 | Información y relaciones: estructura semántica real | A | `<h1>`–`<h6>`, listas, `<table>` con `<th>`, landmarks | 1 |
| 1.3.2 | Secuencia significativa: orden de lectura del DOM = orden visual | A | Maquetar en orden lógico; cuidar `order` de CSS/flex | 1 |
| 1.3.3 | Características sensoriales: no dar instrucciones solo por color/posición | A | Añadir texto/etiqueta junto a señal visual | 1 |
| 1.3.5 | Identificación del propósito de campo | AA | `autocomplete` en datos personales | 1 |
| 1.4.1 | Uso del color: no es el único indicador | A | Añadir texto, icono o subrayado además del color | 1 |
| 1.4.3 | Contraste mínimo (4.5:1) | AA | Verificar paleta con herramienta de contraste | 1 |
| 1.4.4 | Cambio de tamaño del texto al 200% | AA | Unidades relativas (rem/em); evitar px fijos | 1 |
| 1.4.10 | Reajuste de elementos (reflow) al 400% | AA | Diseño responsive; sin scroll horizontal | 1 |
| 1.4.11 | Contraste no textual ≥ 3:1 en controles | AA | Revisar bordes de inputs, botones, focos | 1 |
| 1.4.12 | Espaciado del texto: el diseño soporta más espaciado | AA | No fijar alturas; permitir line-height/letter-spacing | 1 |
| 1.4.13 | Contenido al pasar el cursor o foco | AA | Tooltips descartables, persistentes y accesibles | 2 |

## Principio 2 — Operable

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 2.1.1 | Teclado: todo operable con teclado | A | Tab/Enter/Espacio/flechas en todos los controles | 1 |
| 2.1.2 | Sin trampas para el foco del teclado | A | El foco siempre puede salir (modales, widgets) | 1 |
| 2.1.4 | Atajos de una sola tecla desactivables | A | Permitir desactivar/reasignar o requerir modificador | 2 |
| 2.2.1 | Tiempo ajustable | A | Permitir ampliar, posponer o desactivar el tiempo | 2 |
| 2.2.2 | Pausar/detener/ocultar contenido en movimiento | A | Controles para carruseles, animaciones | 2 |
| 2.4.3 | Orden del foco lógico | A | Orden de tabulación coherente con la lectura | 1 |
| 2.4.4 | Propósito de los enlaces claro en contexto | A | Evitar "clic aquí"; texto significativo | 1 |
| 2.4.6 | Encabezados y etiquetas descriptivos | AA | Títulos y labels que describan su contenido | 1 |
| 2.4.7 | Foco visible | AA | Estilo `:focus/:focus-visible` claro; no quitar outline | 1 |
| 2.4.11 | Foco no oculto por elementos fijos | AA | Que headers/footers sticky no tapen el foco | 1 |
| 2.5.1 | Alternativa a gestos multipunto | A | Acción equivalente con un solo punto | 2 |
| 2.5.2 | Cancelación del puntero | A | Activar en "soltar" (up); permitir abortar | 1 |
| 2.5.3 | Etiqueta visible incluida en el nombre accesible | A | El texto visible coincide con el accessible name | 1 |
| 2.5.7 | Alternativa al arrastre | AA | Acción equivalente con un solo clic/toque | 2 |
| 2.5.8 | Área de interacción mínima 24×24 px | AA | Tamaño/espaciado mínimo en botones e iconos | 1 |

## Principio 3 — Comprensible

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 3.1.1 | Idioma de la página declarado | A | `lang` en `<html>` | 1 |
| 3.1.2 | Idioma de fragmentos en otro idioma | AA | `lang` en el elemento del pasaje | 2 |
| 3.2.1 | Recibir el foco no cambia el contexto | A | No abrir ventanas ni navegar solo al enfocar | 1 |
| 3.2.2 | Escribir no cambia el contexto automáticamente | A | No enviar/navegar al rellenar un campo | 1 |
| 3.2.6 | Ayuda en ubicación consistente | A | Soporte/contacto en el mismo lugar entre páginas | 1 |
| 3.3.1 | Errores identificados y descritos | A | Mensaje en texto + ARIA, no solo color | 1 |
| 3.3.2 | Etiquetas o instrucciones en los campos | A | `<label for>` asociado; instrucciones claras | 1 |
| 3.3.3 | Sugerencias ante errores | AA | Indicar cómo corregir el dato erróneo | 1 |
| 3.3.4 | Prevención de errores en envíos críticos | AA | Revisar, confirmar o deshacer (legal/financiero) | 2 |
| 3.3.7 | Sin pedir datos ya introducidos | A | Reutilizar/autocompletar datos del mismo proceso | 1 |
| 3.3.8 | Autenticación accesible | AA | Permitir pegar/gestor de contraseñas; sin pruebas de memoria | 1 |

## Principio 4 — Robusto

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 4.1.2 | Nombre, función y valor expuestos por software | A | HTML nativo o ARIA (`role`, `aria-*`) en cada control | 1 |
| 4.1.3 | Mensajes de estado anunciados | AA | `role="status"/alert` o live regions, sin mover el foco | 1 |
