import React, { useState } from 'react';
import { FiCalendar, FiUser, FiAlignLeft } from 'react-icons/fi';
import { Client } from '../../types';
import { CreateProjectData } from '../../services/projectService';
import { User } from '../../services/userService';

interface ProjectFormProps {
  initialData?: Partial<CreateProjectData>;
  onSubmit: (data: CreateProjectData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  clients?: Client[];
  team?: User[];
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  clients = [],
  team = [],
}) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: initialData.name || '',
    description: initialData.description || '',
    startDate: initialData.startDate || new Date().toISOString().split('T')[0],
    endDate: initialData.endDate || '',
    client: initialData.client || '',
    budget: initialData.budget || { amount: 0, currency: 'USD' },
    priority: initialData.priority || 'medium',
    team: initialData.team || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'budget') {
      setFormData(prev => ({
        ...prev,
        budget: {
          ...prev.budget,
          amount: parseFloat(value) || 0
        }
      }));
    } else if (name === 'team') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        team: selectedOptions
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="text-gray-400" />
          </div>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} ({client.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Budget
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            name="budget"
            value={formData.budget.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
          <select
            name="budgetCurrency"
            value={formData.budget.currency}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              budget: {
                ...prev.budget,
                currency: e.target.value
              }
            }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Members
        </label>
        <select
          multiple
          name="team"
          value={formData.team}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          size={4}
        >
          {team.map(member => (
            <option key={member._id} value={member._id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm; 