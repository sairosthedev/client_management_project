import React from 'react';
import { ModalContainer } from './ModalContainer';
import { ModalHeader } from './ModalHeader';
import ProjectSettings from '../forms/ProjectSettings';
import { Project } from '../../types/project';
import { TeamMember } from '../../types/team';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => Promise<void>;
  isSubmitting: boolean;
  project: Project | null;
  team: TeamMember[];
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  project,
  team,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      zIndex={40}
    >
      <div className="p-4">
        <ModalHeader title="Project Settings" onClose={onClose} />
        {project ? (
          <ProjectSettings
            initialData={{
              name: project.name,
              description: project.description,
              startDate: project.startDate.toISOString().split('T')[0],
              endDate: project.endDate.toISOString().split('T')[0],
              client: project.client,
              status: project.status,
              team: project.team.map(member => member.id),
            }}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
            team={team}
          />
        ) : (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            <p>Error: Project data not found</p>
          </div>
        )}
      </div>
    </ModalContainer>
  );
}; 