import React, { useState, useMemo } from 'react';
import { FiFolder, FiClock, FiUsers, FiBarChart2, FiCalendar, FiSearch } from 'react-icons/fi';
import { mockTasks } from '../../mocks/tasks';
import { mockUsers } from '../../mocks/users';
import { Task } from '../../types';

interface Project {
  name: string;
  tasks: Task[];
  team: typeof mockUsers;
  totalTime: number;
  progress: number;
}

const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Group tasks by project
  const projects = useMemo(() => {
    const projectMap = new Map<string, Project>();

    mockTasks.forEach(task => {
      if (!projectMap.has(task.project)) {
        projectMap.set(task.project, {
          name: task.project,
          tasks: [],
          team: [],
          totalTime: 0,
          progress: 0,
        });
      }

      const project = projectMap.get(task.project)!;
      project.tasks.push(task);
      project.totalTime += task.timeSpent;

      // Add team member if not already added
      if (task.assignee && !project.team.find(member => member.id === task.assignee?.id)) {
        const teamMember = mockUsers.find(user => user.id === task.assignee?.id);
        if (teamMember) {
          project.team.push(teamMember);
        }
      }
    });

    // Calculate progress for each project
    projectMap.forEach(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(task => task.status === 'done').length;
      project.progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    });

    return Array.from(projectMap.values());
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div
            key={project.name}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedProject(project.name)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiFolder className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{project.name}</h3>
                <p className="text-gray-600 text-sm">
                  {project.tasks.length} tasks · {project.team.length} members
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{Math.round(project.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FiClock className="w-4 h-4" />
                  <span>Total Time</span>
                </div>
                <p className="text-lg font-medium">{formatTime(project.totalTime)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <FiBarChart2 className="w-4 h-4" />
                  <span>Tasks</span>
                </div>
                <p className="text-lg font-medium">
                  {project.tasks.filter(t => t.status === 'done').length}/{project.tasks.length}
                </p>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Team</h4>
              <div className="flex -space-x-2">
                {project.team.map(member => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium ring-2 ring-white"
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiFolder className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProject}</h2>
                    <p className="text-gray-600">
                      {projects.find(p => p.name === selectedProject)?.tasks.length} tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Project Tasks */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Tasks</h3>
                  <div className="space-y-3">
                    {projects
                      .find(p => p.name === selectedProject)
                      ?.tasks.map(task => (
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
                              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <FiCalendar className="w-4 h-4" />
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiClock className="w-4 h-4" />
                                  {formatTime(task.timeSpent)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiUsers className="w-4 h-4" />
                                  {task.assignee?.name}
                                </span>
                              </div>
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

export default ProjectsPage; 