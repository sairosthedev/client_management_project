import React, { useState } from 'react';
import { FiPlus, FiX, FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';

export interface TeamMemberType {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  department?: string;
}

interface TeamMemberProps {
  members: TeamMemberType[];
  onAddMember: (member: Omit<TeamMemberType, 'id'>) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onUpdateMember?: (memberId: string, updates: Partial<TeamMemberType>) => Promise<void>;
  availableRoles?: string[];
}

const TeamMember: React.FC<TeamMemberProps> = ({
  members,
  onAddMember,
  onRemoveMember,
  onUpdateMember,
  availableRoles = ['Developer', 'Designer', 'Project Manager', 'QA Engineer'],
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMemberType, 'id'>>({
    name: '',
    email: '',
    role: availableRoles[0],
    phone: '',
    department: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newMember.name || !newMember.email || !newMember.role) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onAddMember(newMember);
      setShowAddModal(false);
      setNewMember({
        name: '',
        email: '',
        role: availableRoles[0],
        phone: '',
        department: '',
      });
    } catch (error) {
      setError('Failed to add team member');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveMember(member.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <FiX />
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <FiMail className="mr-2" /> {member.email}
              </p>
              {member.phone && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FiPhone className="mr-2" /> {member.phone}
                </p>
              )}
              {member.department && (
                <p className="text-sm text-gray-600 flex items-center">
                  <FiBriefcase className="mr-2" /> {member.department}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Add Member Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
        >
          <FiPlus className="w-6 h-6 mb-2" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Team Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newMember.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={newMember.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  name="role"
                  value={newMember.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={newMember.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={newMember.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMember; 