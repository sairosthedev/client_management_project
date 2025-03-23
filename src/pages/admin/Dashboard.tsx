import React from 'react';
import { FiUsers, FiFolder, FiCheckSquare, FiClock } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-gray-500">{title}</div>
        <div className="text-gray-600 bg-gray-100 p-2 rounded-lg">{icon}</div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold">{value}</div>
        {change && (
          <div className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={42}
          icon={<FiUsers size={24} />}
          change="+12% from last month"
          trend="up"
        />
        <StatCard
          title="Active Projects"
          value={28}
          icon={<FiFolder size={24} />}
          change="+5% from last month"
          trend="up"
        />
        <StatCard
          title="Completed Tasks"
          value={156}
          icon={<FiCheckSquare size={24} />}
          change="+18% from last month"
          trend="up"
        />
        <StatCard
          title="In Progress"
          value={64}
          icon={<FiClock size={24} />}
          change="-8% from last month"
          trend="down"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          {/* Project list will go here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Team Activity</h2>
          {/* Activity feed will go here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 