import { useState, useEffect } from 'react';
import { Task } from '../types';
import { DeveloperStats } from '../types/developer';

export const useTaskStats = (tasks: Task[]): DeveloperStats => {
  const [stats, setStats] = useState<DeveloperStats>({
    tasksCompleted: 0,
    tasksInProgress: 0,
    totalTimeSpent: 0,
    upcomingDeadlines: 0,
  });

  useEffect(() => {
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const totalTime = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
    const upcoming = tasks.filter(task => {
      const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysUntilDue <= 7 && task.status !== 'done';
    }).length;

    setStats({
      tasksCompleted: completed,
      tasksInProgress: inProgress,
      totalTimeSpent: totalTime,
      upcomingDeadlines: upcoming,
    });
  }, [tasks]);

  return stats;
}; 