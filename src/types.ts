export type UserRole = 'admin' | 'developer' | 'project_manager' | 'client' | 'qa_engineer' | 'designer';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface TeamMemberType extends BaseUser {
  skills: string[];
  projects: string[];
}

export interface ProjectManagerType extends TeamMemberType {
  managedProjects: string[];
  department: string;
}

export interface ClientType extends BaseUser {
  company: string;
  projects: string[];
  contactNumber?: string;
}

export interface QAEngineerType extends TeamMemberType {
  testCases: number;
  bugsReported: number;
  testingFrameworks: string[];
}


// Permissions for different roles
export interface RolePermissions {
  canCreateProject: boolean;
  canAssignTasks: boolean;
  canApproveWork: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canEditSettings: boolean;
}

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  admin: {
    canCreateProject: true,
    canAssignTasks: true,
    canApproveWork: true,
    canViewReports: true,
    canManageUsers: true,
    canEditSettings: true
  },
  
  developer: {
    canCreateProject: false,
    canAssignTasks: false,
    canApproveWork: false,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false
  },

  project_manager: {
    canCreateProject: true,
    canAssignTasks: true,
    canApproveWork: true,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false
  },

  client: {
    canCreateProject: false,
    canAssignTasks: false,
    canApproveWork: true,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false
  },

  qa_engineer: {
    canCreateProject: false,
    canAssignTasks: false,
    canApproveWork: true,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false
  },

  designer: {
    canCreateProject: false,
    canAssignTasks: false,
    canApproveWork: false,
    canViewReports: false,
    canManageUsers: false,
    canEditSettings: false
  }
}; 