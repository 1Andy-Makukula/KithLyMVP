import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Placeholder for authentication logic
const useAuth = () => {
  // In a real application, you would get the user from your authentication provider
  // and check their roles.
  const user = { roles: ['customer'] }; // Mock user
  return { user };
};

interface PrivateRouteProps {
  roles: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = user.roles.some(role => roles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
