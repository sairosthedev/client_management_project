import { useState } from 'react';
import { Project } from '../mocks/projects';
import { TaskFormData } from '../components/forms/TaskForm';
import { ProjectFormData } from '../components/forms/ProjectForm';
import { ProjectSettingsData } from '../components/forms/ProjectSettings';
import { Task } from '../types';

export const useProjectManagement = (mockProjectData: Record<string, Project>) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (formData: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        client: formData.client,
        status: formData.status,
        team: [],
        progress: 0,
      };

      // TODO: Replace with actual API call
      console.log('Creating project:', newProject);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        project: selectedProject!,
        dependencies: [],
        files: [],
        activities: [],
        timeSpent: 0,
      };

      // TODO: Replace with actual API call
      console.log('Creating task:', newTask);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = async (formData: TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (!editingTask) {
        throw new Error('No task selected for editing');
      }

      const updatedTask = {
        ...editingTask,
        ...formData,
        project: selectedProject!,
      };

      // TODO: Replace with actual API call
      console.log('Updating task:', updatedTask);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProject = async (formData: ProjectSettingsData) => {
    if (!selectedProject) {
      console.error('No project selected');
      return;
    }

    const projectData = mockProjectData[selectedProject];
    if (!projectData) {
      console.error('Project data not found:', selectedProject);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedProject = {
        ...projectData,
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        client: formData.client,
        status: formData.status,
        team: formData.team.map(id => {
          const member = mockTeam.find(m => m.id === id);
          if (!member) {
            console.warn(`Team member with id ${id} not found`);
          }
          return member!;
        }).filter(Boolean),
      };

      // TODO: Replace with actual API call
      console.log('Updating project:', updatedProject);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSettingsModal(false);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedProject,
    setSelectedProject,
    showAddModal,
    setShowAddModal,
    showTaskModal,
    setShowTaskModal,
    showSettingsModal,
    setShowSettingsModal,
    editingTask,
    setEditingTask,
    isSubmitting,
    handleCreateProject,
    handleCreateTask,
    handleEditTask,
    handleUpdateProject,
  };
}; 