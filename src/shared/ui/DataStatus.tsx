import type { ReactNode } from 'react';
import { Icon } from '@/shared/ui/Icon';

type DataStatusProps = {
	loading: boolean;
	error: string | null;
	children: ReactNode;
	emptyMessage?: string;
	isEmpty?: boolean;
};

export function DataStatus({ loading, error, children, emptyMessage, isEmpty }: DataStatusProps) {
	if (loading) {
		return (
			<div className="flex items-center justify-center gap-sm p-md text-on-surface-variant" role="status">
				<Icon name="progress_activity" className="animate-spin text-primary" />
				<span className="font-label-md">Cargando...</span>
			</div>
		);
	}

	if (error) {
		return (
			<p className="text-error font-label-md p-md bg-error-container/20 rounded-xl border border-error/20" role="alert">
				{error}
			</p>
		);
	}

	if (isEmpty) {
		return (
			<p className="text-on-surface-variant font-label-md p-md">
				{emptyMessage ?? 'No hay datos disponibles.'}
			</p>
		);
	}

	return <>{children}</>;
}
