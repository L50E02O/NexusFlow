# Menú de Accesibilidad — AccessShop
**Documento de referencia:** F1-3-UA-2026 revisión 1 | Ing. Wilian Delgado Muentes  
**Objetivo:** Nivel A + AA (55 criterios)  
**Leyenda:** (1) Todos los formularios · (2) En ciertos formularios

> Ejemplos de referencia: [Ayuntamiento Soto del Real](https://www.ay-sotodelreal.es/) · [Gobierno de México](https://www.gob.mx/)

## Categoría: Texto

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 1.4.4 | Cambio de tamaño del texto al 200% sin pérdida de contenido | AA | Unidades relativas (rem/em); evitar px fijos | 1 |
| 1.4.12 | Espaciado del texto: soporta más espaciado sin pérdida | AA | No fijar alturas; permitir line-height/letter-spacing | 1 |
| 1.4.5 | Texto real en vez de imágenes de texto | AA | Usar CSS/fuentes web; reservar imágenes para logos | 1 |

## Categoría: Color y Contraste

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 1.4.1 | El color no es el único indicador visual | A | Añadir texto, icono o subrayado además del color | 1 |
| 1.4.3 | Contraste de texto mínimo 4.5:1 (3:1 texto grande) | AA | Verificar paleta con herramienta de contraste | 1 |
| 1.4.11 | Contraste no textual ≥ 3:1 en controles/iconos/gráficos | AA | Revisar bordes de inputs, botones, focos, gráficas | 1 |

## Categoría: Orientación y Diseño

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 1.3.4 | No bloquear la orientación de pantalla | AA | No forzar orientation salvo que sea esencial | 1 |
| 1.4.10 | Reflow a 1 columna al 400% (~320 px) | AA | Diseño responsive; sin scroll horizontal | 1 |
| 2.5.8 | Área de interacción mínima 24×24 px | AA | Tamaño/espaciado mínimo en botones e iconos | 1 |

## Categoría: Navegación y Foco

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 2.4.1 | Evitar bloques repetidos (skip navigation) | A | Enlace "saltar al contenido" + landmarks | 1 |
| 2.4.3 | Orden de foco lógico | A | Orden de tabulación coherente con la lectura | 1 |
| 2.4.7 | Foco visible | AA | Estilo `:focus/:focus-visible` claro; no quitar outline | 1 |
| 2.4.11 | Foco no oculto por elementos fijos (sticky) | AA | Que cabeceras/footers sticky no tapen el foco | 1 |
| 2.4.5 | Múltiples vías de navegación | AA | Menú + buscador y/o mapa del sitio | 1 |

## Categoría: Multimedia y Audio

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 1.2.1 | Transcripción para audio o vídeo sin sonido | A | Texto equivalente junto al medio | 2 |
| 1.2.2 | Subtítulos sincronizados en vídeo pregrabado | A | Pista de subtítulos (`<track kind="captions">`) | 2 |
| 1.2.4 | Subtítulos en transmisiones en directo | AA | Subtitulado en vivo | 2 |
| 1.2.5 | Audiodescripción en vídeo pregrabado | AA | Pista de audiodescripción | 2 |
| 1.4.2 | Control del audio automático >3 s | A | Botón de pausa/silencio; evitar autoplay con sonido | 2 |
| 2.2.2 | Pausar/detener/ocultar contenido en movimiento | A | Controles para carruseles, animaciones, autoupdate | 2 |

## Categoría: Interacción y Gestos

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 2.1.1 | Todo operable con teclado | A | Tab/Enter/Espacio/flechas en todos los controles | 1 |
| 2.1.2 | Sin trampas de foco (modales, widgets) | A | El foco siempre puede salir | 1 |
| 2.5.1 | Alternativa a gestos multipunto/trazado | A | Acción equivalente con un solo punto | 2 |
| 2.5.2 | Cancelación del puntero | A | Activar en "soltar" (up); permitir abortar | 1 |
| 2.5.7 | Alternativa al arrastre | AA | Acción equivalente con un solo clic/toque | 2 |

## Categoría: Formularios y Errores

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 3.3.1 | Errores identificados y descritos en texto | A | Mensaje en texto + ARIA, no solo color | 1 |
| 3.3.2 | Etiquetas o instrucciones en los campos | A | `<label for>` asociado; instrucciones claras | 1 |
| 3.3.3 | Sugerencias ante errores | AA | Indicar cómo corregir el dato erróneo | 1 |
| 3.3.7 | Sin pedir datos ya introducidos | A | Reutilizar/autocompletar datos del mismo proceso | 1 |
| 3.3.8 | Autenticación accesible | AA | Permitir pegar/gestor de contraseñas | 1 |
| 4.1.3 | Mensajes de estado anunciados sin mover el foco | AA | `role="status"/alert` o live regions | 1 |

## Categoría: Estructura y Semántica

| Código | Descripción del criterio | Nivel | Cómo implementarlo | Se aplica en |
|--------|--------------------------|-------|--------------------|--------------|
| 1.1.1 | Toda imagen/icono tiene alternativa textual | A | `alt` descriptivo; `aria-label` en controles sin texto | 1 |
| 1.3.1 | Estructura semántica real | A | `<h1>`–`<h6>`, listas, `<table>` con `<th>`, landmarks | 1 |
| 1.3.2 | Orden de lectura del DOM = orden visual | A | Maquetar en orden lógico; cuidar `order` de CSS/flex | 1 |
| 2.4.2 | Título de página descriptivo y único | A | `<title>` por página | 1 |
| 2.4.6 | Encabezados y etiquetas descriptivos | AA | Títulos y labels que describan su contenido | 1 |
| 3.1.1 | Idioma de la página declarado | A | `lang` en `<html>` | 1 |
| 4.1.2 | Nombre, función y valor expuestos por software | A | HTML nativo o ARIA (`role`, `aria-*`) en cada control | 1 |
