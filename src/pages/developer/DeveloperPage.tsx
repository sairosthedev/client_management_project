import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
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
  id: string;
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
    { id: 'priority', title: '🎯 Priority Tasks', tasks: [], isExpanded: true },
    { id: 'in_progress', title: '🚀 In Progress', tasks: [], isExpanded: true },
    { id: 'review', title: '📝 To Review', tasks: [], isExpanded: true },
    { id: 'completed', title: '✅ Completed', tasks: [], isExpanded: false },
  ]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await Promise.resolve(mockTasks);
      const userTasks = response.filter(task => task.assignee?.id === currentDeveloper.id);
      setTasks(userTasks);
      
      // Organize tasks into groups based on status and priority
      const groupedTasks = {
        priority: userTasks.filter(task => task.priority === 'high' && task.status === 'todo'),
        in_progress: userTasks.filter(task => task.status === 'in_progress'),
        review: userTasks.filter(task => task.status === 'review'),
        completed: userTasks.filter(task => task.status === 'done'),
      };

      setTaskGroups(prev => prev.map(group => ({
        ...group,
        tasks: groupedTasks[group.id as keyof typeof groupedTasks] || []
      })));
    };

    fetchTasks();
  }, [currentDeveloper.id]);

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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Drop outside the list or no change
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Find source and destination groups
    const sourceGroup = taskGroups.find(g => g.id === source.droppableId);
    const destGroup = taskGroups.find(g => g.id === destination.droppableId);
    
    if (!sourceGroup || !destGroup) return;

    // Find the task being dragged
    const taskToMove = sourceGroup.tasks.find(t => t.id === draggableId);
    if (!taskToMove) return;

    // Create new arrays
    const newSourceTasks = Array.from(sourceGroup.tasks);
    const newDestTasks = source.droppableId === destination.droppableId 
      ? newSourceTasks 
      : Array.from(destGroup.tasks);

    // Remove from source
    newSourceTasks.splice(source.index, 1);

    // Add to destination
    if (source.droppableId === destination.droppableId) {
      newSourceTasks.splice(destination.index, 0, taskToMove);
    } else {
      newDestTasks.splice(destination.index, 0, taskToMove);

      // Update task status based on destination
      const newStatus = (() => {
        switch (destination.droppableId) {
          case 'priority': return 'todo';
          case 'in_progress': return 'in_progress';
          case 'review': return 'review';
          case 'completed': return 'done';
          default: return taskToMove.status;
        }
      })();

      // Only create activity if status changed
      if (newStatus !== taskToMove.status) {
        const newActivity: ActivityItem = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'status_change',
          content: `Status changed from ${taskToMove.status} to ${newStatus}`,
          user: {
            id: currentDeveloper.id,
            name: currentDeveloper.name,
            email: '',
          },
          timestamp: new Date(),
        };

        taskToMove.activities = [...taskToMove.activities, newActivity];
        taskToMove.status = newStatus;

        // Update main tasks array
        setTasks(prev => prev.map(task => 
          task.id === taskToMove.id ? taskToMove : task
        ));
      }
    }

    // Update taskGroups state
    setTaskGroups(prev => prev.map(group => {
      if (group.id === source.droppableId) {
        return { ...group, tasks: newSourceTasks };
      }
      if (group.id === destination.droppableId) {
        return { ...group, tasks: newDestTasks };
      }
      return group;
    }));
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

      {/* Notion-style Board View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">My Tasks</h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
                <FiFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
                <FiBarChart2 className="w-4 h-4" />
                <span>Sort</span>
              </button>
            </div>
          </div>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiPlus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-400px)]">
            {taskGroups.map(group => (
              <div 
                key={group.id} 
                className="flex-none w-80 bg-gray-50 rounded-lg"
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">{group.title}</span>
                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {group.tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickAdd(group.title)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <FiPlus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Droppable Column Content */}
                <Droppable droppableId={group.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-2 space-y-2 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {group.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                bg-white rounded-lg shadow-sm p-3 
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''}
                                hover:shadow-md transition-all cursor-grab active:cursor-grabbing
                                border border-gray-200 hover:border-blue-300
                              `}
                            >
                              {/* Task Priority Indicator */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  task.priority === 'high' ? 'bg-red-500' :
                                  task.priority === 'medium' ? 'bg-yellow-500' :
                                  'bg-gray-500'
                                }`} />
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                              </div>

                              {/* Task Description */}
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {task.description}
                              </p>

                              {/* Task Metadata */}
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  {task.project}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {formatTime(task.timeSpent)}
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div
                                    className="bg-blue-600 rounded-full h-1 transition-all"
                                    style={{
                                      width: `${Math.min((task.timeSpent / task.timeEstimate) * 100, 100)}%`
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Quick Actions */}
                              <div className="mt-3 flex items-center justify-between">
                                {isTracking !== task.id ? (
                                  <button
                                    onClick={() => handleStartTracking(task)}
                                    className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                                    disabled={!!isTracking}
                                  >
                                    Start
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleStopTracking}
                                    className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                  >
                                    Stop
                                  </button>
                                )}
                                <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {group.tasks.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default DeveloperPage; 