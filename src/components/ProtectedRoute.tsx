import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  element: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const location = useLocation();
  const auth = useAuth();
  
  // If still loading, show a simple spinner
  if (auth.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // For routes that require authentication
  if (requireAuth && !auth.isAuthenticated) {
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // For login/register routes when already authenticated
  if (!requireAuth && auth.isAuthenticated) {
    // Redirect to appropriate dashboard based on user role
    const getDashboardPath = (role: UserRole) => {
      switch (role) {
        case 'admin': return '/admin/dashboard';
        case 'project_manager': return '/manager/dashboard';
        case 'client': return '/client/dashboard';
        case 'qa_engineer': return '/qa/dashboard';
        case 'designer': return '/designer/tasks';
        default: return '/developer/tasks';
      }
    };

    if (auth.user) {
      return <Navigate to={getDashboardPath(auth.user.role as UserRole)} replace />;
    }
    return <Navigate to="/debug" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && auth.user) {
    if (!allowedRoles.includes(auth.user.role as UserRole)) {
      // Redirect to unauthorized page with a message about the required role
      return <Navigate to="/unauthorized" state={{ 
        message: `This page requires one of the following roles: ${allowedRoles.join(', ')}`,
        currentRole: auth.user.role
      }} replace />;
    }
  }

  return <>{element}</>;
};

export default ProtectedRoute; 