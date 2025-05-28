import type { TeamMemberType, FileAttachmentType } from './index';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
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
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: Date | null;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  } | string;
  createdBy: string;
  client: string;
  project: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];
  activities: ActivityItem[];
  createdAt: Date;
  updatedAt: Date;
} 