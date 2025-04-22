import React from 'react';
import { FiUser, FiMail, FiPhone, FiHome } from 'react-icons/fi';

interface ClientFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState<ClientFormData>({
    name: initialData.name || '',
    company: initialData.company || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    status: initialData.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Client Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Smith"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiHome className="text-gray-400" />
          </div>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tech Solutions Inc"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sairosmac@gmail.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiPhone className="text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+263 (78) 603-3973"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Client'}
        </button>
      </div>
    </form>
  );
};

export default ClientForm; 