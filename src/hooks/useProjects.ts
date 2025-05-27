import { useState, useCallback } from 'react';
import { projectService, Project, CreateProjectData, UpdateProjectData, MilestoneData } from '../services/projectService';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch projects by client
  const fetchProjectsByClient = useCallback(async (clientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjectsByClient(clientId);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch client projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single project
  const fetchProject = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProject(projectId);
      setCurrentProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project
  const createProject = useCallback(async (data: CreateProjectData) => {
    try {
      setLoading(true);
      setError(null);
      const newProject = await projectService.createProject(data);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update project
  const updateProject = useCallback(async (projectId: string, data: UpdateProjectData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await projectService.updateProject(projectId, data);
      setProjects(prev => prev.map(p => p._id === projectId ? updatedProject : p));
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Delete project
  const deleteProject = useCallback(async (projectId: string) => {
    try {
      setLoading(true);
      setError(null);
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      if (currentProject?._id === projectId) {
        setCurrentProject(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Add team member
  const addTeamMember = useCallback(async (projectId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await projectService.addTeamMember(projectId, userId);
      setProjects(prev => prev.map(p => p._id === projectId ? updatedProject : p));
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Remove team member
  const removeTeamMember = useCallback(async (projectId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await projectService.removeTeamMember(projectId, userId);
      setProjects(prev => prev.map(p => p._id === projectId ? updatedProject : p));
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove team member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Add milestone
  const addMilestone = useCallback(async (projectId: string, data: MilestoneData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await projectService.addMilestone(projectId, data);
      setProjects(prev => prev.map(p => p._id === projectId ? updatedProject : p));
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add milestone');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  // Update milestone status
  const updateMilestoneStatus = useCallback(async (
    projectId: string,
    milestoneId: string,
    status: 'pending' | 'in-progress' | 'completed'
  ) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProject = await projectService.updateMilestoneStatus(projectId, milestoneId, status);
      setProjects(prev => prev.map(p => p._id === projectId ? updatedProject : p));
      if (currentProject?._id === projectId) {
        setCurrentProject(updatedProject);
      }
      return updatedProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update milestone status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProject]);

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProjectsByClient,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    addMilestone,
    updateMilestoneStatus
  };
}; 