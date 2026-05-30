import { useCallback, useEffect, useState } from 'react';

import { StitchNativeView } from './stitch-native-view';
import type { StitchScreenEntry } from '../lib/stitch-screens.generated';

type StitchHtmlViewVariant = 'inline' | 'embedded' | 'fullscreen';

interface StitchHtmlViewProps {
	readonly screen: Pick<StitchScreenEntry, 'title' | 'htmlPath' | 'imagePath' | 'summary'>;
	readonly className?: string;
	readonly variant?: StitchHtmlViewVariant;
	readonly title?: string;
}

export function StitchHtmlView({ screen, className, variant = 'inline', title }: StitchHtmlViewProps) {
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
	const iframeTitle = title ?? `Vista de ${screen.title}`;

	const handleLoad = useCallback(() => {
		setStatus('ready');
	}, []);

	const handleError = useCallback(() => {
		setStatus('error');
	}, []);

	useEffect(() => {
		setStatus('loading');
	}, [screen.htmlPath]);

	const rootClass = ['stitch-html-view', `stitch-html-view--${variant}`, className].filter(Boolean).join(' ');

	if (!screen.htmlPath || status === 'error') {
		return (
			<div className={rootClass} data-stitch-status="fallback">
				<div className="stitch-html-view-fallback" role="status">
					<p>
						No se pudo cargar el HTML de Stitch. Ejecuta <code>npm run sync:stitch</code> para exportar los
						archivos en <code>public/stitch</code>.
					</p>
				</div>
				<StitchNativeView screen={screen} />
			</div>
		);
	}

	return (
		<div className={rootClass} data-stitch-status={status}>
			{status === 'loading' ? (
				<p className="stitch-html-view-loading" role="status" aria-live="polite">
					Cargando prototipo…
				</p>
			) : null}

			<iframe
				title={iframeTitle}
				src={screen.htmlPath}
				className="stitch-html-view-frame"
				sandbox="allow-scripts allow-same-origin allow-forms"
				onLoad={handleLoad}
				onError={handleError}
			/>
		</div>
	);
}
