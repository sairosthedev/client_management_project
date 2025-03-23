import React from 'react';
import { FiDownload, FiBarChart2, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const Reports: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiDownload className="w-4 h-4" />
          Export Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiBarChart2 className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium">Project Progress</h2>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiPieChart className="w-5 h-5 text-green-600" />
            <h2 className="font-medium">Resource Allocation</h2>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Chart placeholder
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FiTrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="font-medium">Time Tracking</h2>
          </div>
          <div className="h-48 flex items-center justify-center text-gray-400">
            Chart placeholder
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">Recent Reports</h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 font-medium">Report Name</th>
                <th className="pb-4 font-medium">Type</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="py-4">Project Overview Q2</td>
                <td className="py-4">Summary</td>
                <td className="py-4">Jun 30, 2023</td>
                <td className="py-4">
                  <button className="text-blue-600 hover:text-blue-700">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports; 