import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, DEFAULT_ROLE_PERMISSIONS } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create the AuthContext with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Simply return a default context if undefined (for testing/debug)
  if (!context) {
    console.warn('useAuth was called outside of AuthProvider. Using mock data.');
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: () => {},
      error: null
    };
  }
  
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('User loaded from localStorage:', parsedUser);
      }
    } catch (e) {
      console.error('Error loading user from localStorage:', e);
      localStorage.removeItem('user');
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', email, password);
      // For demo, simulate a brief delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simple mock authentication
      if (email && password) {
        // Determine role based on email domain or specific addresses
        let role: UserRole = 'client'; // Default role
        
        if (email.includes('admin') || email === 'admin@example.com') {
          role = 'admin';
        } else if (email.includes('dev') || email.endsWith('@developer.com')) {
          role = 'developer';
        } else if (email.includes('pm') || email.includes('manager')) {
          role = 'project_manager';
        } else if (email.includes('qa') || email.includes('test')) {
          role = 'qa_engineer';
        } else if (email.includes('design')) {
          role = 'designer';
        }
        
        const newUser = {
          id: '1',
          email,
          name: email.split('@')[0],
          role,
          avatar: '/avatars/default.jpg'
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        console.log('Login successful:', newUser);
        return;
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Registering new user:', { name, email, role });
      // For demo, simulate a brief delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful registration
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        avatar: '/avatars/default.jpg'
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('Registration successful:', newUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      console.error('Registration error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 