import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FiCalendar, FiClock, FiFlag } from 'react-icons/fi';
import { format } from 'date-fns';
import type { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  isTracking?: boolean;
  onStartTracking?: () => void;
  onStopTracking?: () => void;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const formatTime = (hours: number): string => {
  if (hours === 0) return '0h';
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isTracking = false,
  onStartTracking,
  onStopTracking,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

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
      className="bg-white rounded-lg shadow-sm p-4 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">{task.title}</h3>
        <FiFlag className={`${priorityColors[task.priority]} ml-2 flex-shrink-0`} />
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <FiCalendar className="mr-1" />
          <span>{format(new Date(task.dueDate), 'MMM d')}</span>
        </div>
        
        <div className="flex items-center">
          <FiClock className="mr-1" />
          <span>{formatTime(task.actualHours)} / {formatTime(task.estimatedHours)}</span>
        </div>
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