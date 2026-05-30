import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage } from '../../pages/home';
import { StitchScreenPage } from '../../pages/stitch-screen';
import { UiHubPage } from '../../pages/ui-hub';

export function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/ui" element={<UiHubPage />} />
			<Route path="/ui/:screenId" element={<StitchScreenPage />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
