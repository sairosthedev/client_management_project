export interface TeamMemberType {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  email?: string;
}

export interface FileAttachmentType {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  previewUrl?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ActivityItem {
  id: string;
  type: 'comment' | 'attachment' | 'status_change' | 'other';
  content: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: Date;
  metadata?: {
    attachments?: FileAttachmentType[];
    originalContent?: string;
    mentions?: string[];
  };
}

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