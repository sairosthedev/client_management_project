import React from 'react';
import { FiCheckSquare, FiAlertOctagon, FiBarChart2, FiClock } from 'react-icons/fi';

const QADashboard: React.FC = () => {
  const stats = {
    totalTests: 156,
    passedTests: 142,
    failedTests: 14,
    bugsReported: 28,
    bugsResolved: 22,
    avgTestTime: '45m',
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">QA Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Test Coverage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Tests</span>
                <span className="font-medium">{stats.totalTests}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Passed</span>
                <span className="text-green-600 font-medium">{stats.passedTests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="text-red-600 font-medium">{stats.failedTests}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(stats.passedTests / stats.totalTests) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Bug Tracking</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Reported</span>
                <span className="font-medium">{stats.bugsReported}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolved</span>
                <span className="text-green-600 font-medium">{stats.bugsResolved}</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${(stats.bugsResolved / stats.bugsReported) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Average Test Time</p>
                <h4 className="text-2xl font-bold">{stats.avgTestTime}</h4>
              </div>
              <FiClock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { type: 'test', status: 'passed', name: 'User Authentication Flow', time: '2h ago' },
            { type: 'bug', status: 'open', name: 'Dashboard Loading Issue', time: '3h ago' },
            { type: 'test', status: 'failed', name: 'Payment Integration', time: '4h ago' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {activity.type === 'test' ? (
                  <FiCheckSquare className={`w-5 h-5 ${
                    activity.status === 'passed' ? 'text-green-500' : 'text-red-500'
                  }`} />
                ) : (
                  <FiAlertOctagon className="w-5 h-5 text-orange-500" />
                )}
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-gray-600">{activity.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                activity.status === 'passed'
                  ? 'bg-green-100 text-green-800'
                  : activity.status === 'failed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QADashboard; 