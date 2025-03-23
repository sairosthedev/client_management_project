import React, { useState } from 'react';
import { FiSearch, FiSend, FiPaperclip, FiMoreVertical } from 'react-icons/fi';

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  project: string;
  attachments?: {
    name: string;
    size: string;
  }[];
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: {
      name: 'John Doe',
      avatar: 'JD',
      role: 'Project Manager',
    },
    content: 'The latest design mockups have been uploaded. Please review them and provide your feedback.',
    timestamp: '2024-02-15T10:30:00',
    project: 'E-commerce Platform',
    attachments: [
      { name: 'design-mockup-v2.fig', size: '8.5 MB' },
    ],
  },
  {
    id: '2',
    sender: {
      name: 'Sarah Smith',
      avatar: 'SS',
      role: 'Lead Developer',
    },
    content: 'Backend API integration is complete. We can start testing the payment gateway.',
    timestamp: '2024-02-15T09:15:00',
    project: 'Mobile App Development',
  },
  {
    id: '3',
    sender: {
      name: 'Mike Johnson',
      avatar: 'MJ',
      role: 'Designer',
    },
    content: 'Updated the color scheme based on your feedback. Let me know if this works better.',
    timestamp: '2024-02-14T16:45:00',
    project: 'Website Redesign',
    attachments: [
      { name: 'color-palette.pdf', size: '1.2 MB' },
      { name: 'updated-styles.zip', size: '3.8 MB' },
    ],
  },
];

const Messages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || message.project === selectedProject;
    return matchesSearch && matchesProject;
  });

  const projects = Array.from(new Set(mockMessages.map(message => message.project)));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sending message
    setNewMessage('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="divide-y divide-gray-200">
          {filteredMessages.map((message) => (
            <div key={message.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {message.sender.avatar}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium">{message.sender.name}</h3>
                    <p className="text-xs text-gray-500">{message.sender.role}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">
                    {new Date(message.timestamp).toLocaleString()}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-700">{message.content}</p>
              </div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Attachments:</p>
                  <div className="space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <FiPaperclip className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{attachment.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-sm text-gray-500">
                Project: {message.project}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages; 