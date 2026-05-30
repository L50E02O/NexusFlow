import { Link } from 'react-router-dom';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { stitchScreens } from '../shared/lib/stitch-screens.generated';
import { stitchScreensById } from '../shared/lib/stitch-flow';
import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import { filterStageScreenIds, stitchDomains } from '../shared/lib/stitch-domains';
import { StitchScreenCard } from './stitch-screen-card';
import { StitchHtmlView } from '../shared/components/stitch-html-view';
import { useRouteAnnouncements } from '../shared/components/route-accessibility-shell';

interface StitchFlowProps {
	readonly query?: string;
	readonly domain?: string;
}

export function StitchFlow({ query, domain }: StitchFlowProps) {
	const [currentScreenId, setCurrentScreenId] = useState<string | null>(null);
	const dialogRef = useRef<HTMLDivElement | null>(null);
	const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
	const { announce } = useRouteAnnouncements();

	const visibleStages = useMemo(
		() =>
			stitchDomains
				.map(stage => ({ ...stage, screenIds: filterStageScreenIds(stage, { query, domain }) }))
				.filter(stage => stage.screenIds.length > 0),
			[domain, query],
	);

	const orderedIds = useMemo(() => visibleStages.flatMap(stage => stage.screenIds), [visibleStages]);

	const startFirst = () => {
		const first = orderedIds[0] ?? stitchScreens[0]?.screenId ?? null;
		setCurrentScreenId(first);
		if (first) {
			const screen = stitchRepository.findById(first);
			if (screen) announce(`Abriendo visor de ${screen.title}`);
		}
	};

	const closeViewer = () => {
		setCurrentScreenId(null);
		announce('Visor cerrado');
	};

	useEffect(() => {
		if (currentScreenId && !orderedIds.includes(currentScreenId)) {
			setCurrentScreenId(null);
		}
	}, [currentScreenId, orderedIds]);

	useEffect(() => {
		if (!currentScreenId) {
			lastTriggerRef.current?.focus();
			return;
		}

		dialogRef.current?.focus();
	}, [currentScreenId]);

	const currentScreen = currentScreenId ? stitchRepository.findById(currentScreenId) : null;

	function handleDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (!currentScreenId) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			closeViewer();
			return;
		}

		if (e.key === 'ArrowLeft') {
			const nav = stitchRepository.getNavigation(currentScreenId);
			if (nav.previous) {
				const nextScreen = stitchRepository.findById(nav.previous.screenId);
				setCurrentScreenId(nav.previous.screenId);
				if (nextScreen) announce(`Mostrando ${nextScreen.title}`);
			}
		}

		if (e.key === 'ArrowRight') {
			const nav = stitchRepository.getNavigation(currentScreenId);
			if (nav.next) {
				const nextScreen = stitchRepository.findById(nav.next.screenId);
				setCurrentScreenId(nav.next.screenId);
				if (nextScreen) announce(`Mostrando ${nextScreen.title}`);
			}
		}
	}

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
					<button className="button button-primary" type="button" onClick={startFirst} aria-label="Iniciar flujo Stitch">
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
												type="button"
												onClick={event => {
													lastTriggerRef.current = event.currentTarget;
													setCurrentScreenId(screen.screenId);
													announce(`Abriendo visor de ${screen.title}`);
												}}
												aria-label={`Abrir ${screen.title} en visor`}
												aria-controls="stitch-embedded-viewer"
												aria-expanded={currentScreenId === screen.screenId}
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
				<div
					className="stitch-embedded-viewer"
					id="stitch-embedded-viewer"
					role="dialog"
					aria-modal="true"
					aria-labelledby="stitch-embedded-title"
					tabIndex={-1}
					ref={dialogRef}
					onKeyDown={handleDialogKeyDown}
				>
					<header className="stitch-embedded-header">
						<div>
							<strong id="stitch-embedded-title">{currentScreen.title}</strong>
							<span className="stitch-embedded-stage">{stitchRepository.getStage(currentScreen.screenId)?.title}</span>
						</div>
						<div className="stitch-embedded-controls">
							<button
								className="button button-secondary"
								type="button"
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
								type="button"
								onClick={() => {
									const nav = stitchRepository.getNavigation(currentScreen.screenId);
									if (nav.next) setCurrentScreenId(nav.next.screenId);
								}}
								aria-label="Siguiente"
							>
								→
							</button>
							<button className="button button-danger" type="button" onClick={closeViewer} aria-label="Cerrar visor">
								Cerrar
							</button>
						</div>
					</header>

					<p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
						{currentScreen ? `Visor activo de ${currentScreen.title}` : 'Visor cerrado'}
					</p>

					<StitchHtmlView screen={currentScreen} variant="embedded" className="stitch-iframe" />
				</div>
			)}
		</section>
	);
}
