import { TeamMemberType } from '../types';
import { userService } from './userService';

export const teamService = {
  // Create a new team member
  createTeamMember: async (member: Omit<TeamMemberType, 'id'>): Promise<TeamMemberType> => {
    try {
      const response = await userService.createUser({
        ...member,
        role: member.role as 'developer' | 'qa_engineer'
      });
      return response;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  },

  // Read all team members
  getAllTeamMembers: async (): Promise<TeamMemberType[]> => {
    try {
      return await userService.getTeamMembers();
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  // Read a single team member
  getTeamMember: async (id: string): Promise<TeamMemberType | undefined> => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      console.error('Error fetching team member:', error);
      throw error;
    }
  },

  // Update a team member
  updateTeamMember: async (id: string, updates: Partial<TeamMemberType>): Promise<TeamMemberType | undefined> => {
    try {
      const response = await userService.updateUser(id, updates);
      return response;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  },

  // Delete a team member
  deleteTeamMember: async (id: string): Promise<boolean> => {
    try {
      await userService.deleteUser(id);
      return true;
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  },
}; 