import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import { StitchAppPage } from '../../pages/stitch-app';

function LegacyUiScreenRedirect() {
	const { screenId } = useParams<{ screenId: string }>();
	return <Navigate to={screenId ? `/s/${screenId}` : '/'} replace />;
}

export function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<StitchAppPage />} />
			<Route path="/s/:screenId" element={<StitchAppPage />} />
			<Route path="/comercio" element={<Navigate to="/" replace />} />
			<Route path="/ui" element={<Navigate to="/" replace />} />
			<Route path="/ui/domain/:domain" element={<Navigate to="/" replace />} />
			<Route path="/ui/:screenId" element={<LegacyUiScreenRedirect />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
