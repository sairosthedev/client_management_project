import React, { useState } from 'react';
import { FiUsers, FiMail, FiBarChart2, FiClock, FiCheckCircle, FiSearch } from 'react-icons/fi';
import { mockUsers } from '../../mocks/users';
import { mockTasks } from '../../mocks/tasks';
import { TeamMemberType, Task } from '../../types';

const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(null);

  const filteredMembers = mockUsers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMemberStats = (memberId: string) => {
    const memberTasks = mockTasks.filter(task => task.assignee?.id === memberId);
    return {
      totalTasks: memberTasks.length,
      completedTasks: memberTasks.filter(task => task.status === 'done').length,
      inProgressTasks: memberTasks.filter(task => task.status === 'in_progress').length,
      totalTimeSpent: memberTasks.reduce((acc, task) => acc + task.timeSpent, 0),
    };
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => {
          const stats = getMemberStats(member.id);
          return (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <FiMail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Tasks</span>
                  </div>
                  <p className="text-lg font-medium">
                    {stats.completedTasks}/{stats.totalTasks}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <FiClock className="w-4 h-4" />
                    <span>Time</span>
                  </div>
                  <p className="text-lg font-medium">
                    {formatTime(stats.totalTimeSpent)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Projects</h4>
                <div className="flex flex-wrap gap-2">
                  {member.projects.map(project => (
                    <span
                      key={project}
                      className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-sm"
                    >
                      {project}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-medium">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                    <p className="text-gray-600">{selectedMember.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Member's Tasks */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Tasks</h3>
                  <div className="space-y-3">
                    {mockTasks
                      .filter(task => task.assignee?.id === selectedMember.id)
                      .map(task => (
                        <div
                          key={task.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                task.status === 'done'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.status}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                            <span>{task.project}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span>Time: {formatTime(task.timeSpent)}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage; 