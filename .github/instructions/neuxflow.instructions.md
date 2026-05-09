---
applyTo: "**/*"
---

# Instrucciones del proyecto NeuxFlow

## Contexto
- Proyecto de comercio electrónico llamado NeuxFlow.
- La entrega se orienta a la materia de usabilidad y accesibilidad.
- La referencia principal es WCAG 2.2.
- Deben considerarse siempre las 10 heurísticas de Nielsen como criterio de revisión.

## Reglas de implementación
- Priorizar HTML semántico, estructura clara y componentes pequeños.
- Mantener la arquitectura por capas: app, pages, widgets, features, entities y shared.
- Evitar acoplar la lógica de negocio a la UI.
- Reutilizar componentes compartidos cuando corresponda.
- Preferir nombres descriptivos y consistentes en español o inglés, pero no mezclar estilos sin criterio.

## Reglas de accesibilidad
- Todo control interactivo debe ser operable con teclado.
- Todo input debe tener etiqueta accesible o un nombre equivalente claro.
- Los errores deben explicarse con mensajes concretos y accionables.
- No usar el color como único canal de comunicación.
- Mantener contraste suficiente entre texto, fondo y estados de interacción.
- Asegurar foco visible y orden lógico de tabulación.
- Usar ARIA solo cuando el HTML semántico no sea suficiente.

## Reglas de experiencia de usuario
- Mostrar siempre el estado del sistema de forma clara.
- Mantener consistencia visual y funcional entre pantallas.
- Prevenir errores antes de depender de correcciones posteriores.
- Reducir la carga de memoria del usuario con información visible y etiquetas claras.
- La interfaz debe ser simple, predecible y orientada a la tarea.

## Revisión antes de entregar
- Verificar que la interfaz respete WCAG 2.2.
- Revisar accesibilidad por teclado y lectura con lector de pantalla.
- Confirmar que la solución respeta la arquitectura del proyecto.
- Validar que la experiencia siga las heurísticas de Nielsen.
