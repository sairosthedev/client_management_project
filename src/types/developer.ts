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

// Technology/skill interface
export interface Technology {
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'expert';
}

// Project assignment interface
export interface ProjectAssignment {
  projectId: string;
  role: string;
  startDate: string;
  endDate?: string;
  hoursPerWeek: number;
  status: 'active' | 'completed' | 'pending';
}

// Portfolio item interface
export interface PortfolioItem {
  title: string;
  description: string;
  link: string;
  imageUrl?: string;
}

// Developer interface to match backend model
export interface Developer {
  id: string;
  userId: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  experienceYears: number;
  technologies: Technology[];
  hourlyRate: number;
  availability: 'available' | 'partial' | 'unavailable';
  availableHours: number;
  projects: ProjectAssignment[];
  rating: number;
  reviewCount: number;
  portfolio: PortfolioItem[];
}

// Developer creation/update form data
export interface DeveloperFormData {
  title: string;
  bio: string;
  experienceYears: number;
  technologies: Technology[];
  hourlyRate: number;
  availability?: 'available' | 'partial' | 'unavailable';
  availableHours?: number;
  portfolio?: PortfolioItem[];
} 