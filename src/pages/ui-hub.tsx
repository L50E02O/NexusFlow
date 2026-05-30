import { Link } from 'react-router-dom';

import { DataReadiness } from '../widgets/data-readiness';
import { StitchFlow } from '../widgets/stitch-gallery';

export function UiHubPage() {
	return (
		<main className="app-shell">
			<div className="page ui-page">
				<header className="ui-hero">
					<div>
						<p className="eyebrow">Rutas UI</p>
						<h1 className="ui-hero-title">Explora cada interfaz Stitch como una ruta real.</h1>
						<p className="ui-hero-copy">
							Desde aquí puedes entrar al flujo completo, abrir cada pantalla exportada y moverte entre
							rutas sin salir de NexusFlow.
						</p>
					</div>
					<div className="ui-hero-actions">
						<Link className="button button-primary" to="/">
							Volver al home
						</Link>
						<Link className="button button-secondary" to="/ui/4b9d8d751fdb4d4eaf42022fb6ee1d75">
							Abrir primera UI
						</Link>
					</div>
				</header>

				<StitchFlow />
				<DataReadiness />
			</div>
		</main>
	);
}
