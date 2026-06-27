import { Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { Icon } from '@/shared/ui/Icon';

export function MerchantHomeRedirect() {
  const { session, loading, isMerchant } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface" role="status">
        <Icon name="progress_activity" className="animate-spin text-primary text-[40px]" />
      </div>
    );
  }

  if (session && isMerchant) {
    return <Navigate to="/merchant" replace />;
  }

  return <HomePage />;
}
