import { useState, useCallback } from 'react';
import api from '../services/api';
import { Client } from '../types';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients
  };
}; 