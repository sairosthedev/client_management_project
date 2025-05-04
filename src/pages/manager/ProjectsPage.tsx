import React from 'react';
import { FiPlus } from 'react-icons/fi';
import ProjectsGrid from '../../components/shared/ProjectsGrid';
import { mockTasks } from '../../mocks/tasks';
import { mockProjects } from '../../mocks/projects';
import { mockTeam } from '../../mocks/team';
import { useProjectManagement } from '../../hooks/useProjectManagement';
import { ProjectDetailsModal } from '../../components/modals/ProjectDetailsModal';
import { ProjectCreationModal } from '../../components/modals/ProjectCreationModal';
import { TaskModal } from '../../components/modals/TaskModal';
import { ProjectSettingsModal } from '../../components/modals/ProjectSettingsModal';

const ProjectsPage: React.FC = () => {
  const {
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
  } = useProjectManagement(mockProjects);

  const selectedProjectData = selectedProject ? mockProjects[selectedProject] : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <ProjectsGrid
        onProjectClick={setSelectedProject}
        className="mb-8"
      />

      {selectedProjectData && (
        <ProjectDetailsModal
          project={selectedProjectData}
          tasks={mockTasks.filter(task => task.project === selectedProject)}
          onClose={() => setSelectedProject(null)}
          onSettingsClick={() => setShowSettingsModal(true)}
          onAddTaskClick={() => setShowTaskModal(true)}
          onEditTask={setEditingTask}
        />
      )}

      <ProjectCreationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateProject}
        isSubmitting={isSubmitting}
      />

      <TaskModal
        isOpen={showTaskModal || !!editingTask}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        isSubmitting={isSubmitting}
        editingTask={editingTask}
        team={mockTeam}
      />

      <ProjectSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSubmit={handleUpdateProject}
        isSubmitting={isSubmitting}
        project={selectedProjectData}
        team={mockTeam}
      />
    </div>
  );
};

export default ProjectsPage; 