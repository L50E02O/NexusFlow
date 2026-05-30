import { commerceScreens } from './commerce-screens';
import { stitchScreens } from './stitch-screens.generated';

export type StitchAction =
	| { type: 'navigate'; screenId: string }
	| { type: 'back' }
	| { type: 'toast'; message: string };

export interface StitchWireContext {
	readonly screenId: string;
}

interface ActionRule {
	readonly pattern: RegExp;
	readonly action: StitchAction | ((ctx: StitchWireContext) => StitchAction);
}

const S = commerceScreens;

/** Pantallas merchant / cuenta / riesgo (fuera de commerceScreens). */
export const stitchScreenIds = {
	config: '5140887d60c24146b6cdcaa93b352bc2',
	profile: 'd9d9d5109f394bc28be1da9fd45fdfab',
	history: 'e9792abe8ba64c4fac08518453b52289',
	notifications: '289430bfdbd04aa2b1a409289a928198',
	support: '2e9a9a775c98455da26d9e9109195503',
	merchantDashboard: '69cd149f38214844be2e5390be9240c3',
	reports: 'b9f54a0a54084e93b0220213bc449bb7',
	productManagement: 'ef748792352042fd8b250a770bf2b579',
	aiAssistant: 'f1da2da7da9e4817b481778410a12cd4',
	returns: '19b68716e75048aab9a97a7bdc086dae',
	inventory: 'a4bcf0670b574e7dbf1a55b0c61617cd',
	fraud: 'f468ae1e48b04f59b20ad14781a86010',
	invoices: '497e06e699434a08a2f36fd427dafc7c',
	messaging: '18129e25f8be4d0a86687ec2992386a0',
} as const;

export const defaultStitchScreenId = S.login;

/** Alias por texto de carpeta / título para resolver destinos. */
const slugToScreenId = Object.fromEntries(
	stitchScreens.map(screen => [screen.folder.replace(/_/g, ' '), screen.screenId]),
) as Record<string, string>;

const globalRules: ActionRule[] = [
	{ pattern: /volver|atr[aá]s|regresar|anterior|back|←/i, action: { type: 'back' } },
	{ pattern: /cerrar\s*sesi[oó]n|salir|logout/i, action: { type: 'navigate', screenId: S.login } },
	{ pattern: /iniciar\s*sesi[oó]n|login|entrar|acceder|sign\s*in/i, action: { type: 'navigate', screenId: S.login } },
	{ pattern: /registr|crear\s*cuenta|sign\s*up|nueva\s*cuenta/i, action: { type: 'navigate', screenId: S.register } },
	{ pattern: /inicio(?!\s*de\s*sesi)|home|explorar\s*tienda|ir\s*a\s*inicio/i, action: { type: 'navigate', screenId: S.home } },
	{ pattern: /cat[aá]logo|ver\s*productos|todos\s*los\s*productos|tienda/i, action: { type: 'navigate', screenId: S.catalog } },
	{ pattern: /ofertas?|descuentos?\s*personal/i, action: { type: 'navigate', screenId: S.offers } },
	{ pattern: /cup[oó]n|promocion|promo/i, action: { type: 'navigate', screenId: S.coupons } },
	{ pattern: /favoritos?|wishlist|guardados/i, action: { type: 'navigate', screenId: S.favorites } },
	{ pattern: /recuperar|abandonado|recuperaci[oó]n/i, action: { type: 'navigate', screenId: S.cartRecovery } },
	{ pattern: /carrito|cart|bolsa|mi\s*compra/i, action: { type: 'navigate', screenId: S.cart } },
	{ pattern: /checkout|pagar|finalizar\s*compra|confirmar\s*pedido|comprar\s*ahora/i, action: { type: 'navigate', screenId: S.checkout } },
	{ pattern: /accesibilidad|a11y|contraste|tama[nñ]o\s*de\s*fuente/i, action: { type: 'navigate', screenId: S.accessibility } },
	{ pattern: /configuraci[oó]n|ajustes|preferencias|settings/i, action: { type: 'navigate', screenId: stitchScreenIds.config } },
	{ pattern: /perfil|mi\s*cuenta|cuenta(?!\s*de)/i, action: { type: 'navigate', screenId: stitchScreenIds.profile } },
	{ pattern: /historial|mis\s*pedidos|compras\s*anteriores/i, action: { type: 'navigate', screenId: stitchScreenIds.history } },
	{ pattern: /notificaciones?|alertas/i, action: { type: 'navigate', screenId: stitchScreenIds.notifications } },
	{ pattern: /soporte|ayuda|faq|contacto/i, action: { type: 'navigate', screenId: stitchScreenIds.support } },
	{ pattern: /merchant|vendedor|panel\s*admin|dashboard/i, action: { type: 'navigate', screenId: stitchScreenIds.merchantDashboard } },
	{ pattern: /reportes?|anal[ií]ticas?|m[eé]tricas/i, action: { type: 'navigate', screenId: stitchScreenIds.reports } },
	{ pattern: /gesti[oó]n\s*de\s*productos|administrar\s*productos/i, action: { type: 'navigate', screenId: stitchScreenIds.productManagement } },
	{ pattern: /asistente\s*ia|inteligencia\s*artificial/i, action: { type: 'navigate', screenId: stitchScreenIds.aiAssistant } },
	{ pattern: /inventario|stock/i, action: { type: 'navigate', screenId: stitchScreenIds.inventory } },
	{ pattern: /devoluci[oó]n|reembolso/i, action: { type: 'navigate', screenId: stitchScreenIds.returns } },
	{ pattern: /fraude|seguridad/i, action: { type: 'navigate', screenId: stitchScreenIds.fraud } },
	{ pattern: /facturas?|pagos?\s*recibidos/i, action: { type: 'navigate', screenId: stitchScreenIds.invoices } },
	{ pattern: /mensajer[ií]a|chat|comunicaci[oó]n/i, action: { type: 'navigate', screenId: stitchScreenIds.messaging } },
	{
		pattern: /a[nñ]adir|agregar|add\s*to\s*cart|comprar/i,
		action: { type: 'navigate', screenId: S.cart },
	},
	{
		pattern: /continuar|siguiente|next|proceder|avanzar/i,
		action: ctx => resolveContinueAction(ctx.screenId),
	},
	{
		pattern: /enviar|submit|confirmar|guardar/i,
		action: ctx => resolveSubmitAction(ctx.screenId),
	},
];

/** Flujo por defecto al pulsar "Continuar" según pantalla actual. */
function resolveContinueAction(currentScreenId: string): StitchAction {
	const flow: Record<string, string> = {
		[S.login]: S.home,
		[S.register]: S.catalog,
		[S.home]: S.catalog,
		[S.catalog]: S.cart,
		[S.offers]: S.catalog,
		[S.coupons]: S.cart,
		[S.favorites]: S.cart,
		[S.cartRecovery]: S.cart,
		[S.cart]: S.checkout,
		[S.checkout]: stitchScreenIds.history,
		[stitchScreenIds.merchantDashboard]: stitchScreenIds.productManagement,
	};

	const next = flow[currentScreenId];
	return next ? { type: 'navigate', screenId: next } : { type: 'navigate', screenId: S.catalog };
}

function resolveSubmitAction(currentScreenId: string): StitchAction {
	if (currentScreenId === S.login || currentScreenId === S.register) {
		return { type: 'navigate', screenId: S.home };
	}

	if (currentScreenId === S.checkout) {
		return {
			type: 'toast',
			message: 'Pedido registrado localmente. Conecta Supabase para persistir pedidos.',
		};
	}

	return resolveContinueAction(currentScreenId);
}

const perScreenRules: Partial<Record<string, ActionRule[]>> = {
	[S.login]: [
		{ pattern: /olvid|recuperar\s*contrase/i, action: { type: 'toast', message: 'Recuperación de contraseña: conectar con Supabase Auth.' } },
	],
	[S.checkout]: [
		{ pattern: /mercado\s*pago|tarjeta|transferencia/i, action: { type: 'toast', message: 'Pago simulado. Integra pasarela + tabla pagos en Supabase.' } },
	],
};

function normalizeLabel(value: string) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

export function getElementLabel(element: Element) {
	const htmlEl = element as HTMLElement;
	const pieces = [
		htmlEl.getAttribute('aria-label'),
		htmlEl.getAttribute('title'),
		htmlEl.getAttribute('alt'),
		htmlEl.getAttribute('data-nf-target'),
		htmlEl.textContent,
	];

	return normalizeLabel(pieces.filter(Boolean).join(' '));
}

export function resolveStitchAction(label: string, ctx: StitchWireContext): StitchAction | null {
	if (!label) return null;

	const screenRules = perScreenRules[ctx.screenId] ?? [];

	for (const rule of [...screenRules, ...globalRules]) {
		if (rule.pattern.test(label)) {
			return typeof rule.action === 'function' ? rule.action(ctx) : rule.action;
		}
	}

	for (const [slug, screenId] of Object.entries(slugToScreenId)) {
		if (label.includes(slug.slice(0, 12))) {
			return { type: 'navigate', screenId };
		}
	}

	return null;
}
