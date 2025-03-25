import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import AuthPage from './pages/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

// Simple debug component to help troubleshoot
const DebugPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>Debugging information:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Current URL: {window.location.href}</li>
          <li>React Router is {typeof Routes === 'undefined' ? 'NOT ' : ''}available</li>
          <li>Local Storage: {localStorage.getItem('user') ? 'User found' : 'No user found'}</li>
        </ul>
      </div>
    </div>
  );
};

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

const App: React.FC = () => {
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  
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

  // Add error boundary
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Caught error:', event.error);
      setErrorInfo(event.error?.message || 'An error occurred during rendering');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // If we have a rendering error, show a simple error page
  if (errorInfo) {
    return (
      <div className="p-8 bg-red-50 min-h-screen">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h1>
        <p className="mb-4">{errorInfo}</p>
        <button 
          onClick={() => window.location.href = '/debug'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Debug Page
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <UserContext.Provider value={currentUser}>
          <Routes>
            {/* Landing Page - Public Homepage */}
            <Route path="/" element={<LandingPage />} />

            {/* Debug Route */}
            <Route path="/debug" element={<DebugPage />} />

            {/* Auth Routes */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  element={<AdminLayout />}
                  allowedRoles={['admin']}
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
                />
              }
            >
              <Route index element={<Navigate to="/designer/tasks" replace />} />
              {/* Add Designer specific routes here */}
            </Route>

            {/* Not found page */}
            <Route path="/not-found" element={<NotFoundPage />} />

            {/* Catch all route - redirect to 404 */}
            <Route
              path="*"
              element={<Navigate to="/not-found" replace />}
            />
          </Routes>
        </UserContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;