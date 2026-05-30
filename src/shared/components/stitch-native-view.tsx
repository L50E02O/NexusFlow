import type { StitchScreenEntry } from '../lib/stitch-screens.generated';

interface StitchNativeViewProps {
	readonly screen: Pick<StitchScreenEntry, 'title' | 'imagePath' | 'htmlPath' | 'summary'>;
	readonly className?: string;
}

export function StitchNativeView({ screen, className }: StitchNativeViewProps) {
	const rootClass = ['stitch-native-view', className].filter(Boolean).join(' ');

	return (
		<figure className={rootClass}>
			<img src={screen.imagePath} alt={`Captura de ${screen.title}`} loading="lazy" />
			<figcaption>
				<p>{screen.summary}</p>
				<a className="button button-secondary" href={screen.htmlPath} target="_blank" rel="noreferrer">
					Abrir HTML exportado
				</a>
			</figcaption>
		</figure>
	);
}
