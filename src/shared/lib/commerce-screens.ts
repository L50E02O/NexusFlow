/** IDs de pantallas Stitch del dominio de compra y acceso (flujo adaptativo). */
export const commerceScreens = {
	login: '4b9d8d751fdb4d4eaf42022fb6ee1d75',
	home: 'b3c2cd83f7c04846bf78ba94d01806b5',
	register: 'fa89914bca2745f3bc5e0459da904050',
	catalog: '65fa3adafbdc44d9a751ae8f6c940c47',
	offers: 'a6140fc39bcb4357b8e3c1bcea71e3c9',
	coupons: '1aeafcb11646440fa0a58dddb826afaf',
	favorites: 'a53cbfe6606e42f9b3922dfabd6676d8',
	cartRecovery: '9eb080fc762142ccaa0cac3cb7f76684',
	cart: 'd5ac51f69e234f4481d25d2728f8603f',
	checkout: '38461b26fbdd4385877a064a93c1c747',
	accessibility: '9e614e96b8e6464195d0cf4a7f3979de',
} as const;

export type CommerceScreenKey = keyof typeof commerceScreens;

export interface CommerceJourneyStep {
	readonly key: CommerceScreenKey;
	readonly label: string;
	readonly description: string;
}

export const commerceJourneySteps: CommerceJourneyStep[] = [
	{
		key: 'catalog',
		label: 'Catálogo',
		description: 'Descubrimiento de productos con layout adaptativo.',
	},
	{
		key: 'offers',
		label: 'Ofertas',
		description: 'Incentivos y recomendaciones según contexto.',
	},
	{
		key: 'coupons',
		label: 'Cupones',
		description: 'Promociones activas en el recorrido de compra.',
	},
	{
		key: 'favorites',
		label: 'Favoritos',
		description: 'Lista personalizada para retomar la compra.',
	},
	{
		key: 'cart',
		label: 'Carrito',
		description: 'Resumen integrado antes del pago.',
	},
	{
		key: 'cartRecovery',
		label: 'Recuperación',
		description: 'Reenganche cuando el carrito queda abandonado.',
	},
	{
		key: 'checkout',
		label: 'Checkout',
		description: 'Cierre seguro del pedido.',
	},
];

export function commerceScreenPath(screenKey: CommerceScreenKey) {
	const id = commerceScreens[screenKey];
	return id === commerceScreens.login ? '/' : `/s/${id}`;
}
