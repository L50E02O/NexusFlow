import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

import type { StitchScreenEntry } from '../shared/lib/stitch-screens.generated';

interface StitchScreenCardProps {
	screen: StitchScreenEntry;
	stageLabel?: string;
	viewerAction?: ReactNode;
}

export function StitchScreenCard({ screen, stageLabel, viewerAction }: StitchScreenCardProps) {
	return (
		<article className="stitch-screen-card">
			<div className="stitch-screen-card-topline">
				<span className="atlas-chip">{screen.kind}</span>
				{stageLabel ? <span className="atlas-folder">{stageLabel}</span> : <span className="atlas-folder">/{screen.folder}</span>}
			</div>
			<h4>{screen.title}</h4>
			<p>{screen.summary}</p>
			<p className="atlas-screen-id">/{screen.folder}</p>

			<div className="atlas-card-actions">
				<a className="button button-primary" href={screen.htmlPath} target="_blank" rel="noreferrer">
					Ver HTML
				</a>
				<Link className="button button-secondary" to={`/ui/${screen.screenId}`}>
					Abrir vista
				</Link>
				<a className="button button-secondary" href={screen.imagePath} target="_blank" rel="noreferrer">
					Ver captura
				</a>
				{viewerAction}
			</div>
		</article>
	);
}