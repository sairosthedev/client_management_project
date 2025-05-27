import React from 'react';
import { FiFolder, FiCalendar, FiClock, FiUsers, FiSettings, FiPlus } from 'react-icons/fi';
import { Project } from '../../services/projectService';
import { Task } from '../../types';
import { TeamMemberType } from '../../types';

interface ProjectDetailsModalProps {
  project: Project;
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
                    <p className="text-gray-600">{project.description}</p>
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
                {/* Project Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="font-medium">{project.client.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Project Manager</p>
                      <p className="font-medium">{project.projectManager.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                    </div>
                    {project.endDate && (
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                      </div>
                    )}
                    {project.budget && (
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-medium">{project.budget.amount} {project.budget.currency}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Team Members</h3>
                    <button
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                      onClick={onAddTaskClick}
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Member
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.team.map(member => (
                      <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Milestones</h3>
                    <button
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                      onClick={onAddTaskClick}
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Milestone
                    </button>
                  </div>
                  <div className="space-y-3">
                    {project.milestones.map(milestone => (
                      <div key={milestone._id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{milestone.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            {milestone.dueDate && (
                              <p className="text-sm text-gray-500 mt-2">
                                Due: {new Date(milestone.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded text-sm ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                            milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                {project.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.documents.map((doc, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-600">{doc.type}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Uploaded by {doc.uploadedBy.name} on {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {project.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-600">{project.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 