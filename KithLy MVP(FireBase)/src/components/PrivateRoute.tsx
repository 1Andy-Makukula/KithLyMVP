import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// This component protects routes that should only be accessible to shop owners.
export const PrivateRoute: React.FC<{ roles: string[] }> = ({ roles }) => {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper spinner component later
  }

  const userRoles = Object.keys(profile?.roles || {});
  const hasRole = roles.some(role => userRoles.includes(role));

  if (profile && hasRole) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export const ShopOwnerRoute: React.FC = () => {
  const { isShopOwner, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper spinner component later
  }

  if (isShopOwner) {
    return <Outlet />;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
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
