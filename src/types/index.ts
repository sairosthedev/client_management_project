export type UserRole = 'Frontend Developer' | 'Backend Developer' | 'Full Stack Developer' | 'Designer' | 'Project Manager';

export interface TeamMemberType {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
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

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
} 