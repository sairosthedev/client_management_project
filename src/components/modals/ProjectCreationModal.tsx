import React from 'react';
import { ModalContainer } from './ModalContainer';
import { ModalHeader } from './ModalHeader';
import ProjectForm from '../forms/ProjectForm';
import { Project } from '../../types/project';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => Promise<void>;
  isSubmitting: boolean;
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      zIndex={20}
    >
      <div className="p-4">
        <ModalHeader title="Create New Project" onClose={onClose} />
        <ProjectForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </ModalContainer>
  );
}; 