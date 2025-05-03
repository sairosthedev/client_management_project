import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContextProvider';
import { FiMail, FiUser, FiBriefcase, FiClock } from 'react-icons/fi';

const ProfilePage: React.FC = () => {
  const currentUser = useContext(UserContext);

  const stats = {
    tasksCompleted: 24,
    totalHoursWorked: 156,
    projectsContributed: 5,
    averageTaskCompletion: '2.3 days'
  };

  return (
    <div className="p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-medium">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{currentUser.name}</h1>
            <p className="text-gray-600">{currentUser.role}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FiMail className="w-4 h-4" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiBriefcase className="w-4 h-4" />
                <span>Frontend Developer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Tasks Completed</p>
              <h3 className="text-2xl font-bold">{stats.tasksCompleted}</h3>
            </div>
            <FiUser className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Hours Worked</p>
              <h3 className="text-2xl font-bold">{stats.totalHoursWorked}h</h3>
            </div>
            <FiClock className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Projects</p>
              <h3 className="text-2xl font-bold">{stats.projectsContributed}</h3>
            </div>
            <FiBriefcase className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Avg. Completion</p>
              <h3 className="text-2xl font-bold">{stats.averageTaskCompletion}</h3>
            </div>
            <FiClock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Skills and Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'TailwindCSS', 'Git', 'REST APIs', 'GraphQL', 'Jest'].map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Current Projects</h2>
          <div className="space-y-4">
            {['E-commerce Platform', 'Design System', 'Website Redesign'].map(project => (
              <div key={project} className="flex items-center justify-between">
                <span className="text-gray-700">{project}</span>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-sm">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 