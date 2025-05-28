import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { projectService, Project, CreateProjectData, UpdateProjectData, MilestoneData } from '../services/projectService';

interface Project {
  _id: string;
  name: string;
  description: string;
  client: string;
  status: string;
}

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/projects');
      
      if (!Array.isArray(response.data)) {
        console.error('Expected array of projects but got:', response.data);
        setError('Invalid response format from server');
        setProjects([]);
        return;
      }

      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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