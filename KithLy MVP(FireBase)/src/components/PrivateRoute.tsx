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
};
