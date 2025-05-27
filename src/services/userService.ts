import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'developer' | 'project_manager' | 'client' | 'qa_engineer' | 'designer' | 'admin';
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
  }
}; 