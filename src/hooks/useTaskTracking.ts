import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types/task';
import type { TeamMemberType } from '../types/index';
import { formatTime } from '../utils/time';

interface UseTaskTrackingReturn {
  isTracking: string | null;
  activeTask: Task | null;
  elapsedTime: number;
  handleStartTracking: (taskId: string) => void;
  handleStopTracking: () => void;
}

export const useTaskTracking = (
  tasks: Task[],
  onTaskUpdate: (task: Task) => void,
  currentDeveloper: TeamMemberType
): UseTaskTrackingReturn => {
  const [isTracking, setIsTracking] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && trackingStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - trackingStartTime.getTime()) / (1000 * 60));
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, trackingStartTime]);

  const handleStartTracking = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setIsTracking(taskId);
    setActiveTask(task);
    setTrackingStartTime(new Date());
  };

  const handleStopTracking = useCallback(() => {
    if (!activeTask || !trackingStartTime) return;

    const endTime = new Date();
    const minutesSpent = Math.floor((endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60));

    const updatedTask: Task = {
      ...activeTask,
      timeSpent: activeTask.timeSpent + minutesSpent,
      activities: [
        ...activeTask.activities,
        {
          id: Math.random().toString(36).substr(2, 9),
          type: 'time_tracking',
          content: `Worked on task for ${formatTime(minutesSpent)}`,
          user: {
            id: currentDeveloper.id,
            name: currentDeveloper.name,
            email: currentDeveloper.email,
          },
          timestamp: new Date(),
        },
      ],
    };

    onTaskUpdate(updatedTask);

    setIsTracking(null);
    setActiveTask(null);
    setTrackingStartTime(null);
    setElapsedTime(0);
  }, [activeTask, trackingStartTime, currentDeveloper, onTaskUpdate]);

  return {
    isTracking,
    activeTask,
    elapsedTime,
    handleStartTracking,
    handleStopTracking,
  };
}; 