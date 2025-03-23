import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiUsers, FiClipboard, FiBarChart2, FiSettings, FiUser } from 'react-icons/fi';

const ProjectManagerLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/manager/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/manager/projects', icon: FiClipboard, label: 'Projects' },
    { to: '/manager/team', icon: FiUsers, label: 'Team' },
    { to: '/manager/reports', icon: FiBarChart2, label: 'Reports' },
    { to: '/manager/settings', icon: FiSettings, label: 'Settings' },
    { to: '/manager/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Project Management</h1>
        </div>
        <nav className="mt-4">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname === item.to ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
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

export default ProjectManagerLayout; 