import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import DeveloperLayout from '../layouts/DeveloperLayout';
import ProjectManagerLayout from '../layouts/ProjectManagerLayout';
import QAEngineerLayout from '../layouts/QAEngineerLayout';
import ClientLayout from '../layouts/ClientLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import ManagerDashboard from '../pages/manager/Dashboard';
import DeveloperPage from '../pages/developer/DeveloperPage';
import ProfilePage from '../pages/developer/ProfilePage';
import TimeTrackingPage from '../pages/developer/TimeTrackingPage';
import TeamPage from '../pages/developer/TeamPage';
import ProjectsPage from '../pages/developer/ProjectsPage';
import TaskBoard from '../pages/manager/TaskBoard';
import Calendar from '../pages/manager/Calendar';
import Timesheet from '../pages/manager/Timesheet';
import Reports from '../pages/manager/Reports';
import Users from '../pages/admin/Users';
import Security from '../pages/admin/Security';
import System from '../pages/admin/System';
import Settings from '../pages/admin/Settings';
import Clients from '../pages/admin/Clients';
import QADashboard from '../pages/qa/Dashboard';
import TestCases from '../pages/qa/TestCases';
import ClientProjects from '../pages/client/Projects';
import ClientDashboard from '../pages/client/Dashboard';
import Documents from '../pages/client/Documents';
import Messages from '../pages/client/Messages';
import Invoices from '../pages/client/Invoices';
import Profile from '../pages/client/Profile';
import AuthPage from '../pages/auth/AuthPage';
import LandingPage from '../pages/LandingPage';
import ProtectedRoute from '../components/ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';
import DebugPage from '../components/DebugPage';

const RouteConfig: React.FC = () => {
  return (
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

      {/* Not found page */}
      <Route path="/not-found" element={<NotFoundPage />} />

      {/* Catch all route - redirect to 404 */}
      <Route
        path="*"
        element={<Navigate to="/not-found" replace />}
      />
    </Routes>
  );
};

export default RouteConfig; 