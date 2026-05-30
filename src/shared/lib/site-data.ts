import { stitchFlowStages } from './stitch-flow';
import { stitchScreens } from './stitch-screens.generated';

export const navigationItems = [
	{ label: 'Inicio', href: '#top' },
  { label: 'Productos', href: '#catalogo' },
  { label: 'UIs Stitch', href: '#ui' },
	{ label: 'Flujo Stitch', href: '#flujo-app' },
	{ label: 'Capas', href: '#capas' },
	{ label: 'Datos', href: '#datos' },
	{ label: 'Hoja de ruta', href: '#flujo' },
];

export const marketCategories = ['Moda', 'Tecnología', 'Hogar', 'Ofertas', 'Mercado Pago', 'UIs Stitch'];

export const heroMetrics = [
  {
  value: String(stitchScreens.length),
  label: 'UI Stitch conectadas como vistas navegables.',
  },
  {
  value: String(stitchFlowStages.length),
  label: 'etapas funcionales para recorrer el producto sin perder contexto.',
  },
  {
  value: '1',
  label: 'landing listo para enchufar datos reales de catálogo.',
  },
];

export const layerCards = [
  {
    name: 'app',
    title: 'Capa de composición',
    description:
      'Punto de entrada para montar el home, el flujo Stitch y futuras rutas sin mezclar lógica de negocio con presentación.',
    tags: ['Shell', 'Layout', 'Providers'],
  },
  {
    name: 'pages',
    title: 'Pantallas completas',
    description:
      'Agrupa la estructura de cada vista y decide qué widgets se muestran en cada contexto del recorrido.',
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
      'Define las piezas del dominio: producto, carrito, perfil y cualquier entidad lista para leer desde la base.',
    tags: ['Producto', 'Carrito', 'Colección'],
  },
  {
    name: 'shared',
    title: 'Utilidades y UI base',
    description:
      'Centraliza helpers, estilos, tokens, cliente de Supabase y componentes que deben ser consistentes en todo el proyecto.',
    tags: ['UI', 'Tokens', 'Helpers'],
  },
];

export const roadmapSteps = [
  {
    title: '1. Inicio y flujo',
    description:
      'La aplicación arranca en el home y luego baja al flujo Stitch para que el recorrido sea comprensible desde el primer render.',
    items: ['Home como entrada', 'Flujo visible', 'Accesos directos'],
  },
  {
    title: '2. Capas funcionales',
    description:
      'La UI se divide en páginas, widgets, features, entities y shared para que cada pieza tenga una responsabilidad clara.',
    items: ['Responsabilidad única', 'Reutilización real', 'Menos acoplamiento'],
  },
  {
    title: '3. Datos reales',
    description:
      'Cuando la BD esté lista, los servicios reemplazan el contenido estático sin tener que rehacer la interfaz.',
    items: ['Supabase', 'Repositorios', 'Consultas por entidad'],
  },
];

export const ctaItems = [
  'La plantilla ya carga el home, el flujo Stitch y el bloque preparado para datos.',
  'Los repositorios existentes pueden conectarse a la base sin cambiar la arquitectura.',
];