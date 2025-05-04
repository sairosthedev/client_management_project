import type { TeamMemberType } from '../types';

export const mockUsers: TeamMemberType[] = [
  {
    id: '1',
    name: 'Maria Garcia',
    avatar: 'MG',
    role: 'developer',
    email: 'maria.garcia@company.com',
    skills: ['React', 'TypeScript', 'UI/UX'],
    projects: ['E-commerce Platform', 'Design System'],
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'JS',
    role: 'developer',
    email: 'john.smith@company.com',
    skills: ['Node.js', 'Python', 'AWS'],
    projects: ['API Gateway', 'Authentication Service'],
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    avatar: 'SW',
    role: 'project_manager',
    email: 'sarah.wilson@company.com',
    skills: ['Agile', 'Scrum', 'Team Leadership'],
    projects: ['Mobile App', 'Website Redesign'],
  },
  {
    id: '4',
    name: 'David Chen',
    avatar: 'DC',
    role: 'developer',
    email: 'david.chen@company.com',
    skills: ['React', 'Node.js', 'MongoDB'],
    projects: ['Customer Dashboard', 'Analytics Platform'],
  },
  {
    id: '5',
    name: 'Emily Brown',
    avatar: 'EB',
    role: 'designer',
    email: 'emily.brown@company.com',
    skills: ['Figma', 'Adobe XD', 'User Research'],
    projects: ['Design System', 'Mobile App'],
  },
  {
    id: '6',
    name: 'Michael Lee',
    avatar: 'ML',
    role: 'developer',
    email: 'michael.lee@company.com',
    skills: ['Docker', 'Kubernetes', 'CI/CD'],
    projects: ['Infrastructure', 'Deployment Automation'],
  }
]; 