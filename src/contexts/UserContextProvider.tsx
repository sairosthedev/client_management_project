import React, { createContext } from 'react';
import { UserRole, RolePermissions, DEFAULT_ROLE_PERMISSIONS } from '../types';

interface UserContextType {
  role: UserRole;
  email: string;
  name: string;
  id?: string;
  permissions: RolePermissions;
}

export const UserContext = createContext<UserContextType>({
  role: 'admin',
  email: 'admin@example.com',
  name: 'Admin User',
  permissions: DEFAULT_ROLE_PERMISSIONS.admin
});

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  // Modified user with all roles for testing
  const currentUser: UserContextType = {
    role: 'admin', // Set to admin to have highest level access
    email: 'admin@example.com',
    name: 'Admin User',
    id: '1',
    permissions: {
      ...DEFAULT_ROLE_PERMISSIONS.admin,
      ...DEFAULT_ROLE_PERMISSIONS.project_manager,
      ...DEFAULT_ROLE_PERMISSIONS.developer,
      ...DEFAULT_ROLE_PERMISSIONS.qa_engineer,
      ...DEFAULT_ROLE_PERMISSIONS.client
    }
  };

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
}; 