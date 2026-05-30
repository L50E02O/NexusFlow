import { stitchFlowStages, stitchScreensById } from './stitch-flow';

export interface StitchDomainView {
	readonly anchor: string;
	readonly title: string;
	readonly description: string;
	readonly screenIds: readonly string[];
}

export interface StitchScreenSearchCriteria {
	readonly query?: string;
	readonly domain?: string;
}

export const stitchDomains: StitchDomainView[] = stitchFlowStages.map(stage => ({
	anchor: stage.anchor,
	title: stage.title,
	description: stage.description,
	screenIds: stage.screenIds,
}));

export function normalizeSearchText(value: string) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();
}

export function matchesStitchScreen(screenId: string, criteria: StitchScreenSearchCriteria) {
	const screen = stitchScreensById.get(screenId);

	if (!screen) return false;

	if (criteria.domain && criteria.domain !== 'all') {
		const domain = stitchDomains.find(item => item.anchor === criteria.domain);
		if (!domain || !domain.screenIds.includes(screenId)) return false;
	}

	const query = normalizeSearchText(criteria.query ?? '');
	if (!query) return true;

	const searchable = normalizeSearchText(
		[screen.title, screen.summary, screen.folder, screen.kind, screen.screenId].join(' '),
	);

	return searchable.includes(query);
}

export function filterStageScreenIds(stage: StitchDomainView, criteria: StitchScreenSearchCriteria) {
	return stage.screenIds.filter(screenId => matchesStitchScreen(screenId, criteria));
}
