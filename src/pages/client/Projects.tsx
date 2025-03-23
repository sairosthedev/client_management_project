import React, { useState } from 'react';
import { FiSearch, FiFolder, FiClock, FiFileText, FiMessageSquare, FiMoreVertical } from 'react-icons/fi';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  startDate: string;
  dueDate: string;
  documents: number;
  messages: number;
  team: {
    name: string;
    role: string;
    avatar: string;
  }[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Development of a full-featured e-commerce platform with inventory management',
    status: 'active',
    progress: 75,
    startDate: '2024-01-15',
    dueDate: '2024-03-15',
    documents: 8,
    messages: 24,
    team: [
      { name: 'John Doe', role: 'Project Manager', avatar: 'JD' },
      { name: 'Sarah Smith', role: 'Lead Developer', avatar: 'SS' },
      { name: 'Mike Johnson', role: 'Designer', avatar: 'MJ' },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'active',
    progress: 40,
    startDate: '2024-02-01',
    dueDate: '2024-04-20',
    documents: 5,
    messages: 18,
    team: [
      { name: 'Emily Brown', role: 'Project Manager', avatar: 'EB' },
      { name: 'David Wilson', role: 'Mobile Developer', avatar: 'DW' },
    ],
  },
  {
    id: '3',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    progress: 90,
    startDate: '2024-01-01',
    dueDate: '2024-02-28',
    documents: 12,
    messages: 45,
    team: [
      { name: 'Alex Turner', role: 'Project Manager', avatar: 'AT' },
      { name: 'Lisa Chen', role: 'UI/UX Designer', avatar: 'LC' },
    ],
  },
];

const ClientProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
      </div>

      <div className="flex gap-4 mb-6">
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

      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-medium mb-1">{project.name}</h2>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <FiMoreVertical className="w-5 h-5" />
              </button>
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
                    key={index}
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
    </div>
  );
};

export default ClientProjects; 