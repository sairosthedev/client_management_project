import React from 'react';
import { format } from 'date-fns';
import { FiCalendar, FiClock, FiFlag } from 'react-icons/fi';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: Date;
  timeEstimate: number;
  timeSpent: number;
}

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

const getPriorityColor = (priority: Task['priority']) => {
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
          <span>{format(task.dueDate, 'MMM d')}</span>
        </div>
        
        <div className="flex items-center">
          <FiClock className="mr-1" />
          <span>{Math.round(task.timeSpent / 60)}h / {Math.round(task.timeEstimate / 60)}h</span>
        </div>
      </div>

      {task.assignee && (
        <div className="mt-3 flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
            {task.assignee.avatar}
          </div>
          <span className="ml-2 text-sm text-gray-600">{task.assignee.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard; 