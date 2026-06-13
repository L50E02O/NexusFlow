import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Icon } from '@/shared/ui/Icon';
import { useAuth } from '@/shared/context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
	const { session, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-surface" role="status">
				<Icon name="progress_activity" className="animate-spin text-primary text-[40px]" />
			</div>
		);
	}

	if (!session) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
