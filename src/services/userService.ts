import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'developer' | 'project_manager' | 'client' | 'qa_engineer' | 'designer' | 'admin';
  skills?: string[];
  projects?: string[];
  avatar?: string;
}

export const userService = {
  // Get users by role
  getUsersByRole: async (role: 'developer' | 'qa_engineer'): Promise<User[]> => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      throw error;
    }
  },

  // Get all team members (developers and QA engineers)
  getTeamMembers: async (): Promise<User[]> => {
    try {
      const [developers, qaEngineers] = await Promise.all([
        userService.getUsersByRole('developer'),
        userService.getUsersByRole('qa_engineer')
      ]);
      return [...developers, ...qaEngineers];
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData: Omit<User, '_id'>): Promise<User> => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update a user
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    try {
      const response = await api.patch(`/users/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }
}; 