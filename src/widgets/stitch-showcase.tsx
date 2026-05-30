import { Link } from 'react-router-dom';

import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import { filterStageScreenIds, stitchDomains } from '../shared/lib/stitch-domains';
import { StitchScreenCard } from './stitch-screen-card';

interface StitchShowcaseProps {
	readonly query?: string;
	readonly domain?: string;
}


export function StitchShowcase({ query, domain }: StitchShowcaseProps) {
	const visibleDomains = stitchDomains
		.map(stage => ({ ...stage, screenIds: filterStageScreenIds(stage, { query, domain }) }))
		.filter(stage => stage.screenIds.length > 0);

	return (
		<section className="section stitch-showcase" id="ui" aria-labelledby="stitch-showcase-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Vistas Stitch</p>
					<h2 id="stitch-showcase-title">Las UIs exportadas ya están agrupadas por dominio del ecommerce.</h2>
				</div>
				<p>
					Cada grupo responde a una etapa del recorrido. Puedes abrir la ruta completa, filtrar por dominio o
					buscar por texto para encontrar una vista Stitch concreta sin recorrer todo el catálogo.
				</p>
			</div>

			<div className="stitch-domain-summary" aria-label="Dominios Stitch visibles">
				{visibleDomains.map(domainItem => (
					<article className="stitch-domain-pill" key={domainItem.anchor}>
						<span>{domainItem.title}</span>
						<strong>{domainItem.screenIds.length}</strong>
					</article>
				))}
			</div>

			<div className="stitch-showcase-grid" aria-label="Dominios Stitch destacados">
				{visibleDomains.map(domainItem => (
					<article className="stitch-domain-card" key={domainItem.anchor} id={domainItem.anchor}>
						<div className="stitch-domain-card-header">
							<div>
								<p className="eyebrow">{domainItem.title}</p>
								<h3>{domainItem.description}</h3>
							</div>
							<Link className="button button-secondary" to={`/ui/domain/${domainItem.anchor}`}>
								Filtrar dominio
							</Link>
						</div>

						<div className="stitch-domain-card-grid">
							{domainItem.screenIds.map(screenId => {
								const screen = stitchRepository.findById(screenId);

								if (!screen) return null;

								return <StitchScreenCard key={screen.screenId} screen={screen} stageLabel={domainItem.title} />;
							})}
						</div>
					</article>
				))}
			</div>

			{visibleDomains.length === 0 ? (
				<div className="empty-state" role="status" aria-live="polite">
					<h3>No hay UIs Stitch que coincidan</h3>
					<p>Prueba otro término de búsqueda o limpia el filtro de dominio para volver a ver todas las vistas.</p>
				</div>
			) : null}

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