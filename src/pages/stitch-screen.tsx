import { Link, Navigate, useParams } from 'react-router-dom';

import { stitchRepository } from '../entities/stitch/api/stitch.repository';

export function StitchScreenPage() {
	const { screenId } = useParams<{ screenId: string }>();

	if (!screenId) {
		return <Navigate to="/ui" replace />;
	}

	const screen = stitchRepository.findById(screenId);

	if (!screen) {
		return <Navigate to="/ui" replace />;
	}

	const stage = stitchRepository.getStage(screenId);
	const navigation = stitchRepository.getNavigation(screenId);

	return (
		<main className="app-shell">
			<div className="page ui-screen-page">
				<header className="ui-screen-toolbar">
					<div className="ui-screen-toolbar-links">
						<Link className="button button-secondary" to="/">
							Home
						</Link>
						<Link className="button button-secondary" to="/ui">
							Hub UI
						</Link>
					</div>
					<p className="ui-screen-crumb">/{screen.folder}</p>
				</header>

				<section className="ui-screen-layout" aria-labelledby="ui-screen-title">
					<article className="ui-screen-copy">
						<p className="eyebrow">Ruta Stitch</p>
						<h1 className="ui-screen-title" id="ui-screen-title">
							{screen.title}
						</h1>
						<p className="ui-screen-summary">{screen.summary}</p>

						<div className="ui-screen-meta" aria-label="Información de la ruta">
							<article>
								<span>Stage</span>
								<strong>{stage ? stage.title : 'Sin etapa'}</strong>
							</article>
							<article>
								<span>ID</span>
								<strong>{screen.screenId}</strong>
							</article>
						</div>

						<div className="ui-screen-actions">
							<a className="button button-primary" href={screen.htmlPath} target="_blank" rel="noreferrer">
								Abrir HTML
							</a>
							<a className="button button-secondary" href={screen.imagePath} target="_blank" rel="noreferrer">
								Ver captura
							</a>
						</div>

						<div className="ui-screen-nav" aria-label="Navegación entre UIs">
							{navigation.previous ? (
								<Link className="button button-secondary" to={`/ui/${navigation.previous.screenId}`}>
									Anterior: {navigation.previous.title}
								</Link>
							) : (
								<span className="ui-screen-nav-placeholder">Sin anterior</span>
							)}
							{navigation.next ? (
								<Link className="button button-secondary" to={`/ui/${navigation.next.screenId}`}>
									Siguiente: {navigation.next.title}
								</Link>
							) : (
								<span className="ui-screen-nav-placeholder">Sin siguiente</span>
							)}
						</div>
					</article>

					<aside className="ui-screen-preview" aria-label={`Vista previa de ${screen.title}`}>
						{screen.htmlPath ? (
							<iframe
								title={`Vista de ${screen.title}`}
								src={screen.htmlPath}
								className="ui-screen-iframe"
								sandbox="allow-scripts allow-same-origin allow-forms"
							/>
						) : (
							<img src={screen.imagePath} alt={`Captura de ${screen.title}`} />
						)}
					</aside>
				</section>
			</div>
		</main>
	);
}
