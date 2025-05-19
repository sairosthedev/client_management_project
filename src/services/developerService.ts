import api from './api';
import { Developer, DeveloperFormData, PortfolioItem, ProjectAssignment } from '../types/developer';

export const developerService = {
  // Get all developers with optional filtering
  getAllDevelopers: async (
    params?: {
      technology?: string;
      availability?: 'available' | 'partial' | 'unavailable';
      minExperience?: number;
      maxHourlyRate?: number;
      search?: string;
    }
  ): Promise<Developer[]> => {
    try {
      const response = await api.get('/developers', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching developers:', error);
      throw error;
    }
  },

  // Get developer by ID
  getDeveloperById: async (id: string): Promise<Developer> => {
    try {
      const response = await api.get(`/developers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching developer with ID ${id}:`, error);
      throw error;
    }
  },

  // Get developer profile for current user
  getCurrentDeveloperProfile: async (userId: string): Promise<Developer> => {
    try {
      const response = await api.get(`/developers/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current developer profile:', error);
      throw error;
    }
  },

  // Create developer profile
  createDeveloperProfile: async (developerData: DeveloperFormData): Promise<Developer> => {
    try {
      const response = await api.post('/developers', developerData);
      return response.data;
    } catch (error) {
      console.error('Error creating developer profile:', error);
      throw error;
    }
  },

  // Update developer profile
  updateDeveloperProfile: async (id: string, developerData: Partial<DeveloperFormData>): Promise<Developer> => {
    try {
      const response = await api.put(`/developers/${id}`, developerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating developer with ID ${id}:`, error);
      throw error;
    }
  },

  // Portfolio management
  addPortfolioItem: async (developerId: string, portfolioItem: PortfolioItem): Promise<Developer> => {
    try {
      const response = await api.post(`/developers/${developerId}/portfolio`, portfolioItem);
      return response.data;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  },

  updatePortfolioItem: async (
    developerId: string, 
    itemIndex: number, 
    portfolioItem: Partial<PortfolioItem>
  ): Promise<Developer> => {
    try {
      const response = await api.put(`/developers/${developerId}/portfolio/${itemIndex}`, portfolioItem);
      return response.data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  },

  deletePortfolioItem: async (developerId: string, itemIndex: number): Promise<Developer> => {
    try {
      const response = await api.delete(`/developers/${developerId}/portfolio/${itemIndex}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  },

  // Project management (for admins and project managers)
  addProjectToDeveloper: async (
    developerId: string, 
    projectAssignment: Omit<ProjectAssignment, 'status'> & { status?: 'active' | 'completed' | 'pending' }
  ): Promise<Developer> => {
    try {
      const response = await api.post(`/developers/${developerId}/projects`, projectAssignment);
      return response.data;
    } catch (error) {
      console.error('Error adding project to developer:', error);
      throw error;
    }
  },

  updateDeveloperProject: async (
    developerId: string,
    projectId: string,
    updates: {
      status?: 'active' | 'completed' | 'pending';
      endDate?: string;
      hoursPerWeek?: number;
    }
  ): Promise<Developer> => {
    try {
      const response = await api.put(`/developers/${developerId}/projects/${projectId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating developer project:', error);
      throw error;
    }
  },

  removeProjectFromDeveloper: async (developerId: string, projectId: string): Promise<Developer> => {
    try {
      const response = await api.delete(`/developers/${developerId}/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing project from developer:', error);
      throw error;
    }
  }
}; 