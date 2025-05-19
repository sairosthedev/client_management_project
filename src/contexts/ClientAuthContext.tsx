import React, { createContext, useContext, useState, useEffect } from 'react';
import { clientService, ClientType } from '../services/clientService';
import api, { registerClient } from '../services/api';
import { useAuth } from './AuthContext';

interface ClientAuthContextType {
  client: ClientType | null;
  clientId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, company: string) => Promise<void>;
  logout: () => void;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export const ClientAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<ClientType | null>(null);
  const [clientId, setClientId] = useState<string | null>(localStorage.getItem('clientId'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  // Check for saved client on initial load
  useEffect(() => {
    const checkClientAuth = async () => {
      try {
        const savedClientId = localStorage.getItem('clientId');
        if (savedClientId) {
          setClientId(savedClientId);
          const isAuthenticated = await clientService.checkAuthentication();
          
          if (isAuthenticated) {
            // If authenticated, fetch client profile
            const clientProfile = await clientService.getProfile();
            setClient(clientProfile);
            // Sync with main auth context
            setUser({
              id: clientProfile.id,
              email: clientProfile.email,
              name: clientProfile.name,
              role: 'client',
              company: clientProfile.company
            });
          } else {
            // If authentication check fails, clear client info
            logout();
          }
        }
      } catch (err) {
        console.error('Error checking client authentication:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkClientAuth();
  }, [setUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${api.defaults.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Check if the logged-in user is a client
      if (data.user?.role !== 'client') {
        throw new Error('This account is not a client account');
      }
      
      // Store client ID and token
      localStorage.setItem('clientId', data.user.id);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setClientId(data.user.id);
      
      // Load the client profile
      const clientProfile = await clientService.getProfile();
      setClient(clientProfile);
      
      // Sync with main auth context
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: 'client',
        company: data.user.company
      });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, company: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerClient({ 
        name, 
        email, 
        password, 
        company 
      });
      
      // Client ID is already stored in localStorage by registerClient
      setClientId(response.client.id);
      
      // Load the client profile
      const clientProfile = await clientService.getProfile();
      setClient(clientProfile);
      
      // Sync with main auth context
      setUser({
        id: response.client.id,
        email: response.client.email,
        name: response.client.name,
        role: 'client',
        company: response.client.company
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setClient(null);
    setClientId(null);
    localStorage.removeItem('clientId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear main auth context
    setUser(null);
  };

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        clientId,
        isAuthenticated: !!clientId && !!client,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
};

export const useClientAuth = () => {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
};

export default ClientAuthContext; 