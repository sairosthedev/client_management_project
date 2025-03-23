import React from 'react';
import { Users, Briefcase, CheckSquare, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Clients', value: '36', icon: Users, trend: '+12%', color: 'bg-blue-500' },
    { name: 'Active Projects', value: '24', icon: Briefcase, trend: '+8%', color: 'bg-green-500' },
    { name: 'Total Employees', value: '48', icon: Users, trend: '+5%', color: 'bg-yellow-500' },
    { name: 'Revenue', value: '$52,000', icon: TrendingUp, trend: '+18%', color: 'bg-purple-500' },
  ];

  const recentClients = [
    { name: 'Tech Solutions Inc.', project: 'Website Redesign', status: 'active' },
    { name: 'Global Systems', project: 'Mobile App', status: 'pending' },
    { name: 'Innovate AI', project: 'ML Integration', status: 'active' },
    { name: 'Digital Dynamics', project: 'E-commerce Platform', status: 'completed' },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Recent Clients */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Clients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentClients.map((client) => (
                <tr key={client.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{client.project}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      client.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : client.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;