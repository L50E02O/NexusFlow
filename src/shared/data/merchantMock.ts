export type MerchantOrder = {
  id: string;
  customer: string;
  customerInitials: string;
  product: string;
  amount: number;
  status: 'shipped' | 'processing' | 'pending';
};

export const merchantNav = [
  { to: '/merchant', label: 'Panel de Control', icon: 'dashboard', end: true },
  { to: '/merchant/inventario', label: 'Inventario', icon: 'inventory_2' },
  { to: '/merchant/productos', label: 'Productos', icon: 'package_2' },
  { to: '/merchant/reportes', label: 'Reportes', icon: 'monitoring' },
  { to: '/merchant/devoluciones', label: 'Devoluciones', icon: 'assignment_return' },
  { to: '/merchant/seguridad', label: 'Seguridad', icon: 'security' },
  { to: '/merchant/asistente', label: 'Asistente IA', icon: 'smart_toy' },
] as const;

export const merchantMetrics = [
  {
    label: 'Ingresos Totales',
    value: '$128,430.00',
    delta: '+12%',
    up: true,
    icon: 'payments',
    iconBg: 'bg-primary-fixed text-primary',
  },
  {
    label: 'Valor Promedio del Pedido',
    value: '$84.50',
    delta: '+5.2%',
    up: true,
    icon: 'shopping_basket',
    iconBg: 'bg-secondary-fixed text-secondary',
  },
  {
    label: 'Tasa de Conversión',
    value: '3.42%',
    delta: '-0.8%',
    up: false,
    icon: 'ads_click',
    iconBg: 'bg-tertiary-fixed text-tertiary',
  },
  {
    label: 'Alertas de Fraude',
    value: '2 Activas',
    delta: 'CRÍTICO',
    critical: true,
    icon: 'gpp_maybe',
    iconBg: 'bg-error text-on-error',
  },
] as const;

export const merchantOrders: MerchantOrder[] = [
  {
    id: 'ORD-88219',
    customer: 'Elena J.',
    customerInitials: 'EJ',
    product: 'Leather Weekender Bag',
    amount: 450,
    status: 'shipped',
  },
  {
    id: 'ORD-88218',
    customer: 'Marco K.',
    customerInitials: 'MK',
    product: 'Classic Aviator Specs',
    amount: 180,
    status: 'processing',
  },
  {
    id: 'ORD-88217',
    customer: 'Sofía L.',
    customerInitials: 'SL',
    product: 'Velvet Evening Gown',
    amount: 1200,
    status: 'pending',
  },
];

export const lowStockItems = [
  { name: 'Reloj Vanguard Heritage', stock: 4, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5GHLGCh9aVJS9quVQLMLimxNPVep_He7aVDc_5v2kZRpWy0TclMGHQZjgFe8pSnpDZkhm56b7HR4gVLL1VqzGUrfYvPyXkwswSRgxSUxDZOtl3GUhv0aAae1V6R-cqsIhm_alCA6BF9cGpc-6IKLugpClwHEqizhWvN63jB4oxJ2slhy9OYwsM9btCWvJ-1A0shwh_8wjSToFFJrg3Mi9fFpDd5RaHToVciYjeRqyaXDDNx4Gk4fjObVjvyML02MTSjpnK4jZFDE' },
  { name: 'Zapatillas AeroFlow', stock: 8, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9WmzV-FIw2VJ02-NR97EF-w8FpHbXk75GgrfGzyiTWQo2Ulf7rP0KYT-w12rYCInm4B7DFu4VzU7oLmjK5FjbhfrAjLQmZgT_foh0hmX4Pf4FjOMj4dK6N0LEZ9Geyz3P82xN_jFU3M5RnQYk2RyVnajY823qxA1Kv7FO9r87CaacG-ShdV9y7ZFSM1mlL0NhuDEcw4SCBTPyrO-12U5cn6ffeBLlCcGMDVsdS1LDNRdZevsBx6ZTWLklLJiC2Yj8WDs6Ic91Z6g' },
];

export const merchantOrderStatus = {
  shipped: { label: 'Enviado', className: 'bg-green-100 text-green-800' },
  processing: { label: 'Procesando', className: 'bg-primary-fixed text-primary' },
  pending: { label: 'Pendiente', className: 'bg-error-container text-error' },
} as const;

export const merchantAiTips = [
  {
    tag: 'Tendencia de Mercado',
    title: '"Seda Sostenible" es tendencia en tu área local.',
    body: 'Los datos de búsqueda muestran un aumento del 45% en consultas sobre tejidos ecológicos.',
    action: 'Aplicar Estrategia',
  },
  {
    tag: 'Optimización',
    title: 'Agrupa accesorios de alto margen con relojes populares.',
    body: 'El empaquetado automático podría aumentar el AOV en un 15%.',
    action: 'Crear Paquete',
  },
  {
    tag: 'IA de Inventario',
    title: 'Pronóstico: Pico de demanda en 14 días.',
    body: 'Repón stock de artículos de invierno para evitar pérdida de ingresos.',
    action: 'Revisar Stock',
  },
];

export const inventorySummary = [
  { label: 'Productos en Inventario', value: '1,284', note: '+12 este mes', up: true, icon: 'inventory', iconBg: 'bg-primary-fixed text-primary' },
  { label: 'Stock Disponible', value: '45.2k', note: 'Unidades totales', icon: 'layers', iconBg: 'bg-secondary-fixed text-on-secondary-fixed' },
  { label: 'Alertas de Stock Bajo', value: '24', note: 'Requieren atención', critical: true, icon: 'warning', iconBg: 'bg-error text-on-error' },
  { label: 'Movimientos (24h)', value: '312', note: 'Entradas y salidas', icon: 'sync_alt', iconBg: 'bg-surface-container-highest text-primary' },
] as const;

export type InventoryProduct = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: 'ok' | 'low' | 'out';
  icon: string;
};

export const inventoryProducts: InventoryProduct[] = [
  { sku: 'NF-8821', name: 'MacBook Air M2', category: 'Electrónica', stock: 42, price: '$1,299.00', status: 'ok', icon: 'laptop_mac' },
  { sku: 'NF-1092', name: 'Sony WH-1000XM5', category: 'Audio', stock: 3, price: '$349.99', status: 'low', icon: 'headphones' },
  { sku: 'NF-9920', name: 'iPhone 15 Pro', category: 'Telefonía', stock: 0, price: '$999.00', status: 'out', icon: 'smartphone' },
];

export type MerchantCatalogProduct = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: 'active' | 'draft';
  image: string;
  stockPct: number;
};

export const merchantCatalogProducts: MerchantCatalogProduct[] = [
  {
    sku: 'NF-HP01',
    name: 'Audífonos Nexus Pro',
    category: 'Electrónica',
    stock: 48,
    price: '$4,299.00',
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADyq_kXHHEwIf9tEmUQFUzsCK2IgNbTIJJ8s8vixLiANc1sdH33XItgacaWypeaSjxTL4bXmqeuO1hIoCEKHdX9Q3FD1TBbLaCXrk0ZB6nQ4WogGt9EQ9QZ7k-0ekb_bZRxEvlVGvCv3UmxBSbukZxnW_nkKQka9nE-1AQVpjO4MBv9SmbRc6j0cQ4_-_Y9ssGGICSlTMtm7HGQebg0IYrQccmqCHJS35F1aS3OuCa0VGV5bxL0L4_nEKxFHxOVxCGlsoKOLpTK5s',
    stockPct: 70,
  },
  {
    sku: 'NF-UW05',
    name: 'Tenis Urban Walker',
    category: 'Calzado',
    stock: 3,
    price: '$1,850.00',
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGevH1oPUdfzfhgszUES6yHKAHQioCHJ4pOApUdgrXSEEN_cfQrnr34K8WFSTjC-4UgX5yIq3W0SooeQtwsKL76ce1ioGKMbMPpdYfD7c0u-idYn2KMX-_EW7JeLnvQxayqgQl5fO5AZUgBITHkFN8371DPIf3ax_KKP7nA7F5-EbFHaSwUpc87hSi4FGZFdSz7z7lSavpUV7Ku_VMOYhsLtUNVru8PdkI4CYxVc7n721rDCRKzY1MO1IOBVce9ZzAsak3WQ4BB8c',
    stockPct: 10,
  },
  {
    sku: 'NF-VW22',
    name: 'Reloj Cuero Vintage',
    category: 'Accesorios',
    stock: 120,
    price: '$3,100.00',
    status: 'draft',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLE2mwsTT5rcfOc3Us0LVU18PqLVMlDKrB2iP2s_YfMCbq2uVy8xeQojfZIhHDIE3vPul5ohd1QocuWRkEgQIKRUjfDQbCbsjYtU78tgDznbnmbW0q28oIR_5-UPctt7nXERQ6Ntuw1Zl2gTDAE6MmeDMtHW6SMrRuKFlGOIJMs7IrwfxH38wtYe1SuZOXnwEqT7zMSC3TABq5GziQvND7CtMbE-_LAtA7kKUE2KcTkimX2FmuxED1w8x7DzdE2K-PjceQ2a7lMCM',
    stockPct: 100,
  },
];

export const returnRequests = [
  { id: 'NF-9842', product: 'Laptop Ultra Pro X1', reason: 'Defecto de Fábrica', status: 'pending' as const },
  { id: 'NF-8721', product: 'Auriculares Hi-Fi 300', reason: 'Tamaño Incorrecto', status: 'review' as const },
  { id: 'NF-1033', product: 'Silla Ergonómica Pro', reason: 'Dañado en Envío', status: 'critical' as const },
];

export const returnStatusLabels = {
  pending: { label: 'Pendiente', className: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  review: { label: 'En Revisión', className: 'bg-secondary-container text-on-secondary-container' },
  critical: { label: 'Crítico', className: 'bg-error-container text-error' },
} as const;

export const securitySummary = [
  { label: 'Alertas Sospechosas', value: '24', delta: '+12%', up: true },
  { label: 'Pagos Sospechosos', value: '8', delta: 'Estable', stable: true },
  { label: 'Intentos Fallidos', value: '142', delta: '-5%', up: false },
];

export const securityLogs = [
  { event: 'Login Exitoso', user: 'Carlos R.', location: 'Madrid, ES', time: 'Hace 2 horas', ok: true },
  { event: 'Intento Fallido', user: 'Anónimo (IP: 192.x)', location: 'Kiev, UA', time: 'Hace 5 horas', ok: false },
  { event: 'API Key Rotada', user: 'Sistema Automático', location: 'Servidor (Dublin)', time: 'Ayer', ok: true },
];

export const reportKpis = [
  { label: 'Ventas Totales', value: '1,250', delta: '+12%', up: true, icon: 'trending_up' },
  { label: 'Ingresos Mensuales', value: '$42,850', delta: '+8.5%', up: true, icon: 'payments' },
  { label: 'Tasa de Conversión', value: '3.15%', delta: '-0.2%', up: false, icon: 'ads_click' },
  { label: 'Pedidos Totales', value: '845', delta: '+5%', up: true, icon: 'shopping_cart' },
  { label: 'Valor Promedio de Compra', value: '$50.70', delta: '+3.2%', up: true, icon: 'account_balance_wallet' },
];

export const assistantMessages = [
  { role: 'assistant' as const, text: 'Hola, soy tu asistente de NexusFlow. He analizado tus métricas de hoy. ¿Te gustaría ver un resumen de las ventas de calzado deportivo?', time: '10:30 AM' },
  { role: 'user' as const, text: 'Sí, por favor. También avísame si hay stock bajo en los productos destacados.', time: '10:31 AM' },
  {
    role: 'assistant' as const,
    text: 'Entendido. Ventas hoy: $1,240 (+12%). Pedidos: 24 (4 pendientes). Las Zapatillas AeroFlow tienen solo 5 unidades.',
    time: '10:32 AM',
    stats: { sales: '$1,240.00', orders: '24' },
  },
];

export const assistantSuggestions = [
  'Generar reporte de ventas',
  'Optimizar inventario',
  'Crear promoción',
];

export const assistantInsights = [
  { title: 'Crecimiento estimado', value: '+18.5%', note: 'Basado en tendencia de 7 días' },
  { title: 'Zapatillas AeroFlow', value: '5 unidades', note: 'Stock crítico — menos de 48h', action: 'Reponer Stock' },
];
