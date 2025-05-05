import type { TeamMemberType, FileAttachmentType } from './index';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface ActivityItem {
  id: string;
  type: 'status_change' | 'time_tracking' | 'comment' | 'other';
  content: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: TeamMemberType;
  dueDate: Date;
  project: string;
  dependencies: string[]; 
  files: FileAttachmentType[];
  activities: ActivityItem[];
  timeEstimate: number;
  timeSpent: number; 
} 