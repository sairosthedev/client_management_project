import { TeamMemberType } from '../types';
import { mockTeam } from './team';

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  client: string;
  status: 'active' | 'completed' | 'on_hold';
  team: TeamMemberType[];
  progress: number;
}

export const mockProjects: Record<string, Project> = {
  'E-commerce Platform': {
    id: '1',
    name: 'E-commerce Platform',
    description: 'A modern e-commerce platform with advanced features',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    client: 'Acme Corp',
    status: 'active',
    team: [mockTeam[0], mockTeam[2]],
    progress: 45,
  },
  'Design System': {
    id: '2',
    name: 'Design System',
    description: 'Company-wide design system and component library',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-05-31'),
    client: 'Internal',
    status: 'active',
    team: [mockTeam[1], mockTeam[2]],
    progress: 30,
  },
}; 