# NeuxFlow

Base inicial de React para la plataforma de comercio electrónico **NeuxFlow**, pensada para una materia de usabilidad y accesibilidad con enfoque en WCAG 2.2 y heurísticas de Nielsen.

## Estructura base

- `src/app`: composición de la aplicación y arranque.
- `src/pages`: pantallas o rutas de alto nivel.
- `src/widgets`: bloques de interfaz reutilizables.
- `src/features`: casos de uso del negocio.
- `src/entities`: modelos del dominio.
- `src/shared`: utilidades, estilos y componentes compartidos.

## Diagrama ER

```mermaid
erDiagram
    PROFILES ||--o| CARRITOS : "tiene"
    PROFILES ||--o{ PEDIDOS : "realiza"
    PROFILES ||--o{ RESENAS : "escribe"
    PROFILES ||--o{ RECOMENDACION : "recibe"

    CATEGORIAS ||--o{ PRODUCTOS : "contiene"

    PRODUCTOS ||--o{ DETALLE_CARRITOS : "incluido_en"
    PRODUCTOS ||--o{ DETALLE_PEDIDOS : "vendido_en"
    PRODUCTOS ||--o{ RESENAS : "calificado_en"
    PRODUCTOS ||--o{ RECOMENDACION : "sugerido_en"

    CARRITOS ||--o{ DETALLE_CARRITOS : "contiene"

    PEDIDOS ||--o{ DETALLE_PEDIDOS : "se_compone_de"
    PEDIDOS ||--o| PAGOS : "genera"
    PEDIDOS ||--o| ENVIOS : "requiere"

    PROFILES {
        uuid id PK
        text nombres
        text apellidos
        timestamp created_at
        text rol
    }

    CARRITOS {
        uuid id_carrito PK
        uuid id_usuario FK
    }

    CATEGORIAS {
        uuid id_categoria PK
        text nombre
        text descripcion
    }

    PRODUCTOS {
        uuid id_producto PK
        text nombre
        text descripcion
        numeric precio
        integer stock
        uuid id_categoria FK
        text url
    }

    DETALLE_CARRITOS {
        uuid id_detalle PK
        integer cantidad
        uuid id_carrito FK
        uuid id_producto FK
    }

    PEDIDOS {
        uuid id_pedido PK
        date fecha
        text estado
        numeric total
        uuid id_usuario FK
    }

    DETALLE_PEDIDOS {
        uuid id_detalle PK
        integer cantidad
        numeric precio_unitario
        uuid id_pedido FK
        uuid id_producto FK
    }

    PAGOS {
        uuid id_pago PK
        text metodo_pago
        text estado
        uuid id_pedido FK
    }

    ENVIOS {
        uuid id_envio PK
        text direccion
        text estado
        uuid id_pedido FK
    }

    RESENAS {
        uuid id_resena PK
        integer calificacion
        text comentario
        uuid id_usuario FK
        uuid id_producto FK
    }

    RECOMENDACION {
        uuid id_recomendacion PK
        numeric score
        uuid id_usuario FK
        uuid id_producto FK
    }
```

## Criterios de diseño y accesibilidad

- Usar HTML semántico antes que contenedores genéricos.
- Mantener navegación completa con teclado.
- Asegurar contraste suficiente y estados visibles de foco.
- No depender solo del color para comunicar estado o prioridad.
- Validar texto alternativo, nombres accesibles y mensajes claros.
- Revisar cada pantalla contra WCAG 2.2.
- Aplicar las 10 heurísticas de Nielsen como guía de experiencia: visibilidad del estado, correspondencia con el mundo real, control del usuario, consistencia, prevención de errores, reconocimiento antes que recuerdo, flexibilidad, minimalismo, ayuda ante errores y documentación útil.

## Estado de SonarQube (actualizado el 2026-07-07)

- Se corrigió el issue reportado en [src/main.tsx](src/main.tsx) que estaba generando un code smell en SonarQube.
- También se resolvieron conflictos de merge en [src/shared/context/AccessibilityContext.tsx](src/shared/context/AccessibilityContext.tsx) y [src/pages/SupportPage.tsx](src/pages/SupportPage.tsx), lo que permitió recuperar la ejecución de pruebas y la compilación.
- El análisis previo mostraba: 0 bugs, 0 vulnerabilities, 1 code smell, 0 duplicaciones y 0.0% de coverage.
- La corrección realizada elimina la alerta de tipo de aserción innecesaria, añade una validación explícita del contenedor raíz y restaura la lógica de accesibilidad sin conflictos.

## Pendientes para cerrar la revisión

- Ejecutar un nuevo análisis en SonarQube tras subir los cambios.
- Mejorar la cobertura de tests para subir el porcentaje de coverage desde 0.0%.
- Revisar si aparecen nuevos code smells tras el nuevo escaneo.

## Siguiente paso sugerido

Instalar dependencias y arrancar el proyecto con `npm install` y `npm run dev`.
