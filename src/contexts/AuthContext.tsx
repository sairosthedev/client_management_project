import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { UserRole } from '../types';
import { getDashboardPath } from '../utils/dashboardPaths';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  contactNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    clientData?: { company: string; contactNumber: string }
  ) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check authentication status on mount and restore session
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          // Load user data if token exists
          await loadUser();
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const loadUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Error loading user:', err);
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      return null;
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Try to fetch current user to validate session
      const userData = await loadUser();
      setIsLoading(false);
      return !!userData;
    } catch (err) {
      console.error('Session refresh failed:', err);
      // Automatic logout on failed refresh
      logout();
      setIsLoading(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate to the appropriate dashboard
      if (response.user) {
        navigate(getDashboardPath(response.user.role as UserRole), { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    clientData?: { company: string; contactNumber: string }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
        agreedToTerms: true,
        ...(role === 'client' && clientData ? clientData : {})
      });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Navigate to the appropriate dashboard
      if (response.user) {
        navigate(getDashboardPath(response.user.role as UserRole), { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // If we're in a client session, also remove clientId
    if (user?.role === 'client') {
      localStorage.removeItem('clientId');
    }
    navigate('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 