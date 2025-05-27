import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token and client-id to requests if they exist
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    
    // If accessing client routes, try to get client information from user data
    if (config.url?.startsWith('/clients')) {
      try {
        // Try to get user info from localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          // If the user is a client and has an ID, use it for client-id header
          if (user && user.role === 'client' && user.id) {
            config.headers['client-id'] = user.id;
          } else {
            // Fall back to dedicated clientId if available
            const clientId = localStorage.getItem('clientId');
            if (clientId) {
              config.headers['client-id'] = clientId;
            }
          }
        } else {
          // Fall back to dedicated clientId if available
          const clientId = localStorage.getItem('clientId');
          if (clientId) {
            config.headers['client-id'] = clientId;
          }
        }
      } catch (error) {
        console.error('Error parsing user data for client authentication:', error);
        // Fall back to dedicated clientId if available
        const clientId = localStorage.getItem('clientId');
        if (clientId) {
          config.headers['client-id'] = clientId;
        }
      }
    }
  }
  
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Types for registration data
type UserRole = 'developer' | 'project_manager' | 'client' | 'qa_engineer' | 'designer' | 'admin';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  agreedToTerms: boolean;
  // Role-specific fields
  company?: string;
  contactNumber?: string;
  skills?: string[];
  experience?: number;
  hourlyRate?: number;
  specializations?: string[];
  portfolio?: string[];
  designTools?: string[];
}

// Register a user with role-specific data
export const registerUser = async (userData: RegistrationData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Store role-specific data in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Store role-specific IDs
      if (response.data.user.role === 'client') {
        localStorage.setItem('clientId', response.data.user.id);
      } else if (response.data.user.role === 'developer') {
        localStorage.setItem('developerId', response.data.user.id);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Legacy client registration function (for backward compatibility)
export const registerClient = async (clientData: {
  name: string;
  email: string;
  password: string;
  company: string;
  contactNumber?: string;
}) => {
  return registerUser({
    ...clientData,
    role: 'client',
    agreedToTerms: true
  });
};

export const authService = {
  register: async (data: RegistrationData) => {
    return registerUser(data);
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    
    // Store role-specific data
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'client') {
        localStorage.setItem('clientId', response.data.user.id);
      } else if (response.data.user.role === 'developer') {
        localStorage.setItem('developerId', response.data.user.id);
      }
    }
    
    // Store the token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    
    // Store role-specific data
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      
      if (response.data.role === 'client') {
        localStorage.setItem('clientId', response.data.id);
      } else if (response.data.role === 'developer') {
        localStorage.setItem('developerId', response.data.id);
      }
    }
    
    return response.data;
  },
};

export default api; 