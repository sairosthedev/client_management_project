import React from 'react';
import { FiActivity, FiCheckCircle, FiClock, FiDollarSign, FiFileText, FiMessageSquare } from 'react-icons/fi';

interface ProjectUpdate {
  id: string;
  project: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'update' | 'document';
}

const mockUpdates: ProjectUpdate[] = [
  {
    id: '1',
    project: 'E-commerce Platform',
    message: 'Frontend development completed',
    timestamp: '2 hours ago',
    type: 'milestone',
  },
  {
    id: '2',
    project: 'Mobile App Development',
    message: 'New design documents uploaded',
    timestamp: '4 hours ago',
    type: 'document',
  },
  {
    id: '3',
    project: 'Website Redesign',
    message: 'Weekly progress report available',
    timestamp: '1 day ago',
    type: 'update',
  },
];

const ClientDashboard: React.FC = () => {
  return (
    <div className="p-6">
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
            <span className="text-2xl font-bold">3</span>
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
            <span className="text-2xl font-bold">12</span>
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
            <span className="text-2xl font-bold">$45,000</span>
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
            <span className="text-2xl font-bold">45 days</span>
            <span className="ml-2 text-sm text-yellow-600">Next milestone</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Updates</h2>
            <div className="space-y-4">
              {mockUpdates.map(update => (
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
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Project Health</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">E-commerce Platform</span>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Mobile App Development</span>
                  <span className="text-sm font-medium text-yellow-600">At Risk</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Website Redesign</span>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 