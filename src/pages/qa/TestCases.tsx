import React, { useState } from 'react';
import { FiPlus, FiSearch, FiFilter, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface TestCase {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  module: string;
  lastRun: string;
  executionTime: string;
}

const mockTestCases: TestCase[] = [
  {
    id: '1',
    title: 'User Login Authentication',
    description: 'Verify user can successfully login with valid credentials',
    status: 'passed',
    priority: 'high',
    module: 'Authentication',
    lastRun: '2024-02-20',
    executionTime: '1.5s',
  },
  {
    id: '2',
    title: 'Password Reset Flow',
    description: 'Verify password reset email is sent and new password can be set',
    status: 'pending',
    priority: 'medium',
    module: 'Authentication',
    lastRun: '2024-02-19',
    executionTime: '2.1s',
  },
  {
    id: '3',
    title: 'Project Creation',
    description: 'Verify new project can be created with all required fields',
    status: 'failed',
    priority: 'high',
    module: 'Projects',
    lastRun: '2024-02-20',
    executionTime: '1.8s',
  },
];

const TestCases: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const modules = Array.from(new Set(mockTestCases.map(test => test.module)));

  const filteredTestCases = mockTestCases.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule === 'all' || test.module === selectedModule;
    const matchesStatus = selectedStatus === 'all' || test.status === selectedStatus;
    
    return matchesSearch && matchesModule && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Cases</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <FiPlus className="w-5 h-5" />
          Add Test Case
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search test cases..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
        >
          <option value="all">All Modules</option>
          {modules.map(module => (
            <option key={module} value={module}>{module}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Case
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Module
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Run
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTestCases.map(test => (
              <tr key={test.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{test.title}</div>
                    <div className="text-sm text-gray-500">{test.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {test.module}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    test.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : test.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {test.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                    test.status === 'passed'
                      ? 'bg-green-100 text-green-800'
                      : test.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {test.status === 'passed' ? <FiCheckCircle className="w-4 h-4" /> :
                     test.status === 'failed' ? <FiXCircle className="w-4 h-4" /> :
                     <FiFilter className="w-4 h-4" />}
                    {test.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {test.lastRun}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {test.executionTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestCases; 