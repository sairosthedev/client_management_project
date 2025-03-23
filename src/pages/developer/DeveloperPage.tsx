import React, { useState, useEffect, useCallback } from 'react';
import { FiClock, FiCalendar, FiBarChart2, FiCheckCircle, FiAlertCircle, FiFilter, FiSearch, FiArrowUp, FiArrowDown, FiActivity, FiPlus, FiMoreHorizontal, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Task, TeamMemberType, ActivityItem } from '../../types';
import { mockTasks } from '../../mocks/tasks';

// Mock current developer data
const currentDeveloper: TeamMemberType = {
  id: '1',
  name: 'Maria Garcia',
  avatar: 'MG',
  role: 'Frontend Developer',
};

type SortField = 'dueDate' | 'priority' | 'timeSpent' | 'project';
type SortDirection = 'asc' | 'desc';

interface TaskGroup {
  title: string;
  tasks: Task[];
  isExpanded: boolean;
}

const DeveloperPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTracking, setIsTracking] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  
  // Filtering and Sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Stats
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    tasksInProgress: 0,
    totalTimeSpent: 0,
    upcomingDeadlines: 0,
  });

  // New states for time tracking
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showActivityHistory, setShowActivityHistory] = useState<boolean>(false);
  const [selectedTaskForHistory, setSelectedTaskForHistory] = useState<string | null>(null);

  // New states for Notion-like features
  const [taskGroups, setTaskGroups] = useState<TaskGroup[]>([
    { title: '🎯 Priority Tasks', tasks: [], isExpanded: true },
    { title: '🚀 In Progress', tasks: [], isExpanded: true },
    { title: '📝 To Review', tasks: [], isExpanded: true },
    { title: '✅ Completed', tasks: [], isExpanded: false },
  ]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await Promise.resolve(mockTasks);
      const userTasks = response.filter(task => task.assignee?.id === currentDeveloper.id);
      
      // Organize tasks into groups
      setTaskGroups(prev => prev.map(group => ({
        ...group,
        tasks: userTasks.filter(task => {
          switch (group.title) {
            case '🎯 Priority Tasks':
              return task.priority === 'high' && task.status !== 'done';
            case '🚀 In Progress':
              return task.status === 'in_progress';
            case '📝 To Review':
              return task.status === 'review';
            case '✅ Completed':
              return task.status === 'done';
            default:
              return false;
          }
        })
      })));

      setTasks(userTasks);
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Update stats
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in_progress').length;
    const totalTime = tasks.reduce((acc, task) => acc + task.timeSpent, 0);
    const upcoming = tasks.filter(task => {
      const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysUntilDue <= 7 && task.status !== 'done';
    }).length;

    setStats({
      tasksCompleted: completed,
      tasksInProgress: inProgress,
      totalTimeSpent: totalTime,
      upcomingDeadlines: upcoming,
    });
  }, [tasks]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && trackingStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - trackingStartTime.getTime()) / (1000 * 60));
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTracking, trackingStartTime]);

  const projects = Array.from(new Set(tasks.map(task => task.project)));

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesProject = projectFilter === 'all' || task.project === projectFilter;

      return matchesSearch && matchesStatus && matchesProject;
    })
    .sort((a, b) => {
      if (sortField === 'dueDate') {
        return sortDirection === 'asc' 
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortField === 'priority') {
        const priorityWeight = { low: 0, medium: 1, high: 2 };
        return sortDirection === 'asc'
          ? priorityWeight[a.priority] - priorityWeight[b.priority]
          : priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortField === 'timeSpent') {
        return sortDirection === 'asc'
          ? a.timeSpent - b.timeSpent
          : b.timeSpent - a.timeSpent;
      }
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleQuickStatusUpdate = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const handleStartTracking = (task: Task) => {
    setIsTracking(task.id);
    setActiveTask(task);
    setTrackingStartTime(new Date());
  };

  const handleStopTracking = useCallback(() => {
    if (!activeTask || !trackingStartTime) return;

    const endTime = new Date();
    const minutesSpent = Math.floor((endTime.getTime() - trackingStartTime.getTime()) / (1000 * 60));

    // Create a new activity for the time tracking session
    const newActivity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'other',
      content: `Worked on task for ${formatTime(minutesSpent)}`,
      user: {
        id: currentDeveloper.id,
        name: currentDeveloper.name,
        email: '',
      },
      timestamp: new Date(),
    };

    setTasks(prev =>
      prev.map(task =>
        task.id === activeTask.id
          ? {
              ...task,
              timeSpent: task.timeSpent + minutesSpent,
              activities: [...task.activities, newActivity],
            }
          : task
      )
    );

    setIsTracking(null);
    setActiveTask(null);
    setTrackingStartTime(null);
    setElapsedTime(0);
  }, [activeTask, trackingStartTime, currentDeveloper.id, currentDeveloper.name]);

  const toggleActivityHistory = (taskId: string) => {
    if (selectedTaskForHistory === taskId) {
      setSelectedTaskForHistory(null);
      setShowActivityHistory(false);
    } else {
      setSelectedTaskForHistory(taskId);
      setShowActivityHistory(true);
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const toggleGroupExpansion = (groupTitle: string) => {
    setTaskGroups(prev => prev.map(group => 
      group.title === groupTitle ? { ...group, isExpanded: !group.isExpanded } : group
    ));
  };

  const handleQuickAdd = (groupTitle: string) => {
    // Implementation for quick task addition
    console.log('Quick add to:', groupTitle);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium">
            {currentDeveloper.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentDeveloper.name}</h1>
            <p className="text-gray-600">{currentDeveloper.role}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Tasks Completed</p>
                <h3 className="text-2xl font-bold">{stats.tasksCompleted}</h3>
              </div>
              <FiCheckCircle className="text-green-500 w-8 h-8" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">In Progress</p>
                <h3 className="text-2xl font-bold">{stats.tasksInProgress}</h3>
              </div>
              <FiBarChart2 className="text-blue-500 w-8 h-8" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Time</p>
                <h3 className="text-2xl font-bold">{formatTime(stats.totalTimeSpent)}</h3>
              </div>
              <FiClock className="text-purple-500 w-8 h-8" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Due This Week</p>
                <h3 className="text-2xl font-bold">{stats.upcomingDeadlines}</h3>
              </div>
              <FiAlertCircle className="text-orange-500 w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Task with Real-time Counter */}
      {activeTask && (
        <div className="mb-8 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Currently Working On</h3>
              <p className="text-lg font-bold">{activeTask.title}</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-blue-600">
                  <FiClock className="w-4 h-4" />
                  <span>Current Session: {formatTime(elapsedTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>Total Time: {formatTime(activeTask.timeSpent + elapsedTime)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleStopTracking}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Stop Tracking
            </button>
          </div>
          {trackingStartTime && (
            <p className="text-sm text-gray-600 mt-2">
              Started {trackingStartTime.toLocaleTimeString()}
            </p>
          )}
        </div>
      )}

      {/* Notion-like Task View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Task Groups */}
        <div className="space-y-4">
          {taskGroups.map(group => (
            <div key={group.title} className="bg-white rounded-lg shadow-sm">
              {/* Group Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleGroupExpansion(group.title)}
              >
                <div className="flex items-center gap-2">
                  {group.isExpanded ? <FiChevronDown className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
                  <h3 className="text-lg font-medium">{group.title}</h3>
                  <span className="text-sm text-gray-500">({group.tasks.length})</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd(group.title);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiPlus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Task List */}
              {group.isExpanded && (
                <div className="divide-y divide-gray-100">
                  {group.tasks.map(task => (
                    <div 
                      key={task.id}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FiClock className="w-4 h-4" />
                              <span>{formatTime(task.timeSpent)} / {formatTime(task.timeEstimate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Project:</span>
                              <span className="font-medium">{task.project}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isTracking !== task.id ? (
                            <button
                              onClick={() => handleStartTracking(task)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              disabled={!!isTracking}
                            >
                              Start
                            </button>
                          ) : (
                            <button
                              onClick={handleStopTracking}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Stop
                            </button>
                          )}
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 rounded-full h-1"
                            style={{
                              width: `${Math.min((task.timeSpent / task.timeEstimate) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {group.tasks.length === 0 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No tasks in this group. Click + to add one.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage; 