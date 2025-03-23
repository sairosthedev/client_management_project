import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { FiClock, FiList, FiUser } from 'react-icons/fi';

const DeveloperLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Developer Portal</h1>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/developer"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <FiList className="w-5 h-5" />
            <span>My Tasks</span>
          </NavLink>
          <NavLink
            to="/developer/time-tracking"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <FiClock className="w-5 h-5" />
            <span>Time Tracking</span>
          </NavLink>
          <NavLink
            to="/developer/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <FiUser className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="min-h-screen bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DeveloperLayout; 