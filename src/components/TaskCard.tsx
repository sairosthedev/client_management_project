import React from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiFlag } from 'react-icons/fi';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

const formatTime = (hours: number) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick?.(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 line-clamp-2">{task.title}</h3>
        <FiFlag className={`${getPriorityColor(task.priority)} ml-2 flex-shrink-0`} />
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

      {task.assignedTo && (
        <div className="mt-3 flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            {task.assignedTo.charAt(0)}
          </div>
          <span className="ml-2 text-sm text-gray-600">{task.assignedTo}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard; 