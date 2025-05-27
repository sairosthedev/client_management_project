import React, { useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../services/projectService';

interface ProjectDetailProps {
  projectId: string;
  onClose?: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onClose }) => {
  const {
    currentProject,
    loading,
    error,
    fetchProject,
    updateProject,
    addTeamMember,
    removeTeamMember,
    addMilestone,
    updateMilestoneStatus
  } = useProjects();

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId, fetchProject]);

  if (loading) {
    return <div>Loading project details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentProject) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{currentProject.name}</h2>
          <p className="text-gray-600">{currentProject.description}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            currentProject.status === 'completed' ? 'bg-green-100 text-green-800' :
            currentProject.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            currentProject.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {currentProject.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            currentProject.priority === 'high' ? 'bg-red-100 text-red-800' :
            currentProject.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {currentProject.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Project Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Client:</span> {currentProject.client.company}</p>
              <p><span className="font-medium">Project Manager:</span> {currentProject.projectManager.name}</p>
              <p><span className="font-medium">Start Date:</span> {new Date(currentProject.startDate).toLocaleDateString()}</p>
              {currentProject.endDate && (
                <p><span className="font-medium">End Date:</span> {new Date(currentProject.endDate).toLocaleDateString()}</p>
              )}
              {currentProject.budget && (
                <p>
                  <span className="font-medium">Budget:</span> {currentProject.budget.amount} {currentProject.budget.currency}
                </p>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-lg font-semibold">Team Members</h3>
            <div className="mt-2 space-y-2">
              {currentProject.team.map(member => (
                <div key={member._id} className="flex items-center justify-between">
                  <span>{member.name}</span>
                  <button
                    onClick={() => removeTeamMember(currentProject._id, member._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <h3 className="text-lg font-semibold">Milestones</h3>
          <div className="mt-2 space-y-4">
            {currentProject.milestones.map(milestone => (
              <div key={milestone._id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{milestone.name}</h4>
                    <p className="text-sm text-gray-600">{milestone.description}</p>
                  </div>
                  <select
                    value={milestone.status}
                    onChange={(e) => updateMilestoneStatus(
                      currentProject._id,
                      milestone._id,
                      e.target.value as 'pending' | 'in-progress' | 'completed'
                    )}
                    className="text-sm border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                {milestone.dueDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}
      {currentProject.documents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Documents</h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProject.documents.map((doc, index) => (
              <div key={index} className="border rounded-lg p-3">
                <p className="font-medium">{doc.name}</p>
                <p className="text-sm text-gray-600">{doc.type}</p>
                <p className="text-sm text-gray-500">
                  Uploaded by {doc.uploadedBy.name} on {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View Document
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {currentProject.notes && (
        <div>
          <h3 className="text-lg font-semibold">Notes</h3>
          <p className="mt-2 text-gray-600">{currentProject.notes}</p>
        </div>
      )}
    </div>
  );
}; 