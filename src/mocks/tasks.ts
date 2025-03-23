import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement User Authentication',
    description: 'Add user authentication using JWT tokens and implement login/register forms',
    status: 'in_progress',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'Maria Garcia',
      avatar: 'MG',
      role: 'Frontend Developer',
    },
    dueDate: new Date('2024-04-01'),
    project: 'E-commerce Platform',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 480, // 8 hours
    timeSpent: 180, // 3 hours
  },
  {
    id: '2',
    title: 'Design System Components',
    description: 'Create reusable UI components following the new design system',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: '1',
      name: 'Maria Garcia',
      avatar: 'MG',
      role: 'Frontend Developer',
    },
    dueDate: new Date('2024-04-05'),
    project: 'Design System',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 1200, // 20 hours
    timeSpent: 0,
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Integrate the new payment processing API endpoints',
    status: 'review',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'Maria Garcia',
      avatar: 'MG',
      role: 'Frontend Developer',
    },
    dueDate: new Date('2024-03-28'),
    project: 'E-commerce Platform',
    dependencies: ['1'],
    files: [],
    activities: [],
    timeEstimate: 360, // 6 hours
    timeSpent: 300, // 5 hours
  },
  {
    id: '4',
    title: 'Mobile Responsive Layout',
    description: 'Ensure all pages are properly responsive on mobile devices',
    status: 'done',
    priority: 'medium',
    assignee: {
      id: '1',
      name: 'Maria Garcia',
      avatar: 'MG',
      role: 'Frontend Developer',
    },
    dueDate: new Date('2024-03-25'),
    project: 'Website Redesign',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 240, // 4 hours
    timeSpent: 270, // 4.5 hours
  },
  {
    id: '5',
    title: 'Performance Optimization',
    description: 'Optimize page load times and implement lazy loading for images',
    status: 'todo',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'Maria Garcia',
      avatar: 'MG',
      role: 'Frontend Developer',
    },
    dueDate: new Date('2024-04-10'),
    project: 'Website Redesign',
    dependencies: ['4'],
    files: [],
    activities: [],
    timeEstimate: 360, // 6 hours
    timeSpent: 0,
  },
]; 