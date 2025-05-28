import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { FiPlus } from 'react-icons/fi';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../../types/task';

interface TaskGroupProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onQuickAdd?: (groupTitle: string) => void;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({
  id,
  title,
  tasks,
  onQuickAdd,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isTracking={false}
            onStartTracking={() => {}}
            onStopTracking={() => {}}
          />
        ))}
      </div>

      {onQuickAdd && (
        <button
          onClick={() => onQuickAdd(title)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      )}
    </div>
  );
}; 