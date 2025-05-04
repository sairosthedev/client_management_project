import React from 'react';
import { FiFolder, FiCalendar, FiClock, FiUsers, FiSettings, FiPlus } from 'react-icons/fi';
import { Project } from '../../mocks/projects';
import { Task } from '../../types';
import { TeamMemberType } from '../../types';

interface ProjectDetailsModalProps {
  project: Project;
  tasks: Task[];
  onClose: () => void;
  onSettingsClick: () => void;
  onAddTaskClick: () => void;
  onEditTask: (task: Task) => void;
}

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  tasks,
  onClose,
  onSettingsClick,
  onAddTaskClick,
  onEditTask,
}) => {
  return (
    <div className="fixed inset-0 z-[1] overflow-hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl shadow-xl transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiFolder className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{project.name}</h2>
                    <p className="text-gray-600">{tasks.length} tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                    onClick={onSettingsClick}
                  >
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Tasks</h3>
                    <button
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                      onClick={onAddTaskClick}
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Task
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {task.description}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                {formatTime(task.timeSpent)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiUsers className="w-4 h-4" />
                                {task.assignee?.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => onEditTask(task)}
                            >
                              Edit
                            </button>
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                task.status === 'done'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 