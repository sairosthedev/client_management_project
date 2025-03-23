import React, { useState } from 'react';
import { FiPlus, FiX, FiCheck, FiCalendar, FiFlag } from 'react-icons/fi';

export interface MilestoneType {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  tasks: string[]; // Task IDs associated with this milestone
  deliverables: string[];
}

interface MilestoneProps {
  milestones: MilestoneType[];
  onAddMilestone: (milestone: Omit<MilestoneType, 'id'>) => Promise<void>;
  onUpdateMilestone: (id: string, updates: Partial<MilestoneType>) => Promise<void>;
  onDeleteMilestone: (id: string) => Promise<void>;
  projectTasks?: Array<{ id: string; title: string }>;
}

const Milestone: React.FC<MilestoneProps> = ({
  milestones,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  projectTasks = [],
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState<Omit<MilestoneType, 'id'>>({
    title: '',
    description: '',
    dueDate: new Date(),
    status: 'pending',
    progress: 0,
    tasks: [],
    deliverables: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newMilestone.title || !newMilestone.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingMilestone) {
        await onUpdateMilestone(editingMilestone.id, newMilestone);
      } else {
        await onAddMilestone(newMilestone);
      }
      setShowAddModal(false);
      setEditingMilestone(null);
      setNewMilestone({
        title: '',
        description: '',
        dueDate: new Date(),
        status: 'pending',
        progress: 0,
        tasks: [],
        deliverables: [],
      });
    } catch (error) {
      setError('Failed to save milestone');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewMilestone(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskToggle = (taskId: string) => {
    setNewMilestone(prev => ({
      ...prev,
      tasks: prev.tasks.includes(taskId)
        ? prev.tasks.filter(id => id !== taskId)
        : [...prev.tasks, taskId],
    }));
  };

  const handleDeliverableAdd = () => {
    const deliverable = prompt('Enter deliverable:');
    if (deliverable?.trim()) {
      setNewMilestone(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, deliverable.trim()],
      }));
    }
  };

  const handleDeliverableRemove = (index: number) => {
    setNewMilestone(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }));
  };

  const getStatusColor = (status: MilestoneType['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    milestone.status
                  )}`}
                >
                  {milestone.status.replace('_', ' ').charAt(0).toUpperCase() +
                    milestone.status.slice(1)}
                </span>
                <button
                  onClick={() => {
                    setEditingMilestone(milestone);
                    setNewMilestone(milestone);
                    setShowAddModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiCheck />
                </button>
                <button
                  onClick={() => onDeleteMilestone(milestone.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar className="w-4 h-4" />
                <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
              </div>

              {milestone.tasks.length > 0 && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Associated Tasks:</p>
                  <ul className="list-disc list-inside">
                    {milestone.tasks.map(taskId => {
                      const task = projectTasks.find(t => t.id === taskId);
                      return task ? (
                        <li key={taskId} className="text-gray-600">
                          {task.title}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}

              {milestone.deliverables.length > 0 && (
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Deliverables:</p>
                  <ul className="list-disc list-inside">
                    {milestone.deliverables.map((deliverable, index) => (
                      <li key={index} className="text-gray-600">
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Milestone Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
        >
          <FiPlus className="w-6 h-6 mb-2" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Add/Edit Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMilestone(null);
                }}
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
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={newMilestone.title}
                  onChange={handleInputChange}
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
                  value={newMilestone.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={new Date(newMilestone.dueDate).toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newMilestone.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress
                </label>
                <input
                  type="number"
                  name="progress"
                  value={newMilestone.progress}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Tasks
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {projectTasks.map(task => (
                    <label key={task.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMilestone.tasks.includes(task.id)}
                        onChange={() => handleTaskToggle(task.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{task.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deliverables
                </label>
                <div className="space-y-2">
                  {newMilestone.deliverables.map((deliverable, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{deliverable}</span>
                      <button
                        type="button"
                        onClick={() => handleDeliverableRemove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleDeliverableAdd}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <FiPlus /> Add Deliverable
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMilestone(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingMilestone ? 'Update Milestone' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Milestone; 