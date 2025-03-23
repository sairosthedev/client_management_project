import React, { createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import DeveloperLayout from './layouts/DeveloperLayout';
import ProjectManagerLayout from './layouts/ProjectManagerLayout';
import QAEngineerLayout from './layouts/QAEngineerLayout';
import DesignerLayout from './layouts/DesignerLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManagerDashboard from './pages/manager/Dashboard';
import DeveloperPage from './pages/developer/DeveloperPage';
import ProfilePage from './pages/developer/ProfilePage';
import TimeTrackingPage from './pages/developer/TimeTrackingPage';
import TeamPage from './pages/developer/TeamPage';
import ProjectsPage from './pages/developer/ProjectsPage';
import TaskBoard from './pages/manager/TaskBoard';
import Calendar from './pages/manager/Calendar';
import Timesheet from './pages/manager/Timesheet';
import Reports from './pages/manager/Reports';
import { UserRole, RolePermissions, DEFAULT_ROLE_PERMISSIONS } from './types';
import Users from './pages/admin/Users';
import Security from './pages/admin/Security';
import System from './pages/admin/System';
import Settings from './pages/admin/Settings';
import Clients from './pages/admin/Clients';
import QADashboard from './pages/qa/Dashboard';
import TestCases from './pages/qa/TestCases';
import ClientProjects from './pages/client/Projects';
import ClientDashboard from './pages/client/Dashboard';
import Documents from './pages/client/Documents';
import Messages from './pages/client/Messages';
import Invoices from './pages/client/Invoices';
import Profile from './pages/client/Profile';

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

// Role-based route protection component
const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  allowedRoles: UserRole[];
  user: UserContextType;
}> = ({ element }) => {
  // Temporarily allow all routes for testing
  return element;
};

const App: React.FC = () => {
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
      ...DEFAULT_ROLE_PERMISSIONS.designer,
      ...DEFAULT_ROLE_PERMISSIONS.client
    }
  };

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

  return (
    <Router>
      <UserContext.Provider value={currentUser}>
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminLayout />}
                allowedRoles={['admin']}
                user={currentUser}
              />
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="analytics" element={<Reports />} />
            <Route path="security" element={<Security />} />
            <Route path="system" element={<System />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Developer Routes */}
          <Route
            path="/developer"
            element={
              <ProtectedRoute
                element={<DeveloperLayout />}
                allowedRoles={['developer']}
                user={currentUser}
              />
            }
          >
            <Route index element={<Navigate to="/developer/tasks" replace />} />
            <Route path="tasks" element={<DeveloperPage />} />
            <Route path="time" element={<TimeTrackingPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Project Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute
                element={<ProjectManagerLayout />}
                allowedRoles={['project_manager']}
                user={currentUser}
              />
            }
          >
            <Route index element={<Navigate to="/manager/dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="tasks" element={<TaskBoard />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="timesheet" element={<Timesheet />} />
            <Route path="reports" element={<Reports />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Client Routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute
                element={<ClientLayout />}
                allowedRoles={['client']}
                user={currentUser}
              />
            }
          >
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="projects" element={<ClientProjects />} />
            <Route path="documents" element={<Documents />} />
            <Route path="messages" element={<Messages />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* QA Engineer Routes */}
          <Route
            path="/qa"
            element={
              <ProtectedRoute
                element={<QAEngineerLayout />}
                allowedRoles={['qa_engineer']}
                user={currentUser}
              />
            }
          >
            <Route index element={<Navigate to="/qa/dashboard" replace />} />
            <Route path="dashboard" element={<QADashboard />} />
            <Route path="tests" element={<TestCases />} />
            <Route path="bugs" element={<TestCases />} />
            <Route path="reports" element={<Reports />} />
            <Route path="metrics" element={<Reports />} />
            <Route path="issues" element={<TestCases />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Designer Routes */}
          <Route
            path="/designer"
            element={
              <ProtectedRoute
                element={<DesignerLayout />}
                allowedRoles={['designer']}
                user={currentUser}
              />
            }
          >
            <Route index element={<Navigate to="/designer/tasks" replace />} />
            {/* Add Designer specific routes here */}
          </Route>

          {/* Redirect root based on user role */}
          <Route
            path="/"
            element={<Navigate to={getDashboardPath(currentUser.role)} replace />}
          />

          {/* Catch all route - redirect to appropriate dashboard */}
          <Route
            path="*"
            element={<Navigate to={getDashboardPath(currentUser.role)} replace />}
          />
              </Routes>
      </UserContext.Provider>
    </Router>
  );
};

export default App;