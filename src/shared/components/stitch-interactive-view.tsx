import { useCallback, useEffect, useRef, useState } from 'react';

import { wireStitchDocument } from '../lib/stitch-bridge';
import { StitchNativeView } from './stitch-native-view';
import type { StitchScreenEntry } from '../lib/stitch-screens.generated';

interface StitchInteractiveViewProps {
	readonly screen: StitchScreenEntry;
	readonly screenId: string;
	readonly onNavigate: (screenId: string) => void;
	readonly onBack: () => void;
	readonly onToast: (message: string) => void;
}

export function StitchInteractiveView({
	screen,
	screenId,
	onNavigate,
	onBack,
	onToast,
}: StitchInteractiveViewProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
	const [wiredCount, setWiredCount] = useState(0);

	const runBridge = useCallback(() => {
		const doc = iframeRef.current?.contentDocument;
		if (!doc?.body) return 0;

		const count = wireStitchDocument(doc, { screenId }, { onNavigate, onBack, onToast });
		setWiredCount(count);
		setStatus('ready');
		return count;
	}, [onBack, onNavigate, onToast, screenId]);

	const handleLoad = useCallback(() => {
		runBridge();
	}, [runBridge]);

	useEffect(() => {
		setStatus('loading');
		setWiredCount(0);
	}, [screen.htmlPath, screenId]);

	useEffect(() => {
		const retry = window.setTimeout(runBridge, 500);
		return () => window.clearTimeout(retry);
	}, [runBridge, screen.htmlPath]);

	useEffect(() => {
		const doc = iframeRef.current?.contentDocument;
		if (!doc?.body || status !== 'ready') return;

		const observer = new MutationObserver(() => {
			runBridge();
		});

		observer.observe(doc.body, { childList: true, subtree: true });
		return () => observer.disconnect();
	}, [runBridge, status, screen.htmlPath]);

	if (!screen.htmlPath) {
		return <StitchNativeView screen={screen} className="stitch-app-fallback" />;
	}

	return (
		<div className="stitch-interactive-view" data-stitch-status={status}>
			{status === 'loading' ? (
				<p className="stitch-app-loading" role="status" aria-live="polite">
					Cargando {screen.title}…
				</p>
			) : null}

			<p className="sr-only" aria-live="polite">
				{wiredCount > 0
					? `${wiredCount} controles conectados en esta pantalla.`
					: 'Pantalla cargada. Usa los botones del diseño para navegar.'}
			</p>

			<iframe
				ref={iframeRef}
				title={screen.title}
				src={screen.htmlPath}
				className="stitch-interactive-frame"
				sandbox="allow-scripts allow-same-origin allow-forms"
				onLoad={handleLoad}
				onError={() => setStatus('error')}
			/>

			{status === 'error' ? (
				<div className="stitch-app-fallback-panel" role="alert">
					<p>
						No se encontró el HTML. Ejecuta <code>npm run sync:stitch</code> con credenciales de Google Stitch.
					</p>
					<StitchNativeView screen={screen} />
				</div>
			) : null}
		</div>
	);
}
