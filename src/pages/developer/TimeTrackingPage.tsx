import React, { useState } from 'react';
import { FiClock, FiCalendar, FiBarChart2 } from 'react-icons/fi';

interface TimeEntry {
  id: string;
  taskId: string;
  taskName: string;
  project: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
}

const TimeTrackingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<'day' | 'week' | 'month'>('day');

  // Mock time entries
  const timeEntries: TimeEntry[] = [
    {
      id: '1',
      taskId: '1',
      taskName: 'Implement User Authentication',
      project: 'E-commerce Platform',
      startTime: new Date(2024, 2, 25, 9, 0),
      endTime: new Date(2024, 2, 25, 11, 30),
      duration: 150
    },
    {
      id: '2',
      taskId: '2',
      taskName: 'Design System Components',
      project: 'Design System',
      startTime: new Date(2024, 2, 25, 13, 0),
      endTime: new Date(2024, 2, 25, 15, 45),
      duration: 165
    },
    {
      id: '3',
      taskId: '3',
      taskName: 'API Integration',
      project: 'E-commerce Platform',
      startTime: new Date(2024, 2, 25, 16, 0),
      endTime: new Date(2024, 2, 25, 17, 30),
      duration: 90
    }
  ];

  const totalHoursToday = timeEntries.reduce((acc, entry) => acc + entry.duration, 0) / 60;
  const projectBreakdown = timeEntries.reduce((acc, entry) => {
    acc[entry.project] = (acc[entry.project] || 0) + entry.duration;
    return acc;
  }, {} as Record<string, number>);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            {(['day', 'week', 'month'] as const).map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-4 py-2 ${
                  selectedView === view
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Hours Today</p>
              <h3 className="text-2xl font-bold">{totalHoursToday.toFixed(1)}h</h3>
            </div>
            <FiClock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Tasks</p>
              <h3 className="text-2xl font-bold">{timeEntries.length}</h3>
            </div>
            <FiBarChart2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Projects</p>
              <h3 className="text-2xl font-bold">{Object.keys(projectBreakdown).length}</h3>
            </div>
            <FiCalendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Time Entries */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Time Entries</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {timeEntries.map(entry => (
            <div key={entry.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{entry.taskName}</h3>
                  <p className="text-sm text-gray-600">{entry.project}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatDuration(entry.duration)}</p>
                  <p className="text-sm text-gray-600">
                    {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Breakdown */}
      <div className="mt-6 bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Project Breakdown</h2>
        </div>
        <div className="p-6">
          {Object.entries(projectBreakdown).map(([project, duration]) => (
            <div key={project} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{project}</span>
                <span>{formatDuration(duration)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{
                    width: `${(duration / (totalHoursToday * 60)) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTrackingPage; 