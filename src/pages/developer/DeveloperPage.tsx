import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiCheckCircle,
  FiAlertCircle,
  FiFilter,
  FiSearch,
  FiPlus,
} from 'react-icons/fi';
import type { TeamMemberType, UserRole } from '../../types';
import type { Task, TaskStatus } from '../../types/task';
import { TaskGroup as TaskGroupType, SortField, SortDirection, COLUMNS } from '../../types/developer';
import { mockTasks } from '../../mocks/tasks';
import { StatsCard } from '../../components/developer/StatsCard';
import { TaskGroup } from '../../components/developer/TaskGroup';
import { useTaskTracking } from '../../hooks/useTaskTracking';
import { useTaskStats } from '../../hooks/useTaskStats';
import { formatTime } from '../../utils/time';

// Mock current developer data
const currentDeveloper: TeamMemberType = {
  id: '1',
  name: 'Maria Garcia',
  avatar: 'MG',
  role: 'Frontend Developer' as UserRole,
  email: 'maria.garcia@company.com',
  skills: ['React', 'TypeScript', 'CSS'],
  projects: ['Client Management', 'Dashboard'],
};

const INITIAL_TASK_GROUPS: TaskGroupType[] = COLUMNS.map(column => ({
  id: column.id,
  title: column.title,
  tasks: [],
  isExpanded: column.id !== 'done',
}));

const DeveloperPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Filtering and Sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Task groups state
  const [taskGroups, setTaskGroups] = useState<TaskGroupType[]>(INITIAL_TASK_GROUPS);

  // Custom hooks
  const { isTracking, activeTask: trackedTask, elapsedTime, handleStartTracking, handleStopTracking } = useTaskTracking(
    tasks,
    setTasks,
    currentDeveloper
  );
  const stats = useTaskStats(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await Promise.resolve(mockTasks);
      const userTasks = response.filter(task => task.assignee?.id === currentDeveloper.id);
      setTasks(userTasks);
      
      // Organize tasks into groups
      setTaskGroups(prev => prev.map(group => ({
        ...group,
        tasks: userTasks.filter(task => task.status === group.id)
      })));
    };

    fetchTasks();
  }, [currentDeveloper.id]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveId(event.active.id as string);
    setActiveTask(task || null);
  }, [tasks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    const overId = over.id as TaskStatus;
    if (activeTask.status === overId) return;

    // Update task status
    const updatedTask: Task = {
      ...activeTask,
      status: overId,
      activities: [
        ...activeTask.activities,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'status_change' as const,
          content: `Status changed to ${overId}`,
          user: {
            id: currentDeveloper.id,
            name: currentDeveloper.name,
            email: currentDeveloper.email,
          },
          timestamp: new Date(),
        },
      ],
    };

    setTasks(prev => prev.map(task => 
      task.id === activeTask.id ? updatedTask : task
    ));

    // Update task groups
    setTaskGroups(prev => prev.map(group => ({
      ...group,
      tasks: group.id === overId 
        ? [...group.tasks, updatedTask]
        : group.tasks.filter(t => t.id !== activeTask.id)
    })));
  }, [tasks, currentDeveloper]);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
  }, []);

  const handleQuickAdd = (groupTitle: string) => {
    // Implementation for quick task addition
    console.log('Quick add to:', groupTitle);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium">
            {currentDeveloper.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentDeveloper.name}</h1>
            <p className="text-gray-600">{currentDeveloper.role}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Tasks Completed"
            value={stats.tasksCompleted}
            icon={FiCheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="In Progress"
            value={stats.tasksInProgress}
            icon={FiBarChart2}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Total Time"
            value={formatTime(stats.totalTimeSpent)}
            icon={FiClock}
            iconColor="text-purple-500"
          />
          <StatsCard
            title="Due This Week"
            value={stats.upcomingDeadlines}
            icon={FiAlertCircle}
            iconColor="text-orange-500"
          />
        </div>
      </div>

      {/* Active Task with Real-time Counter */}
      {trackedTask && (
        <div className="mb-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Currently Working On</h3>
              <p className="text-lg font-bold">{trackedTask.title}</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-blue-600">
                  <FiClock className="w-4 h-4" />
                  <span>Current Session: {formatTime(elapsedTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>Total Time: {formatTime(trackedTask.timeSpent + elapsedTime)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleStopTracking}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Stop Tracking
            </button>
          </div>
        </div>
      )}

      {/* Task Board */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">My Tasks</h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
                <FiFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiPlus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-400px)]">
            {taskGroups.map(group => (
              <TaskGroup
                key={group.id}
                id={group.id}
                title={group.title}
                tasks={group.tasks}
                isTracking={isTracking}
                onStartTracking={handleStartTracking}
                onStopTracking={handleStopTracking}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeId && activeTask ? (
              <TaskGroup
                id={activeTask.status}
                title=""
                tasks={[activeTask]}
                isTracking={isTracking}
                onStartTracking={handleStartTracking}
                onStopTracking={handleStopTracking}
                onQuickAdd={handleQuickAdd}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default React.memo(DeveloperPage); 