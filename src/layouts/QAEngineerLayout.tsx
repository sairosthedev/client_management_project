import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiCheckSquare,
  FiAlertCircle,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiAlertOctagon
} from 'react-icons/fi';

const QAEngineerLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/qa/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/qa/tests', icon: FiCheckSquare, label: 'Test Cases' },
    { to: '/qa/bugs', icon: FiAlertOctagon, label: 'Bug Tracking' },
    { to: '/qa/reports', icon: FiFileText, label: 'Test Reports' },
    { to: '/qa/metrics', icon: FiBarChart2, label: 'QA Metrics' },
    { to: '/qa/issues', icon: FiAlertCircle, label: 'Issues' },
    { to: '/qa/settings', icon: FiSettings, label: 'Test Settings' },
    { to: '/qa/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">QA Dashboard</h1>
        </div>
        <nav className="mt-4">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname === item.to ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default QAEngineerLayout; 