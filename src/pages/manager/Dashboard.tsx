import React from 'react';
import {
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiClock,
  FiAlertCircle,
  FiTrendingUp
} from 'react-icons/fi';

const ManagerDashboard: React.FC = () => {
  // Mock data - in a real app, these would come from an API
  const stats = {
    activeProjects: 8,
    teamMembers: 24,
    tasksCompleted: 156,
    upcomingDeadlines: 12,
    totalHoursLogged: 840,
    projectProgress: 78.5
  };

  const StatCard: React.FC<{
    icon: React.ElementType;
    label: string;
    value: number | string;
    trend?: number;
  }> = ({ icon: Icon, label, value, trend }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{value}</h3>
            <p className="text-gray-600 text-sm">{label}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Project Manager Dashboard</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Create Project
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Reports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FiFolder}
          label="Active Projects"
          value={stats.activeProjects}
          trend={5.2}
        />
        <StatCard
          icon={FiUsers}
          label="Team Members"
          value={stats.teamMembers}
          trend={2.1}
        />
        <StatCard
          icon={FiCheckSquare}
          label="Tasks Completed"
          value={stats.tasksCompleted}
          trend={12.5}
        />
        <StatCard
          icon={FiAlertCircle}
          label="Upcoming Deadlines"
          value={stats.upcomingDeadlines}
        />
        <StatCard
          icon={FiClock}
          label="Hours Logged"
          value={`${stats.totalHoursLogged}h`}
        />
        <StatCard
          icon={FiTrendingUp}
          label="Project Progress"
          value={`${stats.projectProgress}%`}
          trend={3.2}
        />
      </div>

      {/* Project Timeline */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Project Timeline</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            {/* Timeline items would go here */}
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium">E-commerce Platform</h3>
                <p className="text-sm text-gray-600">Phase 2 Development</p>
              </div>
              <div className="text-sm text-gray-600">Due in 5 days</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium">Mobile App</h3>
                <p className="text-sm text-gray-600">UI/UX Review</p>
              </div>
              <div className="text-sm text-gray-600">Due tomorrow</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              <div className="flex-1">
                <h3 className="font-medium">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">Testing Phase</p>
              </div>
              <div className="text-sm text-gray-600">Due in 2 weeks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard; 