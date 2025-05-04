import { Task } from '../types/task';
import { UserRole } from '../types';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: Date;
  timeEstimate: number;
  timeSpent: number;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design New Landing Page',
    description: 'Create a modern and responsive landing page design following the new brand guidelines',
    status: 'todo',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'SC'
    },
    dueDate: new Date('2024-04-15'),
    timeEstimate: 480, // 8 hours
    timeSpent: 0
  },
  {
    id: '2',
    title: 'Implement User Authentication',
    description: 'Set up JWT-based authentication system with login/register functionality',
    status: 'in_progress',
    priority: 'high',
    assignee: {
      id: '2',
      name: 'Mike Johnson',
      avatar: 'MJ'
    },
    dueDate: new Date('2024-04-10'),
    timeEstimate: 360, // 6 hours
    timeSpent: 120 // 2 hours
  },
  {
    id: '3',
    title: 'API Documentation',
    description: 'Document all API endpoints using OpenAPI/Swagger specification',
    status: 'review',
    priority: 'medium',
    assignee: {
      id: '3',
      name: 'Alex Kim',
      avatar: 'AK'
    },
    dueDate: new Date('2024-04-08'),
    timeEstimate: 240, // 4 hours
    timeSpent: 210 // 3.5 hours
  },
  {
    id: '4',
    title: 'Bug Fix: Mobile Navigation',
    description: 'Fix navigation menu not closing on mobile after clicking a link',
    status: 'done',
    priority: 'high',
    assignee: {
      id: '4',
      name: 'Emma Wilson',
      avatar: 'EW'
    },
    dueDate: new Date('2024-04-05'),
    timeEstimate: 120, // 2 hours
    timeSpent: 90 // 1.5 hours
  },
  {
    id: '5',
    title: 'Performance Optimization',
    description: 'Optimize image loading and implement lazy loading for better performance',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: '2',
      name: 'Mike Johnson',
      avatar: 'MJ'
    },
    dueDate: new Date('2024-04-20'),
    timeEstimate: 300, // 5 hours
    timeSpent: 0
  },
  {
    id: '6',
    title: 'Unit Tests for API',
    description: 'Write comprehensive unit tests for all API endpoints',
    status: 'in_progress',
    priority: 'medium',
    assignee: {
      id: '3',
      name: 'Alex Kim',
      avatar: 'AK'
    },
    dueDate: new Date('2024-04-12'),
    timeEstimate: 420, // 7 hours
    timeSpent: 180 // 3 hours
  }
]; 