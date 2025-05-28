import React, { useState, useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { TaskGroup } from './TaskGroup';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { useAuth } from '../../contexts/AuthContext';
import type { Task, TaskStatus } from '../../types/task';
import type { TeamMemberType } from '../../types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskCreate: (taskData: Partial<Task>) => Promise<void>;
  currentUser: TeamMemberType;
  showStats?: boolean;
  showTimeTracking?: boolean;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskUpdate,
  onTaskCreate,
  currentUser,
  showStats = false,
  showTimeTracking = false,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [initialTaskData, setInitialTaskData] = useState<Partial<Task> | undefined>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find(t => t._id === event.active.id);
    if (task) {
      setActiveId(event.active.id as string);
      setActiveTask(task);
    }
  }, [tasks]);

  const handleDragOver = useCallback(async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    if (activeTaskId === overId) return;

    try {
      await onTaskUpdate(activeTaskId, { status: overId as TaskStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  }, [onTaskUpdate]);

  const handleDragEnd = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveTask(null);
  }, []);

  const handleQuickAdd = (groupTitle: string) => {
    const status = COLUMNS.find(group => group.title === groupTitle)?.id || 'todo';
    setShowNewTaskModal(true);
    setInitialTaskData({
      title: '',
      description: '',
      status,
      priority: 'medium',
      dueDate: new Date(),
    });
  };

  const handleCreateTask = async (formData: Partial<Task>) => {
    try {
      await onTaskCreate(formData);
      setShowNewTaskModal(false);
      setInitialTaskData(undefined);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const taskGroups = COLUMNS.map(column => ({
    id: column.id,
    title: column.title,
    tasks: tasks.filter(task => task.status === column.id)
  }));

  return (
    <div className="p-6">
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
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}>
          {activeId && activeTask ? (
            <TaskCard
              task={activeTask}
              isTracking={false}
              onStartTracking={() => {}}
              onStopTracking={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={showNewTaskModal}
        onClose={() => {
          setShowNewTaskModal(false);
          setInitialTaskData(undefined);
        }}
        onSubmit={handleCreateTask}
        currentUser={currentUser}
        initialData={initialTaskData}
      />
    </div>
  );
}; 