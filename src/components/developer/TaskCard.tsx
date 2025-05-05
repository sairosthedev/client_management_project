import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FiClock, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import type { Task } from '../../types/task';
import { formatTime } from '../../utils/time';
import { formatDate } from '../../utils/date';

interface TaskCardProps {
  task: Task;
  isTracking: boolean;
  onStartTracking: (taskId: string) => void;
  onStopTracking: () => void;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isTracking,
  onStartTracking,
  onStopTracking,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{formatTime(task.timeSpent)}</span>
          </div>
        </div>

        <button
          onClick={() => {
            if (isTracking) {
              onStopTracking();
            } else {
              onStartTracking(task.id);
            }
          }}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            isTracking && task.id === task.id
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isTracking && task.id === task.id ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(TaskCard); 