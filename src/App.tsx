import React, { createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLayout from './components/layouts/AdminLayout';
import DeveloperLayout from './components/layouts/DeveloperLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ClientsPage from './pages/admin/Clients';
import ProjectsPage from './pages/admin/Projects';
import TasksPage from './pages/admin/Tasks';
import SettingsPage from './pages/admin/Settings';
import DeveloperPage from './pages/developer/DeveloperPage';
import ProfilePage from './pages/developer/ProfilePage';
import TimeTrackingPage from './pages/developer/TimeTrackingPage';

interface UserContextType {
  role: 'admin' | 'developer';
  email: string;
  name: string;
  id?: string;
}

export const UserContext = createContext<UserContextType>({
  role: 'admin',
  email: 'admin@example.com',
  name: 'Admin User'
});

// Role-based route protection component
const ProtectedRoute: React.FC<{
  element: React.ReactElement;
  allowedRoles: UserContextType['role'][];
  user: UserContextType;
}> = ({ element, allowedRoles, user }) => {
  const location = useLocation();

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return element;
};

const App: React.FC = () => {
  // Mock user - in a real app, this would come from authentication
  const currentUser: UserContextType = {
    role: 'developer',
    email: 'maria@example.com',
    name: 'Maria Garcia',
    id: '1'
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
            <Route index element={<AdminDashboard />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="settings" element={<SettingsPage />} />
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
            <Route index element={<DeveloperPage />} />
            <Route path="tasks" element={<DeveloperPage />} />
            <Route path="time-tracking" element={<TimeTrackingPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Redirect root based on user role */}
          <Route
            path="/"
            element={
              <Navigate
                to={currentUser.role === 'admin' ? '/admin' : '/developer'}
                replace
              />
            }
          />

          {/* Catch all route - redirect to appropriate dashboard */}
          <Route
            path="*"
            element={
              <Navigate
                to={currentUser.role === 'admin' ? '/admin' : '/developer'}
                replace
              />
            }
          />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
};

export default App;