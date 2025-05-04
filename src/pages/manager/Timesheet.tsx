import React, { useState } from 'react';
import { FiPlus, FiDownload, FiTrash2, FiCalendar } from 'react-icons/fi';

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  hours: { [key: string]: number };
  status: 'pending' | 'approved' | 'rejected';
}

const initialTimeEntries: TimeEntry[] = [
  {
    id: '1',
    project: 'E-commerce Platform',
    task: 'Frontend Development',
    hours: { mon: 2, tue: 3, wed: 4, thu: 3, fri: 2 },
    status: 'approved',
  },
];

const Timesheet: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries);
  const [dateRange, setDateRange] = useState('This Week');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<TimeEntry>>({
    project: '',
    task: '',
    hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0 },
    status: 'pending',
  });

  const calculateTotal = (hours: { [key: string]: number }) => {
    return Object.values(hours).reduce((sum, curr) => sum + curr, 0);
  };

  const calculateWeeklyTotal = () => {
    return timeEntries.reduce((sum, entry) => sum + calculateTotal(entry.hours), 0);
  };

  const handleAddEntry = () => {
    if (newEntry.project && newEntry.task) {
      setTimeEntries([
        ...timeEntries,
        {
          id: Date.now().toString(),
          project: newEntry.project,
          task: newEntry.task,
          hours: newEntry.hours as { [key: string]: number },
          status: 'pending',
        },
      ]);
      setShowAddForm(false);
      setNewEntry({
        project: '',
        task: '',
        hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0 },
        status: 'pending',
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
              <FiCalendar className="text-gray-400 mr-2" />
              <select 
                className="border-none bg-transparent focus:ring-0"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Custom Range</option>
              </select>
            </div>
            <button 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {/* Export logic */}}
            >
              <FiDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total Hours This Week: <span className="font-semibold">{calculateWeeklyTotal()}h</span>
            </div>
            <button
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => setShowAddForm(true)}
            >
              <FiPlus className="mr-2" />
              Add Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-600">Project</th>
                  <th className="text-left p-4 font-medium text-gray-600">Task</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Mon</th>
                  <th className="text-left p-4 font-medium text-gray-600">Tue</th>
                  <th className="text-left p-4 font-medium text-gray-600">Wed</th>
                  <th className="text-left p-4 font-medium text-gray-600">Thu</th>
                  <th className="text-left p-4 font-medium text-gray-600">Fri</th>
                  <th className="text-left p-4 font-medium text-gray-600">Total</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{entry.project}</td>
                    <td className="p-4 text-gray-600">{entry.task}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    {Object.entries(entry.hours).map(([day, hours]) => (
                      <td key={day} className="p-4 text-gray-600">{hours}h</td>
                    ))}
                    <td className="p-4 font-medium text-gray-900">{calculateTotal(entry.hours)}h</td>
                    <td className="p-4">
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">Add New Time Entry</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newEntry.project}
                    onChange={(e) => setNewEntry({ ...newEntry, project: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newEntry.task}
                    onChange={(e) => setNewEntry({ ...newEntry, task: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4 mb-6">
                {Object.entries(newEntry.hours || {}).map(([day, hours]) => (
                  <div key={day}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      value={hours}
                      onChange={(e) => 
                        setNewEntry({
                          ...newEntry,
                          hours: { ...(newEntry.hours || {}), [day]: Number(e.target.value) }
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleAddEntry}
                >
                  Add Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timesheet; 