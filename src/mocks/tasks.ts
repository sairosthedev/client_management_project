import { Task, TaskStatus, Priority } from '../types/task';
import { TeamMemberType, UserRole } from '../types';

const mockAssignees: Record<string, TeamMemberType> = {
  '1': {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'SC',
    role: 'Designer' as UserRole,
    email: 'sarah.chen@company.com',
    skills: ['UI Design', 'UX Research', 'Figma'],
    projects: ['Website Redesign', 'Mobile App'],
  },
  '2': {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'MJ',
    role: 'Backend Developer' as UserRole,
    email: 'mike.johnson@company.com',
    skills: ['Node.js', 'Python', 'AWS'],
    projects: ['API Development', 'Authentication System'],
  },
  '3': {
    id: '3',
    name: 'Alex Kim',
    avatar: 'AK',
    role: 'Full Stack Developer' as UserRole,
    email: 'alex.kim@company.com',
    skills: ['React', 'Node.js', 'MongoDB'],
    projects: ['Client Management', 'Documentation'],
  },
  '4': {
    id: '4',
    name: 'Emma Wilson',
    avatar: 'EW',
    role: 'Frontend Developer' as UserRole,
    email: 'emma.wilson@company.com',
    skills: ['React', 'TypeScript', 'CSS'],
    projects: ['Mobile Navigation', 'Performance Optimization'],
  },
};

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design New Landing Page',
    description: 'Create a modern and responsive landing page design following the new brand guidelines',
    status: 'todo' as TaskStatus,
    priority: 'high' as Priority,
    assignee: mockAssignees['1'],
    dueDate: new Date('2024-04-15'),
    project: 'Website Redesign',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 480, // 8 hours
    timeSpent: 0
  },
  {
    id: '2',
    title: 'Implement User Authentication',
    description: 'Set up JWT-based authentication system with login/register functionality',
    status: 'in_progress' as TaskStatus,
    priority: 'high' as Priority,
    assignee: mockAssignees['2'],
    dueDate: new Date('2024-04-10'),
    project: 'Authentication System',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 360, // 6 hours
    timeSpent: 120 // 2 hours
  },
  {
    id: '3',
    title: 'API Documentation',
    description: 'Document all API endpoints using OpenAPI/Swagger specification',
    status: 'review' as TaskStatus,
    priority: 'medium' as Priority,
    assignee: mockAssignees['3'],
    dueDate: new Date('2024-04-08'),
    project: 'Documentation',
    dependencies: ['2'],
    files: [],
    activities: [],
    timeEstimate: 240, // 4 hours
    timeSpent: 210 // 3.5 hours
  },
  {
    id: '4',
    title: 'Bug Fix: Mobile Navigation',
    description: 'Fix navigation menu not closing on mobile after clicking a link',
    status: 'done' as TaskStatus,
    priority: 'high' as Priority,
    assignee: mockAssignees['4'],
    dueDate: new Date('2024-04-05'),
    project: 'Mobile Navigation',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 120, // 2 hours
    timeSpent: 90 // 1.5 hours
  },
  {
    id: '5',
    title: 'Performance Optimization',
    description: 'Optimize image loading and implement lazy loading for better performance',
    status: 'todo' as TaskStatus,
    priority: 'medium' as Priority,
    assignee: mockAssignees['2'],
    dueDate: new Date('2024-04-20'),
    project: 'Performance Optimization',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 300, // 5 hours
    timeSpent: 0
  },
  {
    id: '6',
    title: 'Unit Tests for API',
    description: 'Write comprehensive unit tests for all API endpoints',
    status: 'in_progress' as TaskStatus,
    priority: 'medium' as Priority,
    assignee: mockAssignees['3'],
    dueDate: new Date('2024-04-12'),
    project: 'API Development',
    dependencies: ['2'],
    files: [],
    activities: [],
    timeEstimate: 420, // 7 hours
    timeSpent: 180 // 3 hours
  }
]; 