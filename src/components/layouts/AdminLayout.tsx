import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiSettings,
  FiMenu,
  FiBell,
  FiUser,
} from 'react-icons/fi';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </Link>
);

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { to: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/clients', icon: <FiUsers />, label: 'Clients' },
    { to: '/admin/projects', icon: <FiFolder />, label: 'Projects' },
    { to: '/admin/tasks', icon: <FiCheckSquare />, label: 'Tasks' },
    { to: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu />
          </button>
        </div>
        <nav className="mt-6 px-2 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Welcome, Admin</h2>
              <p className="text-sm text-gray-500">
                Manage your projects and team members
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <FiBell />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <FiUser />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 