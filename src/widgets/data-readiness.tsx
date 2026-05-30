const repositoryNames = [
	'productos',
	'carritos',
	'detalle-carritos',
	'profiles',
	'categorias',
	'recomendacion',
	'pagos',
	'pedidos',
	'detalle-pedidos',
	'envios',
	'resenas',
];

const readinessPoints = [
	'Cliente Supabase lazy en `src/shared/lib/supabase.ts`: la app arranca sin variables y conecta al definir `.env`.',
	'11 repositorios CRUD en `entities/` con `isConfigured()` listos para productos, carritos, pedidos y más.',
	'Copia `.env.example`, rellena URL y anon key, y ejecuta `npm run dev` para ver el catálogo real.',
];

export function DataReadiness() {
	return (
		<section className="section data-readiness" id="datos" aria-labelledby="data-readiness-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Preparado para BD</p>
					<h2 id="data-readiness-title">La base ya está lista para conectar la aplicación a Supabase.</h2>
				</div>
				<p>
					La estructura actual deja el home y el flujo Stitch funcionando con datos locales, pero con
					puntos de integración claros para reemplazar contenido estático por consultas reales.
				</p>
			</div>

			<div className="data-readiness-grid">
				<article className="data-readiness-card">
					<span>01</span>
					<h3>Conexión ya definida</h3>
					<p>
						Variables necesarias: <strong>VITE_SUPABASE_URL</strong> y <strong>VITE_SUPABASE_ANON_KEY</strong>.
					</p>
				</article>
				<article className="data-readiness-card">
					<span>02</span>
					<h3>Repositorios disponibles</h3>
					<p>{repositoryNames.join(' · ')}</p>
				</article>
				<article className="data-readiness-card">
					<span>03</span>
					<h3>Ruta de implementación</h3>
					<p>{readinessPoints.join(' ')}</p>
				</article>
			</div>
		</section>
	);
}
