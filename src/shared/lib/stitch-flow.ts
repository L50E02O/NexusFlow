import { stitchScreens } from './stitch-screens.generated';

export interface StitchFlowStage {
	readonly title: string;
	readonly description: string;
	readonly screenIds: readonly string[];
	readonly anchor: string;
}

// Etapas manuales originales, mantenemos el orden lógico creado previamente.
const baseStages: StitchFlowStage[] = [
	{
		title: '1. Acceso',
		description: 'Pantallas de entrada y registro que abren la experiencia desde el home.',
		anchor: 'acceso',
		screenIds: [
			'4b9d8d751fdb4d4eaf42022fb6ee1d75',
			'b3c2cd83f7c04846bf78ba94d01806b5',
			'fa89914bca2745f3bc5e0459da904050',
		],
	},
	{
		title: '2. Cuenta y control',
		description: 'Preferencias, accesibilidad, perfil, soporte y notificaciones.',
		anchor: 'cuenta',
		screenIds: [
			'5140887d60c24146b6cdcaa93b352bc2',
			'9e614e96b8e6464195d0cf4a7f3979de',
			'd9d9d5109f394bc28be1da9fd45fdfab',
			'e9792abe8ba64c4fac08518453b52289',
			'289430bfdbd04aa2b1a409289a928198',
			'2e9a9a775c98455da26d9e9109195503',
		],
	},
	{
		title: '3. Compra',
		description: 'Descubrimiento, incentivos, favoritos, carrito y checkout.',
		anchor: 'compra',
		screenIds: [
			'65fa3adafbdc44d9a751ae8f6c940c47',
			'a6140fc39bcb4357b8e3c1bcea71e3c9',
			'1aeafcb11646440fa0a58dddb826afaf',
			'a53cbfe6606e42f9b3922dfabd6676d8',
			'9eb080fc762142ccaa0cac3cb7f76684',
			'd5ac51f69e234f4481d25d2728f8603f',
			'38461b26fbdd4385877a064a93c1c747',
		],
	},
	{
		title: '4. Operación merchant',
		description: 'Paneles del merchant para manejar catálogo, inventario, soporte operativo y pagos.',
		anchor: 'operacion',
		screenIds: [
			'69cd149f38214844be2e5390be9240c3',
			'f1da2da7da9e4817b481778410a12cd4',
			'b9f54a0a54084e93b0220213bc449bb7',
			'ef748792352042fd8b250a770bf2b579',
			'a4bcf0670b574e7dbf1a55b0c61617cd',
			'497e06e699434a08a2f36fd427dafc7c',
			'18129e25f8be4d0a86687ec2992386a0',
		],
	},
	{
		title: '5. Riesgo y continuidad',
		description: 'Devoluciones, seguridad antifraude y continuidad de la relación con el usuario.',
		anchor: 'riesgo',
		screenIds: ['19b68716e75048aab9a97a7bdc086dae', 'f468ae1e48b04f59b20ad14781a86010'],
	},
];

// Asegurarnos de que todas las pantallas exportadas por Stitch estén incluidas en el flujo.
const allIds = stitchScreens.map(s => s.screenId);
const includedIds = baseStages.flatMap(s => s.screenIds);
const remaining = allIds.filter(id => !includedIds.includes(id));

export const stitchFlowStages: StitchFlowStage[] = [...baseStages];

if (remaining.length > 0) {
	stitchFlowStages.push({
		title: '6. Otras pantallas',
		description: 'Pantallas exportadas adicionales — incluidas para navegación completa entre prototipos.',
		anchor: 'otras',
		screenIds: remaining,
	});
}

export const stitchScreensById = new Map(stitchScreens.map(screen => [screen.screenId, screen] as const));
