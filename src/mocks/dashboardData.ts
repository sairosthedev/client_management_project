import { DashboardStats, TeamMember, Client, TimelineItem } from '../types/dashboard';

export const mockStats: DashboardStats = {
  activeProjects: 8,
  teamMembers: 24,
  tasksCompleted: 156,
  upcomingDeadlines: 12,
  totalHoursLogged: 840,
  projectProgress: 78.5
};

export const mockTeam: TeamMember[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson' }
];

export const mockClients: Client[] = [
  { id: '1', name: 'Tech Corp' },
  { id: '2', name: 'Innovate Inc' },
  { id: '3', name: 'Digital Solutions' }
];

export const mockTimelineItems: TimelineItem[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Phase 2 Development',
    dueDate: '5 days',
    status: 'in-progress'
  },
  {
    id: '2',
    title: 'Mobile App',
    description: 'UI/UX Review',
    dueDate: 'tomorrow',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Analytics Dashboard',
    description: 'Testing Phase',
    dueDate: '2 weeks',
    status: 'in-progress'
  }
]; 