export interface DashboardStats {
  activeProjects: number;
  teamMembers: number;
  tasksCompleted: number;
  upcomingDeadlines: number;
  totalHoursLogged: number;
  projectProgress: number;
}

export interface TeamMember {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  trend?: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'in-progress' | 'completed' | 'pending';
} 