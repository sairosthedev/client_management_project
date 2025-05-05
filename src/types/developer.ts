import { Task, TaskStatus } from './task';

export const COLUMNS = [
  { id: 'todo' as TaskStatus, title: '🎯 To Do' },
  { id: 'in_progress' as TaskStatus, title: '🚀 In Progress' },
  { id: 'review' as TaskStatus, title: '📝 To Review' },
  { id: 'done' as TaskStatus, title: '✅ Completed' },
] as const;

export interface TaskGroup {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  isExpanded: boolean;
}

export type SortField = 'priority' | 'dueDate' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface DeveloperStats {
  tasksCompleted: number;
  tasksInProgress: number;
  totalTimeSpent: number;
  upcomingDeadlines: number;
}

export const priorityWeights = {
  low: 0,
  medium: 1,
  high: 2,
  urgent: 3,
} as const; 