import React, { useState } from 'react';
import { FiFolder, FiCalendar, FiClock, FiUsers } from 'react-icons/fi';
import ProjectsGrid from '../../components/shared/ProjectsGrid';
import { mockTasks } from '../../mocks/tasks';

const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>

      <ProjectsGrid
        onProjectClick={setSelectedProject}
        className="mb-8"
      />

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
                      {mockTasks.filter(task => task.project === selectedProject).length} tasks
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
                    {mockTasks
                      .filter(task => task.project === selectedProject)
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