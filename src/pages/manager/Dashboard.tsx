import React, { useState } from 'react';
import {
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiClock,
  FiAlertCircle,
  FiTrendingUp
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../../components/forms/ProjectForm';
import { StatCard } from '../../components/dashboard/StatCard';
import { Timeline } from '../../components/dashboard/Timeline';
import { Modal } from '../../components/common/Modal';
import { mockStats, mockTeam, mockClients, mockTimelineItems } from '../../mocks/dashboardData';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating project:', formData);
      setShowProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Project Manager Dashboard</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Create Project
          </button>
          <button 
            onClick={() => navigate('/manager/reports')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiFolder}
          label="Active Projects"
          value={mockStats.activeProjects}
          trend={5.2}
        />
        <StatCard
          icon={FiUsers}
          label="Team Members"
          value={mockStats.teamMembers}
          trend={2.1}
        />
        <StatCard
          icon={FiCheckSquare}
          label="Tasks Completed"
          value={mockStats.tasksCompleted}
          trend={12.5}
        />
        <StatCard
          icon={FiAlertCircle}
          label="Upcoming Deadlines"
          value={mockStats.upcomingDeadlines}
        />
        <StatCard
          icon={FiClock}
          label="Hours Logged"
          value={`${mockStats.totalHoursLogged}h`}
        />
        <StatCard
          icon={FiTrendingUp}
          label="Project Progress"
          value={`${mockStats.projectProgress}%`}
          trend={3.2}
        />
      </div>

      {/* Project Timeline */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Project Timeline</h2>
        <Timeline items={mockTimelineItems} />
      </div>

      {/* Project Creation Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        title="Create New Project"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectModal(false)}
          isSubmitting={isSubmitting}
          clients={mockClients}
          team={mockTeam}
        />
      </Modal>
    </div>
  );
};

export default ManagerDashboard; 