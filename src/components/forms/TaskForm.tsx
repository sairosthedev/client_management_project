import React from 'react';
import { FiAlignLeft, FiCalendar, FiFlag, FiUser, FiBriefcase } from 'react-icons/fi';

interface TaskFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: TeamMemberType;
  dueDate: string;
  project: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  timeEstimate: number;
  dependencies: string[];
  files: FileAttachmentType[];
  activities: ActivityItem[];
  timeSpent: number;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  projects?: { id: string; name: string; }[];
  team?: { id: string; name: string; avatar: string; }[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  isSubmitting = false,
  projects = [],
  team = [],
}) => {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    priority: initialData.priority || 'medium',
    assignee: initialData.assignee,
    dueDate: initialData.dueDate || new Date().toISOString().split('T')[0],
    project: initialData.project || '',
    status: initialData.status || 'todo',
    timeEstimate: initialData.timeEstimate || 0,
    dependencies: initialData.dependencies || [],
    files: initialData.files || [],
    activities: initialData.activities || [],
    timeSpent: initialData.timeSpent || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'timeEstimate') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTeamMember = team.find(member => member.id === e.target.value);
    if (selectedTeamMember) {
      setFormData(prev => ({
        ...prev,
        assignee: {
          id: selectedTeamMember.id,
          name: selectedTeamMember.name,
          avatar: selectedTeamMember.avatar,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, assignee: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiAlignLeft className="text-gray-400" />
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>
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
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFlag className="text-gray-400" />
            </div>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <select
              value={formData.assignee?.id || ''}
              onChange={handleAssigneeChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Assignee</option>
              {team.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiBriefcase className="text-gray-400" />
            </div>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Estimate (minutes)
          </label>
          <input
            type="number"
            name="timeEstimate"
            value={formData.timeEstimate}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter time estimate in minutes"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 