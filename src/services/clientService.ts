import api from './api';
import { ClientType } from '../types';

// Types for Project related data
export interface Project {
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
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
  client: string; // Client ID
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  project: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'update' | 'document';
}

export interface ClientDashboardData {
  activeProjects: number;
  completedMilestones: number;
  totalBudget: number;
  nextDeadline: number; // Days to deadline
  projectUpdates: ProjectUpdate[];
  projectHealth: {
    id: string;
    name: string;
    status: 'healthy' | 'at_risk' | 'critical';
    progress: number;
  }[];
}

// Document type for client documents
export interface Document {
  id: string;
  name: string;
  projectId: string;
  project?: string;
  type: string;
  size: string;
  uploadedBy?: string;
  uploaded: string;
}

// Message type for client messages
export interface Message {
  id: string;
  projectId: string;
  project: string;
  sender: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  attachments?: {
    name: string;
    size: string;
  }[];
}

// Check client authentication status and fix issues
export const checkClientAuthentication = (): {
  clientId: string | null;
  isAuthenticated: boolean;
} => {
  const clientId = localStorage.getItem('clientId');
  return {
    clientId,
    isAuthenticated: !!clientId,
  };
};

// Register a test client if needed for development/testing
export const registerTestClient = async (): Promise<string> => {
  try {
    const response = await api.post('/clients/register', {
      name: 'Test Client',
      email: `test-${Math.random().toString(36).substring(2, 10)}@example.com`,
      password: 'password123',
      company: 'Test Company',
    });
    
    if (response.data.client?.id) {
      localStorage.setItem('clientId', response.data.client.id);
      return response.data.client.id;
    }
    throw new Error('Failed to get client ID from response');
  } catch (error) {
    console.error('Error registering test client:', error);
    throw error;
  }
};

// Client service for handling client-related API requests
export const clientService = {
  // Check authentication status
  checkAuthentication: async (): Promise<boolean> => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) return false;
    
    try {
      await api.get('/clients/profile');
      return true;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  },
  
  // Get client profile
  getProfile: async (): Promise<ClientType> => {
    const response = await api.get('/clients/profile');
    return response.data;
  },
  
  // Update client profile
  updateProfile: async (data: Partial<ClientType>): Promise<ClientType> => {
    const response = await api.put('/clients/profile', data);
    return response.data;
  },
  
  // Get client dashboard data
  getDashboardData: async (): Promise<ClientDashboardData> => {
    const response = await api.get('/clients/dashboard');
    return response.data;
  },
  
  // Get client projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/clients/projects');
    return response.data;
  },
  
  // Search client projects
  searchProjects: async (searchTerm: string, status?: string): Promise<Project[]> => {
    let url = '/clients/projects/search?';
    if (searchTerm) url += `q=${encodeURIComponent(searchTerm)}&`;
    if (status) url += `status=${encodeURIComponent(status)}`;
    
    const response = await api.get(url);
    return response.data;
  },
  
  // Get a specific project
  getProject: async (projectId: string): Promise<Project> => {
    const response = await api.get(`/clients/projects/${projectId}`);
    return response.data;
  },
  
  // Update a project
  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await api.put(`/clients/projects/${projectId}`, projectData);
    return response.data;
  },
  
  // Update project status
  updateProjectStatus: async (projectId: string, status: 'active' | 'completed' | 'on_hold'): Promise<Project> => {
    const response = await api.patch(`/clients/projects/${projectId}/status`, { status });
    return response.data;
  },
  
  // Get project updates
  getProjectUpdates: async (projectId: string): Promise<ProjectUpdate[]> => {
    const response = await api.get(`/clients/projects/${projectId}/updates`);
    return response.data;
  },
  
  // Get all documents for the client
  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/clients/documents');
    return response.data;
  },
  
  // Get documents for a specific project
  getProjectDocuments: async (projectId: string): Promise<Document[]> => {
    const response = await api.get(`/clients/projects/${projectId}/documents`);
    return response.data;
  },
  
  // Upload document
  uploadDocument: async (projectId: string, file: File, title: string): Promise<Document> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      
      const response = await api.post(`/clients/projects/${projectId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Add progress tracking for large files
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Upload progress: ${percentCompleted}%`);
          // This could be used for a progress bar in the UI
        },
      });
      return response.data;
    } catch (error: any) {
      // Handle specific error cases from the API
      if (error.response) {
        const { status, data } = error.response;
        
        // File size too large
        if (status === 400 && data.code === 'FILE_TOO_LARGE') {
          throw new Error('The file is too large. Maximum size is 10MB.');
        }
        
        // Invalid file type
        if (status === 400 && data.code === 'INVALID_FILE_TYPE') {
          throw new Error('Invalid file type. Please upload a supported file format.');
        }
        
        // Other API errors
        if (data.message) {
          throw new Error(data.message);
        }
      }
      
      // Generic error
      throw new Error('Failed to upload document. Please try again later.');
    }
  },
  
  // Download document
  downloadDocument: async (documentId: string): Promise<Blob> => {
    try {
      const response = await api.get(`/clients/documents/${documentId}/download`, {
        responseType: 'blob',
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'document';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return response.data;
    } catch (error: any) {
      console.error('Error downloading document:', error);
      
      // Handle specific error status codes
      if (error.response) {
        const { status } = error.response;
        
        if (status === 404) {
          throw new Error('Document not found or has been deleted.');
        }
        
        if (status === 403) {
          throw new Error('You do not have permission to access this document.');
        }
      }
      
      throw new Error('Failed to download document. Please try again later.');
    }
  },
  
  // Get invoices
  getInvoices: async (): Promise<any[]> => {
    const response = await api.get('/clients/invoices');
    return response.data;
  },
  
  // Get all messages for the client
  getMessages: async (): Promise<Message[]> => {
    const response = await api.get('/clients/messages');
    return response.data;
  },
  
  // Get messages for a specific project
  getProjectMessages: async (projectId: string): Promise<Message[]> => {
    const response = await api.get(`/clients/projects/${projectId}/messages`);
    return response.data;
  },
  
  // Send a message
  sendMessage: async (projectId: string, message: string, attachment?: File): Promise<Message> => {
    if (attachment) {
      const formData = new FormData();
      formData.append('projectId', projectId);
      formData.append('message', message);
      formData.append('attachment', attachment);
      
      const response = await api.post('/clients/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await api.post('/clients/messages', {
        projectId,
        message,
      });
      return response.data;
    }
  },
}; 