import { UserRole } from '../types';

export const getDashboardPath = (role: UserRole): string => {
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
    case 'developer':
      return '/developer/tasks';
    default:
      return '/developer/tasks';
  }
}; 