import { TeamMemberType } from '../types';
import { mockUsers } from '../mocks/users';

// In-memory storage for team members
let teamMembers = [...mockUsers];

export const teamService = {
  // Create a new team member
  createTeamMember: async (member: Omit<TeamMemberType, 'id'>): Promise<TeamMemberType> => {
    const newMember = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
    };
    teamMembers.push(newMember as TeamMemberType);
    return newMember as TeamMemberType;
  },

  // Read all team members
  getAllTeamMembers: async (): Promise<TeamMemberType[]> => {
    return teamMembers;
  },

  // Read a single team member
  getTeamMember: async (id: string): Promise<TeamMemberType | undefined> => {
    return teamMembers.find(member => member.id === id);
  },

  // Update a team member
  updateTeamMember: async (id: string, updates: Partial<TeamMemberType>): Promise<TeamMemberType | undefined> => {
    const index = teamMembers.findIndex(member => member.id === id);
    if (index === -1) return undefined;

    const updatedMember = {
      ...teamMembers[index],
      ...updates,
      id, // Ensure ID doesn't get overwritten
    };
    teamMembers[index] = updatedMember;
    return updatedMember;
  },

  // Delete a team member
  deleteTeamMember: async (id: string): Promise<boolean> => {
    const initialLength = teamMembers.length;
    teamMembers = teamMembers.filter(member => member.id !== id);
    return teamMembers.length !== initialLength;
  },
}; 