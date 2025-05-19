import React, { useEffect, useState } from 'react';
import { FiActivity, FiCheckCircle, FiClock, FiDollarSign, FiFileText, FiMessageSquare } from 'react-icons/fi';
import { clientService, ProjectUpdate, ClientDashboardData } from '../../services/clientService';

const ClientDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<ClientDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await clientService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'No dashboard data available.'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiActivity className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Active Projects</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{dashboardData.activeProjects}</span>
            <span className="ml-2 text-sm text-green-600">+1 this month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Completed Milestones</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{dashboardData.completedMilestones}</span>
            <span className="ml-2 text-sm text-blue-600">85% success rate</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Total Budget</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">${dashboardData.totalBudget.toLocaleString()}</span>
            <span className="ml-2 text-sm text-purple-600">On track</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Time to Deadline</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{dashboardData.nextDeadline} days</span>
            <span className="ml-2 text-sm text-yellow-600">Next milestone</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Updates</h2>
            {dashboardData.projectUpdates && dashboardData.projectUpdates.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.projectUpdates.map(update => (
                  <div key={update.id} className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${
                      update.type === 'milestone'
                        ? 'bg-green-100'
                        : update.type === 'document'
                        ? 'bg-blue-100'
                        : 'bg-yellow-100'
                    }`}>
                      {update.type === 'milestone' ? (
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      ) : update.type === 'document' ? (
                        <FiFileText className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FiMessageSquare className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{update.project}</p>
                      <p className="text-gray-600">{update.message}</p>
                      <p className="text-sm text-gray-500 mt-1">{update.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent updates available.</p>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Project Health</h2>
            {dashboardData.projectHealth && dashboardData.projectHealth.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.projectHealth.map(project => (
                  <div key={project.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{project.name}</span>
                      <span className={`text-sm font-medium ${
                        project.status === 'healthy'
                          ? 'text-green-600'
                          : project.status === 'at_risk'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {project.status === 'healthy'
                          ? 'Healthy'
                          : project.status === 'at_risk'
                          ? 'At Risk'
                          : 'Critical'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          project.status === 'healthy'
                            ? 'bg-green-600'
                            : project.status === 'at_risk'
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No project health data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 