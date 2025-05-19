import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSend, FiPaperclip, FiMoreVertical, FiAlertCircle } from 'react-icons/fi';
import { clientService, Message } from '../../services/clientService';

const Messages: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [activeProject, setActiveProject] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [messagesData, projectsData] = await Promise.all([
          clientService.getMessages(),
          clientService.getProjects()
        ]);
        
        setMessages(messagesData);
        setProjects(projectsData.map(p => ({ id: p.id, name: p.name })));
        
        // Set default active project if available
        if (projectsData.length > 0 && !activeProject) {
          setActiveProject(projectsData[0].id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProject === 'all' || message.projectId === selectedProject;
    return matchesSearch && matchesProject;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeProject) {
      return;
    }
    
    try {
      setIsSending(true);
      const sentMessage = await clientService.sendMessage(
        activeProject,
        newMessage,
        attachment || undefined
      );
      
      // Add the new message to the list
      setMessages(prev => [sentMessage, ...prev]);
      
      // Reset form
      setNewMessage('');
      setAttachment(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

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
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedProject !== 'all'
                ? 'No messages match your search criteria.'
                : 'Start the conversation by sending a message.'}
            </p>
          </div>
        ) : (
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
                  <p className="text-gray-700">{message.message}</p>
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
        )}
      </div>

      <div>
        <div className="mb-4">
          <label htmlFor="project-select" className="block text-sm font-medium text-gray-700">
            Select Project to Message
          </label>
          <select
            id="project-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={activeProject}
            onChange={(e) => setActiveProject(e.target.value)}
          >
            <option value="" disabled>Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!activeProject || isSending}
            />
            <label
              htmlFor="attachment-upload"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <FiPaperclip className="w-5 h-5" />
              <input
                id="attachment-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={!activeProject || isSending}
              />
            </label>
            {attachment && (
              <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
                Attachment: {attachment.name} ({(attachment.size / 1024).toFixed(0)} KB)
              </div>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={!newMessage.trim() || !activeProject || isSending}
          >
            {isSending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <FiSend className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Messages; 