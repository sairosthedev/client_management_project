import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus } from '../types/task';
import type { TeamMemberType } from '../types/index';
import type { TaskGroup, SortField, SortDirection } from '../types/developer';
import { COLUMNS } from '../types/developer';

interface UseDeveloperTasksProps {
  currentDeveloper: TeamMemberType;
  mockTasks: Task[];
}

interface UseDeveloperTasksReturn {
  tasks: Task[];
  taskGroups: TaskGroup[];
  searchTerm: string;
  statusFilter: TaskStatus | 'all';
  projectFilter: string;
  sortField: SortField;
  sortDirection: SortDirection;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: TaskStatus | 'all') => void;
  setProjectFilter: (project: string) => void;
  setSortField: (field: SortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  updateTask: (updatedTask: Task) => void;
  updateTaskGroups: (taskId: string, newStatus: TaskStatus) => void;
}

const INITIAL_TASK_GROUPS: TaskGroup[] = COLUMNS.map(column => ({
  id: column.id,
  title: column.title,
  tasks: [],
  isExpanded: column.id !== 'done',
}));

export const useDeveloperTasks = ({ currentDeveloper, mockTasks }: UseDeveloperTasksProps): UseDeveloperTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>(INITIAL_TASK_GROUPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    const userTasks = mockTasks.filter(task => task.assignee?.id === currentDeveloper.id);
    setTasks(userTasks);
    
    // Organize tasks into groups
    setTaskGroups(prev => prev.map(group => ({
      ...group,
      tasks: userTasks.filter(task => task.status === group.id)
    })));
  }, [currentDeveloper.id, mockTasks]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));

    setTaskGroups(prev => prev.map(group => ({
      ...group,
      tasks: group.id === updatedTask.status 
        ? [...group.tasks.filter(t => t.id !== updatedTask.id), updatedTask]
        : group.tasks.filter(t => t.id !== updatedTask.id)
    })));
  }, []);

  const updateTaskGroups = useCallback((taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      status: newStatus,
      activities: [
        ...task.activities,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'status_change',
          content: `Status changed to ${newStatus}`,
          user: {
            id: currentDeveloper.id,
            name: currentDeveloper.name,
            email: currentDeveloper.email,
          },
          timestamp: new Date(),
        },
      ],
    };

    updateTask(updatedTask);
  }, [tasks, currentDeveloper, updateTask]);

  return {
    tasks,
    taskGroups,
    searchTerm,
    statusFilter,
    projectFilter,
    sortField,
    sortDirection,
    setSearchTerm,
    setStatusFilter,
    setProjectFilter,
    setSortField,
    setSortDirection,
    updateTask,
    updateTaskGroups,
  };
}; 