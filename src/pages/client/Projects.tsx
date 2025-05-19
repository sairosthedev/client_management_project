import React, { useState, useEffect } from 'react';
import { FiSearch, FiFolder, FiClock, FiFileText, FiMessageSquare, FiMoreVertical, FiPlus, FiDownload, FiEye } from 'react-icons/fi';
import { clientService, Project } from '../../services/clientService';
import { Link } from 'react-router-dom';

const ClientProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const data = await clientService.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
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
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
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
            <div key={project.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-medium mb-1">{project.name}</h2>
                  <p className="text-gray-600">{project.description}</p>
                </div>
                <div className="relative">
                  <button className="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link to={`/client/projects/${project.id}/details`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiEye className="mr-3 h-4 w-4" />
                        View Details
                      </Link>
                      <Link to={`/client/projects/${project.id}/documents`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiFileText className="mr-3 h-4 w-4" />
                        View Documents
                      </Link>
                      <Link to={`/client/projects/${project.id}/messages`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FiMessageSquare className="mr-3 h-4 w-4" />
                        Messages
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <div className="flex items-center gap-2">
                    <FiFileText className="text-gray-400" />
                    <span className="font-medium">{project.documents}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <div className="flex items-center gap-2">
                    <FiMessageSquare className="text-gray-400" />
                    <span className="font-medium">{project.messages}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.team.map((member, index) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium border-2 border-white"
                      title={`${member.name} - ${member.role}`}
                    >
                      {member.avatar}
                    </div>
                  ))}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProjects; 