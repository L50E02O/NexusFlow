import { Link } from 'react-router-dom';

import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import {
	commerceJourneySteps,
	commerceScreenPath,
	commerceScreens,
} from '../shared/lib/commerce-screens';

export function CommerceJourney() {
	const featuredId = commerceScreens.catalog;
	const featured = stitchRepository.findById(featuredId);

	return (
		<section className="section commerce-journey" id="recorrido-compra" aria-labelledby="commerce-journey-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Comercio adaptativo</p>
					<h2 id="commerce-journey-title">Recorrido de compra con prototipos Stitch listos.</h2>
				</div>
				<p>
					Cada paso abre una ruta navegable de NexusFlow. Cuando conectes Supabase, los repositorios de productos,
					carritos y pedidos sustituirán el contenido estático sin cambiar estas rutas.
				</p>
			</div>

			<ol className="commerce-journey-steps" aria-label="Etapas del flujo de compra">
				{commerceJourneySteps.map((step, index) => {
					const screen = stitchRepository.findById(commerceScreens[step.key]);

					return (
						<li className="commerce-journey-step" key={step.key}>
							<span className="commerce-journey-index" aria-hidden="true">
								{index + 1}
							</span>
							<div>
								<h3>{step.label}</h3>
								<p>{step.description}</p>
								{screen ? <p className="commerce-journey-screen">{screen.title}</p> : null}
							</div>
							<Link className="button button-secondary" to={commerceScreenPath(step.key)}>
								Abrir UI
							</Link>
						</li>
					);
				})}
			</ol>

			{featured ? (
				<aside className="commerce-journey-featured" aria-label="Vista destacada del catálogo">
					<div>
						<p className="eyebrow">Vista principal</p>
						<h3>{featured.title}</h3>
						<p>{featured.summary}</p>
					</div>
					<Link className="button button-primary" to={commerceScreenPath('catalog')}>
						Ver catálogo Stitch
					</Link>
				</aside>
			) : null}
		</section>
	);
}
