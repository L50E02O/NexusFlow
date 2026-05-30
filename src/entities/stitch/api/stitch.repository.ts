import { stitchFlowStages } from '../../../shared/lib/stitch-flow';
import { stitchScreens } from '../../../shared/lib/stitch-screens.generated';

const orderedScreenIds = stitchFlowStages.flatMap(stage => stage.screenIds);

const screensById = new Map(stitchScreens.map(screen => [screen.screenId, screen] as const));

const stageByScreenId = new Map(
	stitchFlowStages.flatMap(stage => stage.screenIds.map(screenId => [screenId, stage] as const)),
);

export const stitchRepository = {
	listScreens() {
		return stitchScreens;
	},
	findById(screenId: string) {
		return screensById.get(screenId) ?? null;
	},
	getStage(screenId: string) {
		return stageByScreenId.get(screenId) ?? null;
	},
	getNavigation(screenId: string) {
		const currentIndex = orderedScreenIds.indexOf(screenId);

		return {
			previous: currentIndex > 0 ? screensById.get(orderedScreenIds[currentIndex - 1]) ?? null : null,
			next:
				currentIndex >= 0 && currentIndex < orderedScreenIds.length - 1
					? screensById.get(orderedScreenIds[currentIndex + 1]) ?? null
					: null,
		};
	},
} as const;
