import React from 'react';
import { ModalContainer } from './ModalContainer';
import { ModalHeader } from './ModalHeader';
import TaskForm from '../forms/TaskForm';
import { Task } from '../../types/task';
import { TeamMember } from '../../types/team';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => Promise<void>;
  isSubmitting: boolean;
  editingTask: Task | null;
  team: TeamMember[];
  clientId: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingTask,
  team,
  clientId,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      zIndex={30}
    >
      <div className="p-4">
        <ModalHeader 
          title={editingTask ? 'Edit Task' : 'Create New Task'} 
          onClose={onClose} 
        />
        <TaskForm
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description,
            status: editingTask.status,
            priority: editingTask.priority,
            assignee: editingTask.assignee,
            dueDate: editingTask.dueDate.toISOString().split('T')[0],
            estimatedHours: editingTask.estimatedHours,
            project: editingTask.project,
            client: editingTask.client,
          } : undefined}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          team={team}
          clientId={clientId}
        />
      </div>
    </ModalContainer>
  );
}; 