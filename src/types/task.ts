import type { TeamMemberType, FileAttachmentType, ActivityItem } from './index';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: TeamMemberType;
  dueDate: Date;
  project: string;
  dependencies: string[]; 
  files: FileAttachmentType[];
  activities: ActivityItem[];
  timeEstimate: number;
  timeSpent: number; 
} 