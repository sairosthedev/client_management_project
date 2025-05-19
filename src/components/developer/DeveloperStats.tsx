import React from 'react';
import { FiClock, FiCalendar, FiBarChart2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { StatsCard } from './StatsCard';
import { formatTime } from '../../utils/time';
import type { TeamMemberType } from '../../types/index';

interface DeveloperStatsProps {
  developer: TeamMemberType;
  stats: {
    tasksCompleted: number;
    tasksInProgress: number;
    totalTimeSpent: number;
    upcomingDeadlines: number;
  };
}

export const DeveloperStats: React.FC<DeveloperStatsProps> = ({ developer, stats }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium">
          {developer.avatar}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{developer.name}</h1>
          <p className="text-gray-600">{developer.role}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Tasks Completed"
          value={stats.tasksCompleted}
          icon={FiCheckCircle}
          iconColor="text-green-500"
        />
        <StatsCard
          title="In Progress"
          value={stats.tasksInProgress}
          icon={FiBarChart2}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Time"
          value={formatTime(stats.totalTimeSpent)}
          icon={FiClock}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Due This Week"
          value={stats.upcomingDeadlines}
          icon={FiAlertCircle}
          iconColor="text-orange-500"
        />
      </div>
    </div>
  );
}; 