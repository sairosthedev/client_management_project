import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

interface DashboardRedirectProps {
  role: UserRole;
}

const DashboardRedirect: React.FC<DashboardRedirectProps> = ({ role }) => {
  const getDashboardPath = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'project_manager':
        return '/manager/dashboard';
      case 'client':
        return '/client/projects';
      case 'qa_engineer':
        return '/qa/dashboard';
      case 'designer':
        return '/designer/tasks';
      default:
        return '/developer/tasks';
    }
  };

  return <Navigate to={getDashboardPath(role)} replace />;
};

export default DashboardRedirect; 