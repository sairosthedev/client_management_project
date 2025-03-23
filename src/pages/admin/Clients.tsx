import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiMail, FiPhone, FiX } from 'react-icons/fi';
import ClientForm from '../../components/forms/ClientForm';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projects: number;
  status: 'active' | 'inactive';
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    projects: 3,
    status: 'active',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Digital Innovations',
    email: 'sarah@digitalinnovations.com',
    phone: '+1 (555) 234-5678',
    projects: 2,
    status: 'active',
  },
  // Add more mock data as needed
];

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = async (formData: Omit<Client, 'id' | 'projects'>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClient: Client = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        projects: 0,
      };
      
      setClients(prev => [...prev, newClient]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClient = async (formData: Omit<Client, 'id' | 'projects'>) => {
    if (!editingClient) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClients(prev =>
        prev.map(client =>
          client.id === editingClient.id
            ? { ...client, ...formData }
            : client
        )
      );
      setEditingClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setClients(prev => prev.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add New Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client/Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Projects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <FiPhone className="text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {client.projects} Projects
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    client.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Client Modal */}
      {(showAddModal || editingClient) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingClient(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <ClientForm
              initialData={editingClient || {}}
              onSubmit={editingClient ? handleEditClient : handleAddClient}
              onCancel={() => {
                setShowAddModal(false);
                setEditingClient(null);
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage; 