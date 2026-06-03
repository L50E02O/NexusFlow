export const navigationItems = [
  { label: 'Capas', href: '#capas' },
  { label: 'Flujo', href: '#flujo' },
  { label: 'Ventajas', href: '#ventajas' },
];

export const heroMetrics = [
  {
    value: '6',
    label: 'capas ordenadas para separar UI, dominio y reutilización.',
  },
  {
    value: '0',
    label: 'dependencias Next para mantener el arranque simple en Vite.',
  },
  {
    value: '100%',
    label: 'de la base visual pensada para accesibilidad y contraste fuerte.',
  },
];

export const layerCards = [
  {
    name: 'app',
    title: 'Capa de composición',
    description:
      'Punto de entrada para montar la página y conectar secciones sin mezclar lógica de negocio con presentación.',
    tags: ['Shell', 'Layout', 'Providers'],
  },
  {
    name: 'pages',
    title: 'Pantallas completas',
    description:
      'Agrupa la estructura de cada vista y decide qué widgets se muestran en cada contexto.',
    tags: ['Home', 'Catálogo', 'Detalle'],
  },
  {
    name: 'widgets',
    title: 'Bloques reutilizables',
    description:
      'Secciones grandes de la interfaz, como hero, métricas, pasos y llamadas a la acción.',
    tags: ['Hero', 'Grid', 'CTA'],
  },
  {
    name: 'features',
    title: 'Comportamientos',
    description:
      'Acciones concretas del producto como filtros, búsqueda o validaciones de interacción.',
    tags: ['Filtros', 'Formularios', 'Acciones'],
  },
  {
    name: 'entities',
    title: 'Modelo de negocio',
    description:
      'Define las piezas del dominio: producto, colección, carrito y cualquier entidad compartida.',
    tags: ['Producto', 'Carrito', 'Colección'],
  },
  {
    name: 'shared',
    title: 'Utilidades y UI base',
    description:
      'Centraliza helpers, estilos, tokens y componentes que deben ser consistentes en todo el proyecto.',
    tags: ['UI', 'Tokens', 'Helpers'],
  },
];

export const roadmapSteps = [
  {
    title: '1. Repositorio y base visual',
    description:
      'Primero se conserva este proyecto como base, se adapta la plantilla y se quita la dependencia de Next que rompía el arranque.',
    items: ['Mantener Vite', 'Eliminar imports incompatibles', 'Conservar avances ya hechos'],
  },
  {
    title: '2. Capas funcionales',
    description:
      'Luego se separan los bloques principales en pages, widgets, features, entities y shared para que cada pieza tenga una responsabilidad clara.',
    items: ['Responsabilidad única', 'Reutilización real', 'Menos acoplamiento'],
  },
  {
    title: '3. Evolución segura',
    description:
      'Por último se agregan datos reales, backend y autenticación sin romper la interfaz ya validada.',
    items: ['Supabase cuando haga falta', 'Rutas nuevas por etapas', 'Sin rehacer todo otra vez'],
  },
];

export const ctaItems = [
  'La plantilla queda lista para crecer sin arrastrar el stack de Next.',
  'Tus avances actuales pueden convivir con la nueva base visual.',
];