import { useState, useEffect, useMemo } from 'react';
import { Task } from '../types/task';
import { DeveloperStats } from '../types/developer';

export const useTaskStats = (tasks: Task[]): DeveloperStats => {
  // Use useMemo to calculate stats only when tasks change
  const stats = useMemo(() => {
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const totalTime = tasks.reduce((acc, task) => acc + (task.actualHours || 0), 0);
    const upcoming = tasks.filter(task => {
      if (!task.dueDate) return false;
      const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysUntilDue <= 7 && task.status !== 'done';
    }).length;

    console.log('Task stats calculation:', {
      totalTasks: tasks.length,
      completed,
      inProgress,
      totalTime,
      upcoming,
      taskStatuses: tasks.map(t => t.status)
    });

    return {
      tasksCompleted: completed,
      tasksInProgress: inProgress,
      totalTimeSpent: totalTime,
      upcomingDeadlines: upcoming,
    };
  }, [tasks]);

  return stats;
}; 