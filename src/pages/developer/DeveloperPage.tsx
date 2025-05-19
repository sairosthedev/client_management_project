import React, { useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import type { TeamMemberType, JobTitle } from '../../types/index';
import type { Task, TaskStatus, Priority } from '../../types/task';
import { mockTasks } from '../../mocks/tasks';
import { TaskGroup } from '../../components/developer/TaskGroup';
import { DeveloperStats } from '../../components/developer/DeveloperStats';
import { ActiveTaskTracker } from '../../components/developer/ActiveTaskTracker';
import { TaskBoardHeader } from '../../components/developer/TaskBoardHeader';
import { TaskModal } from '../../components/developer/TaskModal';
import { useTaskTracking } from '../../hooks/useTaskTracking';
import { useTaskStats } from '../../hooks/useTaskStats';
import { useDeveloperTasks } from '../../hooks/useDeveloperTasks';

// Mock current developer data
const currentDeveloper: TeamMemberType = {
  id: '1',
  name: 'Maria Garcia',
  avatar: 'MG',
  role: 'Frontend Developer' as JobTitle,
  email: 'maria.garcia@company.com',
  skills: ['React', 'TypeScript', 'CSS'],
  projects: ['Client Management', 'Dashboard'],
};

const DeveloperPage: React.FC = () => {
  const {
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
  } = useDeveloperTasks({
    currentDeveloper,
    mockTasks,
  });

  const {
    isTracking,
    activeTask: trackedTask,
    elapsedTime,
    handleStartTracking,
    handleStopTracking
  } = useTaskTracking(tasks, updateTask, currentDeveloper);

  const stats = useTaskStats(tasks);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = React.useState(false);
  const [initialTaskData, setInitialTaskData] = React.useState<Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    dueDate: string;
    timeEstimate: number;
  }> | undefined>(undefined);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveId(event.active.id as string);
    setActiveTask(task || null);
  }, [tasks]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as TaskStatus;

    if (activeTaskId === overId) return;

    updateTaskGroups(activeTaskId, overId);
  }, [updateTaskGroups]);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
  }, []);

  const handleQuickAdd = (groupTitle: string) => {
    const status = taskGroups.find(group => group.title === groupTitle)?.id || 'todo';
    setShowNewTaskModal(true);
    // Pre-fill the status based on which column's "Add Task" button was clicked
    const newTaskData = {
      title: '',
      description: '',
      status,
      priority: 'medium' as Priority,
      dueDate: new Date().toISOString().split('T')[0],
      timeEstimate: 0
    };
    setInitialTaskData(newTaskData);
  };

  const handleCreateTask = (formData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    dueDate: string;
    timeEstimate: number;
  }) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      assignee: currentDeveloper,
      project: 'Client Management',
      dependencies: [],
      files: [],
      activities: [
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'status_change',
          content: 'Task created',
          user: {
            id: currentDeveloper.id,
            name: currentDeveloper.name,
            email: currentDeveloper.email,
          },
          timestamp: new Date(),
        },
      ],
      timeSpent: 0,
      dueDate: new Date(formData.dueDate),
    };

    updateTask(newTask);
    setShowNewTaskModal(false);
    setInitialTaskData(undefined);
  };

  return (
    <div className="p-6">
      <DeveloperStats
        developer={currentDeveloper}
        stats={stats}
      />

      {trackedTask && (
        <ActiveTaskTracker
          task={trackedTask}
          elapsedTime={elapsedTime}
          onStopTracking={handleStopTracking}
        />
      )}

      {/* Task Board */}
      <div className="space-y-6">
        <TaskBoardHeader
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          projectFilter={projectFilter}
          sortField={sortField}
          sortDirection={sortDirection}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onProjectFilterChange={setProjectFilter}
          onSortFieldChange={setSortField}
          onSortDirectionChange={setSortDirection}
          onNewTask={() => setShowNewTaskModal(true)}
        />

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
                isTracking={Boolean(isTracking)}
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
                isTracking={Boolean(isTracking)}
                onStartTracking={handleStartTracking}
                onStopTracking={handleStopTracking}
                onQuickAdd={handleQuickAdd}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={showNewTaskModal}
        onClose={() => {
          setShowNewTaskModal(false);
          setInitialTaskData(undefined);
        }}
        onSubmit={handleCreateTask}
        currentDeveloper={currentDeveloper}
        initialData={initialTaskData}
      />
    </div>
  );
};

export default React.memo(DeveloperPage); 