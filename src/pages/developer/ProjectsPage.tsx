import React, { useState, useEffect } from 'react';
import { FiFolder, FiCalendar, FiClock, FiUsers, FiSearch } from 'react-icons/fi';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../services/projectService';

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    projects,
    loading,
    error,
    fetchProjects
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
        <h1 className="text-2xl font-bold">My Projects</h1>
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

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiFolder className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                    <p className="text-gray-600">
                      {selectedProject.milestones.length} milestones
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Info */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Project Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="font-medium">{selectedProject.client.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Project Manager</p>
                      <p className="font-medium">{selectedProject.projectManager.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString()}</p>
                    </div>
                    {selectedProject.endDate && (
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium">{new Date(selectedProject.endDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Milestones</h3>
                  <div className="space-y-3">
                    {selectedProject.milestones.map(milestone => (
                      <div
                        key={milestone._id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{milestone.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone.description}
                            </p>
                            {milestone.dueDate && (
                              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FiCalendar className="w-4 h-4" />
                                  Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            milestone.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : milestone.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.team.map(member => (
                      <div
                        key={member._id}
                        className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 