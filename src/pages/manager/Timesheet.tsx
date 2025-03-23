import React from 'react';

const Timesheet: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Timesheets</h1>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <select className="border border-gray-300 rounded-lg px-3 py-2">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Custom Range</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-medium">Project</th>
                <th className="text-left p-4 font-medium">Task</th>
                <th className="text-left p-4 font-medium">Mon</th>
                <th className="text-left p-4 font-medium">Tue</th>
                <th className="text-left p-4 font-medium">Wed</th>
                <th className="text-left p-4 font-medium">Thu</th>
                <th className="text-left p-4 font-medium">Fri</th>
                <th className="text-left p-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="p-4">E-commerce Platform</td>
                <td className="p-4">Frontend Development</td>
                <td className="p-4">2h</td>
                <td className="p-4">3h</td>
                <td className="p-4">4h</td>
                <td className="p-4">3h</td>
                <td className="p-4">2h</td>
                <td className="p-4 font-medium">14h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timesheet; 