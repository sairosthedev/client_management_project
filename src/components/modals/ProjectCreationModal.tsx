import React, { useEffect, useState } from 'react';
import { ModalContainer } from './ModalContainer';
import { ModalHeader } from './ModalHeader';
import ProjectForm from '../forms/ProjectForm';
import { CreateProjectData } from '../../services/projectService';
import { useClients } from '../../hooks/useClients';
import { userService, User } from '../../services/userService';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: CreateProjectData) => Promise<void>;
  isSubmitting: boolean;
}

export const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const { clients, loading: clientsLoading, error: clientsError, fetchClients } = useClients();
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchTeamMembers();
    }
  }, [isOpen, fetchClients]);

  const fetchTeamMembers = async () => {
    try {
      setLoadingTeam(true);
      setTeamError(null);
      const members = await userService.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamError('Failed to load team members');
    } finally {
      setLoadingTeam(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Create New Project" onClose={onClose} />
      <div className="p-6">
        {clientsError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {clientsError}
          </div>
        )}
        {teamError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {teamError}
          </div>
        )}
        <ProjectForm
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          clients={clients}
          team={teamMembers}
        />
      </div>
    </ModalContainer>
  );
}; 