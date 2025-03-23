import React from 'react';
import { FiTrendingUp, FiClock, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { MilestoneType } from './Milestone';
import { TeamMemberType } from './TeamMember';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee?: TeamMemberType;
  timeEstimate: number;
  timeSpent: number;
  dueDate: Date;
}

interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalTimeSpent: number;
  totalTimeEstimate: number;
  teamMembers: TeamMemberType[];
  milestones: MilestoneType[];
  tasks: Task[];
}

interface ProjectAnalyticsProps {
  metrics: ProjectMetrics;
  startDate: Date;
  endDate: Date;
}

const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  metrics,
  startDate,
  endDate,
}) => {
  const calculateProgress = () => {
    return metrics.totalTasks > 0
      ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
      : 0;
  };

  const calculateTimeProgress = () => {
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = Date.now() - startDate.getTime();
    return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  };

  const calculateBurndown = () => {
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingTasks = metrics.totalTasks - metrics.completedTasks;
    return remainingTasks / totalDays;
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTasksByStatus = () => {
    const statusCounts: { [key: string]: number } = {};
    metrics.tasks.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });
    return statusCounts;
  };

  const getTasksByPriority = () => {
    const priorityCounts: { [key: string]: number } = {};
    metrics.tasks.forEach(task => {
      priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
    });
    return priorityCounts;
  };

  const getTasksByAssignee = () => {
    const assigneeCounts: { [key: string]: number } = {};
    metrics.tasks.forEach(task => {
      if (task.assignee) {
        assigneeCounts[task.assignee.name] = (assigneeCounts[task.assignee.name] || 0) + 1;
      }
    });
    return assigneeCounts;
  };

  const getMilestoneProgress = () => {
    return metrics.milestones.map(milestone => ({
      title: milestone.title,
      progress: milestone.progress,
      status: milestone.status,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <p className="text-2xl font-bold">{calculateProgress()}%</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Time Tracking</p>
              <p className="text-2xl font-bold">
                {formatTime(metrics.totalTimeSpent)} / {formatTime(metrics.totalTimeEstimate)}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-600 rounded-full h-2"
              style={{
                width: `${Math.min(
                  (metrics.totalTimeSpent / metrics.totalTimeEstimate) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Team Members</p>
              <p className="text-2xl font-bold">{metrics.teamMembers.length}</p>
            </div>
            <FiUsers className="w-8 h-8 text-green-500" />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {metrics.completedTasks} tasks completed
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasks Status</p>
              <p className="text-2xl font-bold">
                {metrics.completedTasks}/{metrics.totalTasks}
              </p>
            </div>
            <div className="flex gap-2">
              <FiCheckCircle className="w-8 h-8 text-green-500" />
              {metrics.overdueTasks > 0 && (
                <FiAlertCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {metrics.overdueTasks} tasks overdue
          </p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Tasks by Status</h3>
          <div className="space-y-4">
            {Object.entries(getTasksByStatus()).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 rounded-full h-2"
                    style={{
                      width: `${(count / metrics.totalTasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Tasks by Priority</h3>
          <div className="space-y-4">
            {Object.entries(getTasksByPriority()).map(([priority, count]) => (
              <div key={priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 ${
                      priority === 'high'
                        ? 'bg-red-600'
                        : priority === 'medium'
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}
                    style={{
                      width: `${(count / metrics.totalTasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Milestone Progress</h3>
          <div className="space-y-4">
            {getMilestoneProgress().map((milestone, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{milestone.title}</span>
                  <span className="font-medium">{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 ${
                      milestone.status === 'completed'
                        ? 'bg-green-600'
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-600'
                        : 'bg-gray-400'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Member Workload */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Team Member Workload</h3>
          <div className="space-y-4">
            {Object.entries(getTasksByAssignee()).map(([name, count]) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{name}</span>
                  <span className="font-medium">{count} tasks</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 rounded-full h-2"
                    style={{
                      width: `${(count / metrics.totalTasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Project Timeline</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Time Progress</span>
            <span>{calculateTimeProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2"
              style={{ width: `${calculateTimeProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{new Date(startDate).toLocaleDateString()}</span>
            <span>{new Date(endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Burndown Rate: {calculateBurndown().toFixed(2)} tasks/day
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalytics; 