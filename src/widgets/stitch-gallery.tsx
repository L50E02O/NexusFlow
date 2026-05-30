import { Link } from 'react-router-dom';

import { stitchScreens } from '../shared/lib/stitch-screens.generated';
import { stitchFlowStages, stitchScreensById } from '../shared/lib/stitch-flow';

export function StitchFlow() {
	return (
		<section className="section stitch-flow" id="flujo-app" aria-labelledby="stitch-flow-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Flujo Stitch</p>
					<h2 id="stitch-flow-title">Las pantallas Stitch ya están conectadas al recorrido de la app.</h2>
				</div>
				<p>
					Cada pantalla exportada vive en `public/stitch` y ahora se agrupa por etapas para que el
					usuario cargue el home y siga el flujo sin perder contexto.
				</p>
			</div>

			<div className="flow-summary" aria-label="Resumen del flujo Stitch">
				<article>
					<strong>{stitchScreens.length}</strong>
					<span>pantallas conectadas</span>
				</article>
				<article>
					<strong>{stitchFlowStages.length}</strong>
					<span>etapas del recorrido</span>
				</article>
				<article>
					<strong>BD</strong>
					<span>lista para integrar la siguiente capa</span>
				</article>
			</div>

			<div className="flow-stage-grid">
				{stitchFlowStages.map(stage => (
					<article className="flow-stage-card" key={stage.anchor}>
						<span>{stage.title}</span>
						<h3>{stage.description}</h3>
						<div className="flow-stage-screens" aria-label={stage.title}>
							{stage.screenIds.map(screenId => {
								const screen = stitchScreensById.get(screenId);

								if (!screen) {
									return null;
								}

								return (
									<article className="flow-screen-card" key={screen.screenId}>
										<div className="flow-screen-card-topline">
											<span className="atlas-chip">{screen.kind}</span>
											<span className="atlas-folder">/{screen.folder}</span>
										</div>
										<h4>{screen.title}</h4>
										<p>{screen.summary}</p>
										<div className="atlas-card-actions">
											<a className="button button-primary" href={screen.htmlPath} target="_blank" rel="noreferrer">
												Ver HTML
											</a>
											<Link className="button button-secondary" to={`/ui/${screen.screenId}`}>
												Abrir ruta
											</Link>
											<a className="button button-secondary" href={screen.imagePath} target="_blank" rel="noreferrer">
												Ver captura
											</a>
										</div>
									</article>
								);
							})}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
