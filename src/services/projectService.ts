import api from './api';

// Types
export interface Project {
  _id: string;
  name: string;
  description?: string;
  client: {
    _id: string;
    name: string;
    company: string;
  };
  projectManager: {
    _id: string;
    name: string;
    email: string;
  };
  team: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  status: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget?: {
    amount: number;
    currency: string;
  };
  priority: 'low' | 'medium' | 'high';
  milestones: Array<{
    _id: string;
    name: string;
    description?: string;
    dueDate?: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadedBy: {
      _id: string;
      name: string;
    };
    uploadedAt: string;
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  client: string;
  startDate: string;
  endDate?: string;
  budget?: {
    amount: number;
    currency: string;
  };
  priority?: 'low' | 'medium' | 'high';
  team?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  budget?: {
    amount: number;
    currency: string;
  };
  priority?: 'low' | 'medium' | 'high';
  team?: string[];
  notes?: string;
}

export interface MilestoneData {
  name: string;
  description?: string;
  dueDate?: string;
}

export const projectService = {
  // Create a new project
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  // Get projects by client
  getProjectsByClient: async (clientId: string): Promise<Project[]> => {
    const response = await api.get(`/projects/client/${clientId}`);
    return response.data;
  },

  // Get a single project
  getProject: async (projectId: string): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  // Update a project
  updateProject: async (projectId: string, data: UpdateProjectData): Promise<Project> => {
    const response = await api.patch(`/projects/${projectId}`, data);
    return response.data;
  },

  // Delete a project
  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },

  // Add team member
  addTeamMember: async (projectId: string, userId: string): Promise<Project> => {
    const response = await api.post(`/projects/${projectId}/team`, { userId });
    return response.data;
  },

  // Remove team member
  removeTeamMember: async (projectId: string, userId: string): Promise<Project> => {
    const response = await api.delete(`/projects/${projectId}/team/${userId}`);
    return response.data;
  },

  // Add milestone
  addMilestone: async (projectId: string, data: MilestoneData): Promise<Project> => {
    const response = await api.post(`/projects/${projectId}/milestones`, data);
    return response.data;
  },

  // Update milestone status
  updateMilestoneStatus: async (
    projectId: string,
    milestoneId: string,
    status: 'pending' | 'in-progress' | 'completed'
  ): Promise<Project> => {
    const response = await api.patch(`/projects/${projectId}/milestones/${milestoneId}`, { status });
    return response.data;
  }
}; 