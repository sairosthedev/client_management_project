export type UserRole = 'developer' | 'designer' | 'project_manager' | 'admin';

export interface TeamMemberType {
  id: string;
  name: string;
  avatar: string;
  role?: UserRole;
  email?: string;
  skills: string[];
  projects: string[];
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

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
} 