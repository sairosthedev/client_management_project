import React from 'react';
import {
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiAlertCircle,
  FiActivity,
  FiTrendingUp
} from 'react-icons/fi';

const AdminDashboard: React.FC = () => {
  // Mock statistics - in a real app, these would come from an API
  const stats = {
    totalUsers: 156,
    activeProjects: 24,
    completedTasks: 892,
    pendingApprovals: 15,
    systemHealth: 98.5,
    monthlyGrowth: 12.3
  };

  const StatCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: number | string;
    trend?: number;
  }> = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{value}</h3>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats.totalUsers}
          trend={8.2}
        />
        <StatCard
          icon={FiFolder}
          label="Active Projects"
          value={stats.activeProjects}
          trend={5.1}
        />
        <StatCard
          icon={FiCheckSquare}
          label="Completed Tasks"
          value={stats.completedTasks}
          trend={12.5}
        />
        <StatCard
          icon={FiAlertCircle}
          label="Pending Approvals"
          value={stats.pendingApprovals}
        />
        <StatCard
          icon={FiActivity}
          label="System Health"
          value={`${stats.systemHealth}%`}
        />
        <StatCard
          icon={FiTrendingUp}
          label="Monthly Growth"
          value={`${stats.monthlyGrowth}%`}
          trend={stats.monthlyGrowth}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium">Add New User</h3>
            <p className="text-sm text-gray-600 mt-1">Create user accounts</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium">Create Project</h3>
            <p className="text-sm text-gray-600 mt-1">Set up new project</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium">System Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Configure platform</p>
          </button>
          <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium">View Reports</h3>
            <p className="text-sm text-gray-600 mt-1">Analytics & insights</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 