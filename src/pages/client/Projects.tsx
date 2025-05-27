import React, { useState, useEffect } from 'react';
import { FiSearch, FiFolder, FiClock, FiFileText, FiMessageSquare, FiMoreVertical, FiPlus, FiDownload, FiEye } from 'react-icons/fi';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../services/projectService';
import { Link } from 'react-router-dom';

const ClientProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const {
    projects,
    loading,
    error,
    fetchProjectsByClient
  } = useProjects();

  useEffect(() => {
    // Assuming you have a way to get the current client ID
    const clientId = localStorage.getItem('clientId'); // or however you store the client ID
    if (clientId) {
      fetchProjectsByClient(clientId);
    }
  }, [fetchProjectsByClient]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <FiFolder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">There are no projects matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map(project => (
            <div key={project._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-medium mb-1">{project.name}</h2>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                <div className="relative">
                  <button 
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setSelectedProject(project)}
                  >
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-gray-400" />
                    <span className="font-medium">{project.documents.length}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <div className="flex items-center gap-2">
                    <FiMessageSquare className="text-gray-400" />
                    <span className="font-medium">{project.team.length}</span>
                  </div>
                </div>
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
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Project Information</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="font-medium">Client:</span> {selectedProject.client.company}</p>
                      <p><span className="font-medium">Project Manager:</span> {selectedProject.projectManager.name}</p>
                      <p><span className="font-medium">Start Date:</span> {new Date(selectedProject.startDate).toLocaleDateString()}</p>
                      {selectedProject.endDate && (
                        <p><span className="font-medium">End Date:</span> {new Date(selectedProject.endDate).toLocaleDateString()}</p>
                      )}
                      {selectedProject.budget && (
                        <p>
                          <span className="font-medium">Budget:</span> {selectedProject.budget.amount} {selectedProject.budget.currency}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="text-lg font-semibold">Team Members</h3>
                    <div className="mt-2 space-y-2">
                      {selectedProject.team.map(member => (
                        <div key={member._id} className="flex items-center justify-between">
                          <span>{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <h3 className="text-lg font-semibold">Milestones</h3>
                  <div className="mt-2 space-y-4">
                    {selectedProject.milestones.map(milestone => (
                      <div key={milestone._id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{milestone.name}</h4>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {milestone.status}
                          </span>
                        </div>
                        {milestone.dueDate && (
                          <p className="text-sm text-gray-500 mt-1">
                            Due: {new Date(milestone.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedProject.documents.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProject.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded by {doc.uploadedBy.name} on {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Document
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedProject.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <p className="mt-2 text-gray-600">{selectedProject.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProjects; 