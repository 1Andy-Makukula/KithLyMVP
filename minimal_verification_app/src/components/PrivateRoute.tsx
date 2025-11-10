import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  roles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading spinner here if you want
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = user.roles?.some(role => roles.includes(role));

  if (!hasRequiredRole) {
    // Redirect to a more appropriate page, e.g., an unauthorized page or homepage
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
