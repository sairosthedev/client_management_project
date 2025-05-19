import React, { useEffect, useState } from 'react';
import { checkClientAuthentication, registerTestClient } from '../services/clientService';

const DebugPage: React.FC = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get values from localStorage
    const storedClientId = localStorage.getItem('clientId');
    const storedToken = localStorage.getItem('token');
    
    setClientId(storedClientId);
    setToken(storedToken);
  }, []);

  const handleRegisterTestClient = async () => {
    try {
      setIsLoading(true);
      setMessage('Registering test client...');
      const newClientId = await registerTestClient();
      setClientId(newClientId);
      setMessage(`Successfully registered new client with ID: ${newClientId}`);
    } catch (error) {
      console.error('Error registering test client:', error);
      setMessage('Failed to register test client. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthentication = () => {
    const { clientId, isAuthenticated } = checkClientAuthentication();
    if (isAuthenticated) {
      setMessage(`Client authenticated with ID: ${clientId}`);
    } else {
      setMessage('Client is not authenticated. No clientId found in localStorage.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('Failed') ? 'bg-red-100' : 'bg-green-100'}`}>
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Authentication State</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Client ID:</span>{' '}
            {clientId ? <code className="bg-gray-100 px-2 py-1 rounded">{clientId}</code> : 'Not set'}
          </p>
          <p>
            <span className="font-medium">Auth Token:</span>{' '}
            {token ? <code className="bg-gray-100 px-2 py-1 rounded">{token?.substring(0, 20)}...</code> : 'Not set'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            onClick={checkAuthentication}
            disabled={isLoading}
          >
            Check Authentication
          </button>
          
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            onClick={handleRegisterTestClient}
            disabled={isLoading}
          >
            {isLoading ? 'Working...' : 'Register Test Client'}
          </button>
          
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            onClick={() => {
              localStorage.removeItem('clientId');
              setClientId(null);
              setMessage('Removed client ID from localStorage');
            }}
            disabled={isLoading}
          >
            Clear Client ID
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Manual Client ID</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter client ID"
            className="flex-1 px-4 py-2 border border-gray-300 rounded"
            value={clientId || ''}
            onChange={(e) => setClientId(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              if (clientId) {
                localStorage.setItem('clientId', clientId);
                setMessage(`Set client ID to: ${clientId}`);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPage; 