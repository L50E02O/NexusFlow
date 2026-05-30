export type StitchScreenKind = 'solicitada' | 'exportada';

export interface StitchScreenEntry {
	readonly screenId: string;
	readonly title: string;
	readonly kind: StitchScreenKind;
	readonly folder: string;
	readonly htmlPath: string;
	readonly imagePath: string;
	readonly summary: string;
}

const rootPath = '/stitch/adaptive-ecommerce-auth-interface/requested';

function buildPaths(folder: string) {
	return {
		htmlPath: `${rootPath}/${folder}/code.html`,
		imagePath: `${rootPath}/${folder}/screen.png`,
	};
}

export const stitchScreens: StitchScreenEntry[] = [
	{
		screenId: '4b9d8d751fdb4d4eaf42022fb6ee1d75',
		title: 'Inicio de Sesión Inteligente - NexusFlow',
		kind: 'solicitada',
		folder: 'inicio_de_sesion_inteligente_nexusflow',
		summary: 'Pantalla de entrada enfocada en acceso rápido, validación clara y recuperación sin fricción.',
		...buildPaths('inicio_de_sesion_inteligente_nexusflow'),
	},
	{
		screenId: 'b3c2cd83f7c04846bf78ba94d01806b5',
		title: 'Inicio Personalizado - LuxeCommerce',
		kind: 'solicitada',
		folder: 'inicio_personalizado_luxecommerce',
		summary: 'Inicio adaptado al contexto del usuario con una estructura visual más editorial.',
		...buildPaths('inicio_personalizado_luxecommerce'),
	},
	{
		screenId: 'fa89914bca2745f3bc5e0459da904050',
		title: 'Registro Inteligente Adaptativo - NexusFlow',
		kind: 'solicitada',
		folder: 'registro_inteligente_adaptativo_nexusflow',
		summary: 'Registro guiado con foco en prevención de errores y baja carga cognitiva.',
		...buildPaths('registro_inteligente_adaptativo_nexusflow'),
	},
	{
		screenId: '1aeafcb11646440fa0a58dddb826afaf',
		title: 'Cupones y Promociones - NexusFlow',
		kind: 'solicitada',
		folder: 'cupones_y_promociones_nexusflow',
		summary: 'Área para activar descuentos, promociones y beneficios visibles en el flujo de compra.',
		...buildPaths('cupones_y_promociones_nexusflow'),
	},
	{
		screenId: '5140887d60c24146b6cdcaa93b352bc2',
		title: 'Configuración General - NexusFlow',
		kind: 'solicitada',
		folder: 'configuracion_general_nexusflow',
		summary: 'Panel central de preferencias y comportamiento de la cuenta.',
		...buildPaths('configuracion_general_nexusflow'),
	},
	{
		screenId: '9e614e96b8e6464195d0cf4a7f3979de',
		title: 'Panel de Accesibilidad - NexusFlow',
		kind: 'solicitada',
		folder: 'panel_de_accesibilidad_nexusflow',
		summary: 'Controles de accesibilidad y ajustes de experiencia orientados al usuario.',
		...buildPaths('panel_de_accesibilidad_nexusflow'),
	},
	{
		screenId: 'a6140fc39bcb4357b8e3c1bcea71e3c9',
		title: 'Ofertas Personalizadas - NexusFlow',
		kind: 'solicitada',
		folder: 'ofertas_personalizadas_nexusflow',
		summary: 'Bloque de ofertas sugeridas en función del contexto de navegación y compra.',
		...buildPaths('ofertas_personalizadas_nexusflow'),
	},
	{
		screenId: 'd9d9d5109f394bc28be1da9fd45fdfab',
		title: 'Perfil de Usuario - NexusFlow',
		kind: 'solicitada',
		folder: 'perfil_de_usuario_nexusflow',
		summary: 'Resumen de cuenta con datos personales, estado y accesos rápidos.',
		...buildPaths('perfil_de_usuario_nexusflow'),
	},
	{
		screenId: 'e9792abe8ba64c4fac08518453b52289',
		title: 'Historial de Compras - NexusFlow (ES)',
		kind: 'solicitada',
		folder: 'historial_de_compras_nexusflow_es',
		summary: 'Listado en español con transparencia sobre compras previas y seguimiento.',
		...buildPaths('historial_de_compras_nexusflow_es'),
	},
	{
		screenId: '289430bfdbd04aa2b1a409289a928198',
		title: 'Centro de Notificaciones - NexusFlow',
		kind: 'solicitada',
		folder: 'centro_de_notificaciones_nexusflow',
		summary: 'Centro para avisos, alertas y comunicación transaccional.',
		...buildPaths('centro_de_notificaciones_nexusflow'),
	},
	{
		screenId: '2e9a9a775c98455da26d9e9109195503',
		title: 'Soporte y Ayuda - NexusFlow',
		kind: 'solicitada',
		folder: 'soporte_y_ayuda_nexusflow',
		summary: 'Ayuda contextual, acceso a soporte y resolución de dudas frecuentes.',
		...buildPaths('soporte_y_ayuda_nexusflow'),
	},
	{
		screenId: '65fa3adafbdc44d9a751ae8f6c940c47',
		title: 'Catálogo de Productos (ES) - LuxeCommerce',
		kind: 'solicitada',
		folder: 'catalogo_de_productos_es_luxecommerce',
		summary: 'Catálogo y navegación comercial en español con foco en descubrimiento.',
		...buildPaths('catalogo_de_productos_es_luxecommerce'),
	},
	{
		screenId: 'a53cbfe6606e42f9b3922dfabd6676d8',
		title: 'Mis Favoritos - NexusFlow',
		kind: 'solicitada',
		folder: 'mis_favoritos_nexusflow',
		summary: 'Vista de guardados y selección rápida para volver a productos de interés.',
		...buildPaths('mis_favoritos_nexusflow'),
	},
	{
		screenId: '9eb080fc762142ccaa0cac3cb7f76684',
		title: 'Recuperación de Carrito - NexusFlow',
		kind: 'solicitada',
		folder: 'recuperacion_de_carrito_nexusflow',
		summary: 'Flujo orientado a reactivar compras interrumpidas con claridad y confianza.',
		...buildPaths('recuperacion_de_carrito_nexusflow'),
	},
	{
		screenId: 'd5ac51f69e234f4481d25d2728f8603f',
		title: 'Carrito de Compras Integrado - NexusFlow',
		kind: 'solicitada',
		folder: 'carrito_de_compras_integrado_nexusflow',
		summary: 'Carrito unificado con acciones principales visibles y jerarquía consistente.',
		...buildPaths('carrito_de_compras_integrado_nexusflow'),
	},
	{
		screenId: '38461b26fbdd4385877a064a93c1c747',
		title: 'Checkout Seguro (ES) - LuxeCommerce',
		kind: 'solicitada',
		folder: 'checkout_seguro_es_luxecommerce',
		summary: 'Pago final en español con señales de confianza y pasos explícitos.',
		...buildPaths('checkout_seguro_es_luxecommerce'),
	},
	{
		screenId: '69cd149f38214844be2e5390be9240c3',
		title: 'Merchant Dashboard - LuxeCommerce',
		kind: 'solicitada',
		folder: 'merchant_dashboard_luxecommerce',
		summary: 'Panel central de merchant con métricas, estado comercial y accesos rápidos.',
		...buildPaths('merchant_dashboard_luxecommerce'),
	},
	{
		screenId: 'b9f54a0a54084e93b0220213bc449bb7',
		title: 'Reportes y Analíticas - NexusFlow Merchant',
		kind: 'solicitada',
		folder: 'reportes_y_analiticas_nexusflow_merchant',
		summary: 'Lectura de negocio con métricas, tendencias y decisiones operativas.',
		...buildPaths('reportes_y_analiticas_nexusflow_merchant'),
	},
	{
		screenId: 'ef748792352042fd8b250a770bf2b579',
		title: 'Gestión de Productos - NexusFlow Merchant',
		kind: 'solicitada',
		folder: 'gestion_de_productos_nexusflow_merchant',
		summary: 'Administración de catálogo con foco en edición, estado y control de inventario.',
		...buildPaths('gestion_de_productos_nexusflow_merchant'),
	},
	{
		screenId: 'f1da2da7da9e4817b481778410a12cd4',
		title: 'Asistente IA Integrado - NexusFlow Merchant',
		kind: 'solicitada',
		folder: 'asistente_ia_integrado_nexusflow_merchant',
		summary: 'Asistencia contextual para operaciones del merchant y apoyo a decisiones.',
		...buildPaths('asistente_ia_integrado_nexusflow_merchant'),
	},
	{
		screenId: '19b68716e75048aab9a97a7bdc086dae',
		title: 'Gestión de Devoluciones y Reembolsos - NexusFlow Admin',
		kind: 'solicitada',
		folder: 'gestion_de_devoluciones_y_reembolsos_nexusflow_admin',
		summary: 'Panel operativo para devoluciones, reembolsos y resolución de incidencias.',
		...buildPaths('gestion_de_devoluciones_y_reembolsos_nexusflow_admin'),
	},
	{
		screenId: 'a4bcf0670b574e7dbf1a55b0c61617cd',
		title: 'Gestión de Inventario - NexusFlow Merchant Premium',
		kind: 'solicitada',
		folder: 'gestion_de_inventario_nexusflow_merchant_premium',
		summary: 'Control de stock y disponibilidad para el flujo premium del merchant.',
		...buildPaths('gestion_de_inventario_nexusflow_merchant_premium'),
	},
	{
		screenId: 'f468ae1e48b04f59b20ad14781a86010',
		title: 'Seguridad y Detección de Fraude - NexusFlow Merchant Premium',
		kind: 'solicitada',
		folder: 'seguridad_y_deteccion_de_fraude_nexusflow_merchant_premium',
		summary: 'Monitoreo de riesgo, alertas y protección de transacciones.',
		...buildPaths('seguridad_y_deteccion_de_fraude_nexusflow_merchant_premium'),
	},
	{
		screenId: '497e06e699434a08a2f36fd427dafc7c',
		title: 'Facturas y Pagos - NexusFlow',
		kind: 'solicitada',
		folder: 'facturas_y_pagos_nexusflow',
		summary: 'Consulta de facturas, cobros y métodos de pago del entorno NexusFlow.',
		...buildPaths('facturas_y_pagos_nexusflow'),
	},
	{
		screenId: '18129e25f8be4d0a86687ec2992386a0',
		title: 'Mensajería y Comunicación - NexusFlow',
		kind: 'solicitada',
		folder: 'mensajeria_y_comunicacion_nexusflow',
		summary: 'Mensajes, notificaciones y comunicación operativa centralizada.',
		...buildPaths('mensajeria_y_comunicacion_nexusflow'),
	},
];

export const stitchRequestedScreens = stitchScreens.filter(screen => screen.kind === 'solicitada');
