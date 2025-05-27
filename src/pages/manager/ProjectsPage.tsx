import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import { useProjects } from '../../hooks/useProjects';
import { Project, CreateProjectData, UpdateProjectData } from '../../services/projectService';
import { ProjectDetailsModal } from '../../components/modals/ProjectDetailsModal';
import { ProjectCreationModal } from '../../components/modals/ProjectCreationModal';
import { TaskModal } from '../../components/modals/TaskModal';
import { ProjectSettingsModal } from '../../components/modals/ProjectSettingsModal';
import { Task } from '../../types/task';

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    addTeamMember,
    removeTeamMember,
    addMilestone,
    updateMilestoneStatus
  } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = async (task: Task) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement task creation
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement task update
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (data: CreateProjectData) => {
    try {
      await createProject(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdateProject = async (project: Project) => {
    try {
      setIsSubmitting(true);
      await updateProject(project._id, {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        priority: project.priority,
        team: project.team.map(member => member._id),
      });
      setShowSettingsModal(false);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div
            key={project._id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-medium mb-1">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              {project.endDate && (
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.map((member) => (
                  <div
                    key={member._id}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium border-2 border-white"
                    title={member.name}
                  >
                    {member.name.charAt(0)}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.priority === 'high' ? 'bg-red-100 text-red-800' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onAddTaskClick={() => setShowTaskModal(true)}
          onEditTask={setEditingTask}
        />
      )}

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          isSubmitting={isSubmitting}
          editingTask={editingTask}
          team={selectedProject?.team || []}
        />
      )}

      {showSettingsModal && selectedProject && (
        <ProjectSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onSubmit={handleUpdateProject}
          isSubmitting={isSubmitting}
          project={selectedProject}
          team={selectedProject.team}
        />
      )}

      {showCreateModal && (
        <ProjectCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ProjectsPage; 