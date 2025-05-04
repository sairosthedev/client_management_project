import { TeamMemberType } from '../types';

export const mockTeam: TeamMemberType[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'developer',
    avatar: 'JD',
    email: 'john.doe@company.com',
    skills: ['React', 'TypeScript', 'Node.js'],
    projects: ['E-commerce Platform', 'Mobile App'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'designer',
    avatar: 'JS',
    email: 'jane.smith@company.com',
    skills: ['UI/UX', 'Figma', 'Adobe XD'],
    projects: ['Design System', 'Marketing Website'],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'project_manager',
    avatar: 'MJ',
    email: 'mike.johnson@company.com',
    skills: ['Project Management', 'Agile', 'Scrum'],
    projects: ['E-commerce Platform', 'Design System'],
  },
]; 