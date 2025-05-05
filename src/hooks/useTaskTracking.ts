import { useState, useEffect, useCallback } from 'react';
import { Task, TeamMemberType } from '../types';
import { formatTime } from '../utils/time';

interface UseTaskTrackingReturn {
  isTracking: string | null;
  activeTask: Task | null;
  elapsedTime: number;
  handleStartTracking: (task: Task) => void;
  handleStopTracking: () => void;
}

export const useTaskTracking = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
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

  const handleStartTracking = (task: Task) => {
    setIsTracking(task.id);
    setActiveTask(task);
    setTrackingStartTime(new Date());
  };

  const handleStopTracking = useCallback(() => {
    if (!activeTask || !trackingStartTime) return;

    const endTime = new Date();
    const minutesSpent = Math.floor((endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60));

    setTasks(prev =>
      prev.map(task =>
        task.id === activeTask.id
          ? {
              ...task,
              timeSpent: task.timeSpent + minutesSpent,
              activities: [
                ...task.activities,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  type: 'time_tracking',
                  content: `Worked on task for ${formatTime(minutesSpent)}`,
                  user: {
                    id: currentDeveloper.id,
                    name: currentDeveloper.name,
                    email: '',
                  },
                  timestamp: new Date(),
                },
              ],
            }
          : task
      )
    );

    setIsTracking(null);
    setActiveTask(null);
    setTrackingStartTime(null);
    setElapsedTime(0);
  }, [activeTask, trackingStartTime, currentDeveloper.id, currentDeveloper.name, setTasks]);

  return {
    isTracking,
    activeTask,
    elapsedTime,
    handleStartTracking,
    handleStopTracking,
  };
}; 