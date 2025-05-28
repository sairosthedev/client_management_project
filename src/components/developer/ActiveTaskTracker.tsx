import React from 'react';
import { FiClock } from 'react-icons/fi';
import type { Task } from '../../types/task';
import { formatTime } from '../../utils/time';

interface ActiveTaskTrackerProps {
  task: Task;
  elapsedTime: number;
  onStopTracking: () => void;
}

export const ActiveTaskTracker: React.FC<ActiveTaskTrackerProps> = ({
  task,
  elapsedTime,
  onStopTracking,
}) => {
  if (!task) return null;

  // Convert elapsed time from minutes to hours for display
  const currentSessionHours = elapsedTime / 60;
  const totalHours = (task.actualHours || 0) + currentSessionHours;

  return (
    <div className="mb-8 bg-blue-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Currently Working On</h3>
          <p className="text-lg font-bold">{task.title}</p>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-blue-600">
              <FiClock className="w-4 h-4" />
              <span>Current Session: {formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              <span>Total Time: {formatTime(totalHours * 60)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onStopTracking}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Stop Tracking
        </button>
      </div>
    </div>
  );
}; 