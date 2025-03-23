import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiFolder,
  FiClock,
  FiFileText,
  FiMessageSquare,
  FiDollarSign,
  FiUser,
  FiHelpCircle
} from 'react-icons/fi';

const ClientLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/client/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/client/projects', icon: FiFolder, label: 'My Projects' },
    { to: '/client/documents', icon: FiFileText, label: 'Documents' },
    { to: '/client/messages', icon: FiMessageSquare, label: 'Messages' },
    { to: '/client/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Client Portal</h1>
        </div>
        <nav className="mt-4">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors ${
                location.pathname === item.to ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : ''
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

export default ClientLayout; 