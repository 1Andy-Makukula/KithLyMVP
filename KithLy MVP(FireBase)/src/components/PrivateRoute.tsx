import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  roles?: string[];
}

export function PrivateRoute({ roles }: PrivateRouteProps) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && userData) {
    const hasRequiredRole = roles.some(role => userData.roles?.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

export function ShopOwnerRoute() {
  return <PrivateRoute roles={['shop_owner']} />;
}
