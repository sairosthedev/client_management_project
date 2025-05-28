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
  onStartTracking: () => void;
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
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  const isCurrentlyTracking = isTracking === task._id;

  // Get assignee name and initial
  const getAssigneeInfo = () => {
    if (!task.assignedTo) {
      return { name: 'Unassigned', initial: 'U' };
    }
    if (typeof task.assignedTo === 'string') {
      return { name: 'Unassigned', initial: 'U' };
    }
    return {
      name: task.assignedTo.name || 'Unassigned',
      initial: (task.assignedTo.name || 'U').charAt(0).toUpperCase()
    };
  };

  const { name: assigneeName, initial: assigneeInitial } = getAssigneeInfo();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move ${
        isCurrentlyTracking ? 'opacity-50' : ''
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

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{formatTime(task.actualHours)} / {formatTime(task.estimatedHours)}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
        <button
          onClick={isCurrentlyTracking ? onStopTracking : onStartTracking}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isCurrentlyTracking
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isCurrentlyTracking ? 'Stop' : 'Start'}
        </button>
      </div>

      <div className="mt-3 flex items-center">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
          {assigneeInitial}
        </div>
        <span className="ml-2 text-sm text-gray-600">{assigneeName}</span>
      </div>
    </div>
  );
};

export default React.memo(TaskCard); 