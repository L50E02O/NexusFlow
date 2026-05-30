import { Link } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';

import { stitchScreens } from '../shared/lib/stitch-screens.generated';
import { stitchScreensById } from '../shared/lib/stitch-flow';
import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import { filterStageScreenIds, stitchDomains } from '../shared/lib/stitch-domains';
import { StitchScreenCard } from './stitch-screen-card';

interface StitchFlowProps {
	readonly query?: string;
	readonly domain?: string;
}

export function StitchFlow({ query, domain }: StitchFlowProps) {
	const [currentScreenId, setCurrentScreenId] = useState<string | null>(null);

	const visibleStages = useMemo(
		() =>
			stitchDomains
				.map(stage => ({ ...stage, screenIds: filterStageScreenIds(stage, { query, domain }) }))
				.filter(stage => stage.screenIds.length > 0),
			[domain, query],
	);

	const orderedIds = useMemo(() => visibleStages.flatMap(stage => stage.screenIds), [visibleStages]);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (!currentScreenId) return;
			if (e.key === 'ArrowLeft') {
				const nav = stitchRepository.getNavigation(currentScreenId);
				if (nav.previous) setCurrentScreenId(nav.previous.screenId);
			}
			if (e.key === 'ArrowRight') {
				const nav = stitchRepository.getNavigation(currentScreenId);
				if (nav.next) setCurrentScreenId(nav.next.screenId);
			}
			if (e.key === 'Escape') {
				setCurrentScreenId(null);
			}
		}

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [currentScreenId]);

	const startFirst = () => {
		const first = orderedIds[0] ?? stitchScreens[0]?.screenId ?? null;
		setCurrentScreenId(first);
	};

	const closeViewer = () => setCurrentScreenId(null);

	useEffect(() => {
		if (currentScreenId && !orderedIds.includes(currentScreenId)) {
			setCurrentScreenId(null);
		}
	}, [currentScreenId, orderedIds]);

	const currentScreen = currentScreenId ? stitchRepository.findById(currentScreenId) : null;

	return (
		<section className="section stitch-flow" id="flujo-app" aria-labelledby="stitch-flow-title">
			<div className="section-heading">
				<div>
					<p className="eyebrow">Flujo Stitch</p>
					<h2 id="stitch-flow-title">Las pantallas Stitch ya están conectadas al recorrido de la app.</h2>
				</div>
				<p>
					Cada pantalla exportada vive en `public/stitch` y ahora se agrupa por etapas para que el usuario cargue
					el home y siga el flujo sin perder contexto. Usa "Iniciar flujo" para una experiencia embebida.
				</p>
				<div className="stitch-flow-actions">
					<button className="button button-primary" onClick={startFirst} aria-label="Iniciar flujo Stitch">
						Iniciar flujo
					</button>
					<Link className="button button-secondary" to="/ui">
						Ver hub completo
					</Link>
				</div>
			</div>

			<div className="flow-summary" aria-label="Resumen del flujo Stitch">
				<article>
					<strong>{orderedIds.length}</strong>
					<span>pantallas conectadas</span>
				</article>
				<article>
					<strong>{visibleStages.length}</strong>
					<span>etapas del recorrido</span>
				</article>
				<article>
					<strong>BD</strong>
					<span>lista para integrar la siguiente capa</span>
				</article>
			</div>

			<div className="flow-stage-grid">
				{visibleStages.map(stage => (
					<article className="flow-stage-card" key={stage.anchor}>
						<span>{stage.title}</span>
						<h3>{stage.description}</h3>
						<div className="flow-stage-screens" aria-label={stage.title}>
							{stage.screenIds.map(screenId => {
								const screen = stitchScreensById.get(screenId);

								if (!screen) return null;

								return (
									<StitchScreenCard
										key={screen.screenId}
										screen={screen}
										stageLabel={stage.title}
										viewerAction={
											<button
												className="button button-ghost"
												onClick={() => setCurrentScreenId(screen.screenId)}
												aria-label={`Abrir ${screen.title} en visor`}
											>
												Abrir en visor
											</button>
										}
									/>
								);
							})}
						</div>
					</article>
				))}
			</div>

			{visibleStages.length === 0 ? (
				<div className="empty-state" role="status" aria-live="polite">
					<h3>No se encontraron coincidencias en el flujo</h3>
					<p>Quita el filtro actual o usa otra búsqueda para ver nuevamente las pantallas Stitch disponibles.</p>
				</div>
			) : null}

			{currentScreen && (
				<div className="stitch-embedded-viewer" role="dialog" aria-label={`Visor ${currentScreen.title}`}>
					<header className="stitch-embedded-header">
						<div>
							<strong>{currentScreen.title}</strong>
							<span className="stitch-embedded-stage">{stitchRepository.getStage(currentScreen.screenId)?.title}</span>
						</div>
						<div className="stitch-embedded-controls">
							<button
								className="button button-secondary"
								onClick={() => {
									const nav = stitchRepository.getNavigation(currentScreen.screenId);
									if (nav.previous) setCurrentScreenId(nav.previous.screenId);
								}}
								aria-label="Anterior"
							>
								←
							</button>
							<button
								className="button button-secondary"
								onClick={() => {
									const nav = stitchRepository.getNavigation(currentScreen.screenId);
									if (nav.next) setCurrentScreenId(nav.next.screenId);
								}}
								aria-label="Siguiente"
							>
								→
							</button>
							<button className="button button-danger" onClick={closeViewer} aria-label="Cerrar visor">
								Cerrar
							</button>
						</div>
					</header>

					<iframe
						title={currentScreen.title}
						src={currentScreen.htmlPath}
						className="stitch-iframe"
						sandbox="allow-scripts allow-same-origin allow-forms"
					/>
				</div>
			)}
		</section>
	);
}
