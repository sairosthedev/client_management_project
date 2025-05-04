import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableTaskCard from './SortableTaskCard';

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

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  id,
  title,
  tasks,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-200' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      
      <div 
        className={`space-y-3 min-h-[200px] transition-colors ${
          isOver && tasks.length === 0 ? 'bg-blue-50/50 border-2 border-dashed border-blue-200 rounded-lg p-4' : ''
        }`}
      >
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>
        
        {isOver && tasks.length === 0 && (
          <div className="flex items-center justify-center h-full text-blue-500 text-sm">
            Drop here to add task
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppableColumn; 