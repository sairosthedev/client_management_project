import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, Users, Plus, MoreVertical, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  tags: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TaskCard: React.FC<{ task: Task; onEdit: (task: Task) => void }> = ({ task, onEdit }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No due date'}</span>
        </div>
        
        {task.assignee && (
          <div className="flex items-center text-xs text-gray-500">
            <Users className="w-3 h-3 mr-1" />
            <span>{task.assignee}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              task.priority === 'high'
                ? 'bg-red-100 text-red-800'
                : task.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          {task.status === 'done' && (
            <span className="inline-flex items-center text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskColumn: React.FC<{
  column: Column;
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}> = ({ column, tasks, onAddTask, onEditTask }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg min-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-sm font-medium text-gray-900">{column.title}</h2>
          <span className="ml-2 text-xs text-gray-500">{tasks.length}</span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
};

const TaskBoard: React.FC = () => {
  const [columns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'in_progress', title: 'In Progress', tasks: [] },
    { id: 'in_review', title: 'In Review', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      status: 'todo',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-03-20',
      tags: ['frontend', 'security'],
    },
    {
      id: '2',
      title: 'Design system documentation',
      status: 'in_progress',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2024-03-25',
      tags: ['documentation'],
    },
    {
      id: '3',
      title: 'API integration',
      status: 'in_review',
      priority: 'high',
      assignee: 'Mike Johnson',
      dueDate: '2024-03-22',
      tags: ['backend', 'api'],
    },
    {
      id: '4',
      title: 'Bug fixes for release',
      status: 'done',
      priority: 'high',
      assignee: 'Sarah Wilson',
      dueDate: '2024-03-18',
      tags: ['bugfix'],
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);

        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const addTask = (status: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'New Task',
      status: status as Task['status'],
      priority: 'medium',
      tags: [],
    };
    setTasks([...tasks, newTask]);
  };

  const editTask = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Project Tasks</h1>
          <p className="text-sm text-gray-500">Manage and track project progress</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Tag className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          onDragEnd={handleDragEnd}
        >
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onAddTask={() => addTask(column.id)}
              onEditTask={editTask}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default TaskBoard;