import React, { useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../services/projectService';

interface ProjectListProps {
  clientId?: string;
  onProjectSelect?: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ clientId, onProjectSelect }) => {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    fetchProjectsByClient
  } = useProjects();

  useEffect(() => {
    if (clientId) {
      fetchProjectsByClient(clientId);
    } else {
      fetchProjects();
    }
  }, [clientId, fetchProjects, fetchProjectsByClient]);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onProjectSelect?.(project)}
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.priority === 'high' ? 'bg-red-100 text-red-800' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.priority}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>Client: {project.client.company}</p>
                <p>Manager: {project.projectManager.name}</p>
                <p>Team Size: {project.team.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 