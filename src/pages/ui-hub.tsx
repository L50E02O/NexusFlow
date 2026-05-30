import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { DataReadiness } from '../widgets/data-readiness';
import { StitchShowcase } from '../widgets/stitch-showcase';
import { StitchFlow } from '../widgets/stitch-gallery';

export function UiHubPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const query = searchParams.get('q') ?? '';
	const domain = searchParams.get('domain') ?? '';

	return (
		<main className="app-shell" id="main-content" tabIndex={-1} data-route-announcement="Hub de UI Stitch" aria-labelledby="ui-hub-title">
			<div className="page ui-page">
				<header className="ui-hero">
					<div>
						<p className="eyebrow">Rutas UI</p>
						<h1 className="ui-hero-title" id="ui-hub-title" tabIndex={-1} data-route-focus>Explora cada interfaz Stitch como una ruta real.</h1>
						<p className="ui-hero-copy">
							Desde aquí puedes entrar al flujo completo, abrir cada pantalla exportada y moverte entre
							rutas sin salir de NexusFlow.
						</p>

						<div className="ui-hub-filters" aria-label="Filtros activos">
							{query ? (
								<span className="market-chip">Búsqueda: {query}</span>
							) : null}
							{domain ? <span className="market-chip">Dominio: {domain}</span> : null}
						</div>
					</div>
					<div className="ui-hero-actions">
						<Link className="button button-primary" to="/">
							Volver al home
						</Link>
						<Link className="button button-secondary" to="/ui/4b9d8d751fdb4d4eaf42022fb6ee1d75">
							Abrir primera UI
						</Link>
						{query || domain ? (
							<button className="button button-ghost" onClick={() => setSearchParams({})} type="button">
								Limpiar filtros
							</button>
						) : null}
					</div>
				</header>

				<StitchShowcase query={query} domain={domain} />
				<StitchFlow query={query} domain={domain} />
				<DataReadiness />
			</div>
		</main>
	);
}
