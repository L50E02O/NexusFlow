import { Link } from 'react-router-dom';

import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import { StitchScreenCard } from './stitch-screen-card';

const featuredScreens = stitchRepository.listScreens().slice(0, 4);

export function StitchShowcase() {
	return (
		<section className="section stitch-showcase" id="ui" aria-labelledby="stitch-showcase-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Vistas Stitch</p>
					<h2 id="stitch-showcase-title">Las UIs exportadas ya se ven como componentes listos para usarse.</h2>
				</div>
				<p>
					Esta vitrina conecta las pantallas Stitch con sus rutas reales. Cada vista puede abrirse como HTML,
					navegarse desde el hub y reutilizarse como bloque visual del producto.
				</p>
			</div>

			<div className="stitch-showcase-grid" aria-label="Pantallas Stitch destacadas">
				{featuredScreens.map(screen => (
					<StitchScreenCard
						key={screen.screenId}
						screen={screen}
						stageLabel={stitchRepository.getStage(screen.screenId)?.title}
					/>
				))}
			</div>

			<div className="stitch-showcase-footer">
				<div>
					<strong>Componentes y vistas en la misma capa visual.</strong>
					<p>
						La idea es que cada UI Stitch deje de ser una captura aislada y empiece a comportarse como una vista del
						producto, lista para componer el flujo principal.
					</p>
				</div>
				<Link className="button button-primary" to="/ui">
					Abrir hub UI
				</Link>
			</div>
		</section>
	);
}