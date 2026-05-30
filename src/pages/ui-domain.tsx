import { Navigate, useParams } from 'react-router-dom';

export function UiDomainPage() {
	const { domain } = useParams<{ domain: string }>();

	if (!domain) {
		return <Navigate to="/ui" replace />;
	}

	return <Navigate to={`/ui?domain=${encodeURIComponent(domain)}`} replace />;
}