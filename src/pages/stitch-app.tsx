import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { stitchRepository } from '../entities/stitch/api/stitch.repository';
import { StitchInteractiveView } from '../shared/components/stitch-interactive-view';
import { defaultStitchScreenId } from '../shared/lib/stitch-action-registry';
import { useRouteAnnouncements } from '../shared/components/route-accessibility-shell';

export function StitchAppPage() {
	const { screenId: routeScreenId } = useParams<{ screenId?: string }>();
	const navigate = useNavigate();
	const { announce } = useRouteAnnouncements();
	const [backStack, setBackStack] = useState<string[]>([]);
	const [toast, setToast] = useState<string | null>(null);

	const currentScreenId = routeScreenId ?? defaultStitchScreenId;
	const screen = stitchRepository.findById(currentScreenId);

	useEffect(() => {
		if (!toast) return;
		const timer = window.setTimeout(() => setToast(null), 4200);
		return () => window.clearTimeout(timer);
	}, [toast]);

	const syncUrl = useCallback(
		(screenId: string, replace = false) => {
			const path = screenId === defaultStitchScreenId ? '/' : `/s/${screenId}`;
			navigate(path, { replace });
		},
		[navigate],
	);

	const goToScreen = useCallback(
		(screenId: string) => {
			const next = stitchRepository.findById(screenId);
			if (!next || screenId === currentScreenId) return;

			setBackStack(prev => [...prev, currentScreenId]);
			syncUrl(screenId);
			announce(`Navegando a ${next.title}`);
		},
		[announce, currentScreenId, syncUrl],
	);

	const goBack = useCallback(() => {
		setBackStack(prev => {
			if (prev.length === 0) return prev;
			const nextStack = prev.slice(0, -1);
			const previousId = prev[prev.length - 1];
			syncUrl(previousId, true);
			const previous = stitchRepository.findById(previousId);
			if (previous) announce(`Volviendo a ${previous.title}`);
			return nextStack;
		});
	}, [announce, syncUrl]);

	const showToast = useCallback(
		(message: string) => {
			setToast(message);
			announce(message);
		},
		[announce],
	);

	const stageLabel = useMemo(() => stitchRepository.getStage(currentScreenId)?.title, [currentScreenId]);

	if (!screen) {
		return (
			<main className="stitch-app" id="main-content" tabIndex={-1}>
				<p>Pantalla no encontrada.</p>
			</main>
		);
	}

	return (
		<main
			className="stitch-app"
			id="main-content"
			tabIndex={-1}
			data-route-announcement={screen.title}
			aria-label="NexusFlow"
		>
			<div className="stitch-app-chrome">
				<span className="stitch-app-brand">NexusFlow</span>
				{stageLabel ? <span className="stitch-app-stage">{stageLabel}</span> : null}
				<div className="stitch-app-chrome-actions">
					<button
						className="button button-ghost stitch-app-back"
						type="button"
						onClick={goBack}
						disabled={backStack.length === 0}
					>
						Atrás
					</button>
				</div>
			</div>

			<StitchInteractiveView
				key={currentScreenId}
				screen={screen}
				screenId={currentScreenId}
				onNavigate={goToScreen}
				onBack={goBack}
				onToast={showToast}
			/>

			{toast ? (
				<div className="stitch-app-toast" role="status" aria-live="polite">
					{toast}
				</div>
			) : null}
		</main>
	);
}
