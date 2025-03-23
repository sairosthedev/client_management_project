import React, { useState } from 'react';
import { FiPlus, FiSearch, FiCalendar, FiClock, FiLink, FiPaperclip, FiMessageSquare, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import TaskForm from '../../components/forms/TaskForm';
import FileAttachment, { FileAttachmentType } from '../../components/shared/FileAttachment';
import ActivityFeed, { ActivityItem } from '../../components/shared/ActivityFeed';
import { TeamMemberType } from '../../components/shared/TeamMember';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: TeamMemberType;
  dueDate: Date;
  project: string;
  dependencies: string[]; // IDs of tasks that this task depends on
  files: FileAttachmentType[];
  activities: ActivityItem[];
  timeEstimate: number; // in minutes
  timeSpent: number; // in minutes
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Homepage',
    description: 'Create a modern and responsive homepage design',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-04-01'),
    project: 'Website Redesign',
    dependencies: [],
    files: [],
    activities: [],
    timeEstimate: 480, // 8 hours
    timeSpent: 240, // 4 hours
  },
  // Add more mock tasks
];

// Mock data for projects and team members
const mockProjects = [
  { id: '1', name: 'E-commerce Platform' },
  { id: '2', name: 'Mobile App' },
  { id: '3', name: 'Marketing Website' },
];

const mockTeam = [
  { id: '1', name: 'Maria Garcia', avatar: 'MG' },
  { id: '2', name: 'John Smith', avatar: 'JS' },
  { id: '3', name: 'Sarah Wilson', avatar: 'SW' },
];

const TaskCard: React.FC<{
  task: Task;
  isDragging?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onComment?: () => void;
}> = ({ task, isDragging = false, onEdit, onDelete, onComment }) => {
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'No due date';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString();
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 mb-3 group ${
        isDragging ? 'opacity-50' : ''
      } hover:shadow-md transition-all relative`}
    >
      {/* Action Buttons - Visible on hover */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onComment?.();
          }}
          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Quick Comment"
        >
          <FiMessageSquare size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          title="Edit Task"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete Task"
        >
          <FiTrash2 size={16} />
        </button>
      </div>

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium pr-20">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {task.assignee && (
              <div
                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium"
                title={task.assignee.name}
              >
                {task.assignee.avatar}
              </div>
            )}
            <span>{task.project}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            <span>{formatTime(task.timeSpent)} / {formatTime(task.timeEstimate)}</span>
          </div>
          {task.dependencies.length > 0 && (
            <div className="flex items-center gap-1">
              <FiLink className="w-3 h-3" />
              <span>{task.dependencies.length}</span>
            </div>
          )}
          {task.files.length > 0 && (
            <div className="flex items-center gap-1">
              <FiPaperclip className="w-3 h-3" />
              <span>{task.files.length}</span>
            </div>
          )}
          {task.activities.length > 0 && (
            <div className="flex items-center gap-1">
              <FiMessageSquare className="w-3 h-3" />
              <span>{task.activities.filter(a => a.type === 'comment').length}</span>
            </div>
          )}
        </div>

        {task.timeEstimate > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 rounded-full h-1"
              style={{ width: `${Math.min((task.timeSpent / task.timeEstimate) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const TaskColumn: React.FC<{
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskClick: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onCommentTask: (task: Task) => void;
}> = ({ title, tasks, status, onTaskClick, onEditTask, onDeleteTask, onCommentTask }) => {
  return (
    <div
      className="bg-gray-100 rounded-lg p-4 min-w-[300px]"
      data-status={status}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">{title}</h2>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} data-task-id={task.id}>
            <TaskCard
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
              onComment={() => onCommentTask(task)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [isTracking, setIsTracking] = useState<string | null>(null); // Task ID being tracked
  
  // Filtering states
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    project: '',
    startDate: '',
    endDate: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAssignee = !filters.assignee || task.assignee?.id === filters.assignee;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesProject = !filters.project || task.project === filters.project;
    
    const taskDate = new Date(task.dueDate);
    const matchesStartDate = !filters.startDate || taskDate >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || taskDate <= new Date(filters.endDate);

    return (
      matchesSearch &&
      matchesAssignee &&
      matchesPriority &&
      matchesProject &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const columns = [
    { title: 'To Do', status: 'todo' as const },
    { title: 'In Progress', status: 'in_progress' as const },
    { title: 'Review', status: 'review' as const },
    { title: 'Done', status: 'done' as const },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = (event.active.data.current as any)?.taskId;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeTaskId = (active.data.current as any)?.taskId;
    const targetStatus = (over.data.current as any)?.status;

    if (activeTaskId && targetStatus) {
      setTasks(prev =>
        prev.map(task =>
          task.id === activeTaskId
            ? { ...task, status: targetStatus }
            : task
        )
      );
    }

    setActiveTask(null);
  };

  const handleAddTask = async (formData: Omit<Task, 'id'>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTask: Task = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      setTasks(prev => [...prev, newTask]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = async (formData: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id
            ? { ...task, ...formData }
            : task
        )
      );
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentUser = {
    id: 'current-user',
    name: 'Admin User',
    email: 'admin@example.com',
  };

  const handleFileUpload = async (taskId: string, files: File[]) => {
    const newFiles: FileAttachmentType[] = await Promise.all(
      files.map(async (file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: currentUser.name,
        uploadedAt: new Date(),
        url: URL.createObjectURL(file),
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }))
    );

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, files: [...task.files, ...newFiles] }
          : task
      )
    );

    const activities: ActivityItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'attachment',
      content: file.name,
      user: currentUser,
      timestamp: new Date(),
      metadata: {
        attachments: [newFiles.find(f => f.name === file.name)!],
      },
    }));

    handleAddActivities(taskId, activities);
  };

  const handleDeleteFile = async (taskId: string, fileId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, files: task.files.filter(f => f.id !== fileId) }
          : task
      )
    );
  };

  const handleAddComment = async (taskId: string, content: string, files?: File[]) => {
    const newActivity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'comment',
      content,
      user: currentUser,
      timestamp: new Date(),
      metadata: {},
    };

    if (files && files.length > 0) {
      try {
        const newFiles: FileAttachmentType[] = await Promise.all(
          files.map(async (file) => {
            const isImage = file.type.startsWith('image/');
            const objectUrl = URL.createObjectURL(file);
            
            return {
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedBy: currentUser.name,
              uploadedAt: new Date(),
              url: objectUrl,
              previewUrl: isImage ? objectUrl : undefined,
            };
          })
        );

        // Add files to both the comment metadata and the task's files array
        newActivity.metadata = {
          ...newActivity.metadata,
          attachments: newFiles,
        };

        // Update task's files
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId
              ? { ...task, files: [...task.files, ...newFiles] }
              : task
          )
        );
      } catch (error) {
        console.error('Error processing files:', error);
      }
    }

    // Add the activity
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, activities: [newActivity, ...task.activities] }
          : task
      )
    );

    return newActivity;
  };

  const handleEditComment = async (taskId: string, commentId: string, content: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              activities: task.activities.map(activity =>
                activity.id === commentId
                  ? {
                      ...activity,
                      content,
                      metadata: {
                        ...activity.metadata,
                        originalContent: activity.content,
                      },
                    }
                  : activity
              ),
            }
          : task
      )
    );
  };

  const handleDeleteComment = async (taskId: string, commentId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              activities: task.activities.filter(activity => activity.id !== commentId),
            }
          : task
      )
    );
  };

  const handleAddActivities = (taskId: string, newActivities: ActivityItem[]) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, activities: [...newActivities, ...task.activities] }
          : task
      )
    );
  };

  const handleAddDependency = (taskId: string, dependencyId: string) => {
    if (taskId === dependencyId) return; // Prevent self-dependency

    // Check for circular dependencies
    const hasCircularDependency = (currentId: string, targetId: string, visited = new Set<string>()): boolean => {
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const task = tasks.find(t => t.id === currentId);
      if (!task) return false;

      if (task.dependencies.includes(targetId)) return true;

      return task.dependencies.some(depId => hasCircularDependency(depId, targetId, visited));
    };

    if (hasCircularDependency(dependencyId, taskId)) {
      alert('Cannot add dependency: This would create a circular dependency');
      return;
    }

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, dependencies: [...task.dependencies, dependencyId] }
          : task
      )
    );

    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'other',
      content: `Added dependency: ${tasks.find(t => t.id === dependencyId)?.title}`,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(taskId, [activity]);
  };

  const handleRemoveDependency = (taskId: string, dependencyId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, dependencies: task.dependencies.filter(id => id !== dependencyId) }
          : task
      )
    );

    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'other',
      content: `Removed dependency: ${tasks.find(t => t.id === dependencyId)?.title}`,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(taskId, [activity]);
  };

  const handleStartTimeTracking = (taskId: string) => {
    setIsTracking(taskId);
    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'other',
      content: 'Started time tracking',
      user: currentUser,
      timestamp: new Date(),
    };
    handleAddActivities(taskId, [activity]);
  };

  const handleStopTimeTracking = (taskId: string, duration: number) => {
    setIsTracking(null);
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, timeSpent: task.timeSpent + duration }
          : task
      )
    );

    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'other',
      content: `Tracked ${Math.round(duration / 60)} hours ${duration % 60} minutes`,
      user: currentUser,
      timestamp: new Date(),
    };
    handleAddActivities(taskId, [activity]);
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    in_progress: filteredTasks.filter(task => task.status === 'in_progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    done: filteredTasks.filter(task => task.status === 'done'),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiPlus /> Add Task
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            <select
              value={filters.assignee}
              onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Assignees</option>
              {mockTeam.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filters.project}
              onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Projects</option>
              {mockProjects.map(project => (
                <option key={project.id} value={project.name}>{project.name}</option>
              ))}
            </select>

            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End Date"
            />
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <TaskColumn
              key={column.status}
              title={column.title}
              tasks={filteredTasks.filter((task) => task.status === column.status)}
              status={column.status}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setShowTaskDetails(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowAddModal(true);
              }}
              onDeleteTask={(taskId) => {
                if (window.confirm('Are you sure you want to delete this task?')) {
                  setTasks(prev => prev.filter(t => t.id !== taskId));
                }
              }}
              onCommentTask={(task) => {
                setSelectedTask(task);
                setShowTaskDetails(true);
                // Focus the comment textarea after a short delay to allow the modal to open
                setTimeout(() => {
                  const textarea = document.querySelector('textarea[placeholder*="Add a comment"]');
                  if (textarea) {
                    textarea.focus();
                  }
                }, 100);
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>

        {/* Add/Edit Task Modal */}
        {(showAddModal || editingTask) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <TaskForm
                initialData={editingTask || {}}
                onSubmit={editingTask ? handleEditTask : handleAddTask}
                onCancel={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                }}
                isSubmitting={isSubmitting}
                projects={mockProjects}
                team={mockTeam}
              />
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {showTaskDetails && selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setEditingTask(selectedTask);
                        setShowTaskDetails(false);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
                          setShowTaskDetails(false);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 size={20} />
                    </button>
                    <button
                      onClick={() => setShowTaskDetails(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Quick Comment Input */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <textarea
                          placeholder="Add a comment... (Tip: You can paste screenshots directly)"
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                          onPaste={(e) => {
                            const items = Array.from(e.clipboardData.items);
                            const imageItems = items.filter(item => item.type.startsWith('image'));
                            if (imageItems.length > 0) {
                              e.preventDefault();
                              const files = imageItems.map(item => item.getAsFile()).filter(Boolean) as File[];
                              handleAddComment(selectedTask.id, '', files);
                            }
                          }}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => document.getElementById('comment-file-input')?.click()}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <FiPaperclip size={16} />
                            </button>
                            <input
                              id="comment-file-input"
                              type="file"
                              multiple
                              accept="image/*,.pdf,.doc,.docx"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.length) {
                                  handleAddComment(selectedTask.id, '', Array.from(e.target.files));
                                }
                              }}
                            />
                          </div>
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={(e) => {
                              const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea');
                              if (textarea && textarea.value.trim()) {
                                handleAddComment(selectedTask.id, textarea.value.trim());
                                textarea.value = '';
                              }
                            }}
                          >
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Files & Activity Feed */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Files & Attachments</h3>
                        <FileAttachment
                          attachments={selectedTask.files}
                          onUpload={(files) => handleFileUpload(selectedTask.id, files)}
                          onDelete={(fileId) => handleDeleteFile(selectedTask.id, fileId)}
                          maxFileSize={10 * 1024 * 1024} // 10MB
                          allowedFileTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Comments & Activity</h3>
                        <ActivityFeed
                          activities={selectedTask.activities}
                          onAddComment={(content, files) => handleAddComment(selectedTask.id, content, files)}
                          onEditComment={(id, content) => handleEditComment(selectedTask.id, id, content)}
                          onDeleteComment={(id) => handleDeleteComment(selectedTask.id, id)}
                          currentUser={currentUser}
                          teamMembers={mockTeam}
                        />
                      </div>
                    </div>

                    {/* Dependencies Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Dependencies</h3>
                      <div className="space-y-2">
                        {selectedTask.dependencies.map(depId => {
                          const depTask = tasks.find(t => t.id === depId);
                          return (
                            <div
                              key={depId}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <span>{depTask?.title}</span>
                              <button
                                onClick={() => handleRemoveDependency(selectedTask.id, depId)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                        <select
                          className="w-full mt-2 p-2 border rounded-lg"
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddDependency(selectedTask.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="">Add dependency...</option>
                          {tasks
                            .filter(t => t.id !== selectedTask.id && !selectedTask.dependencies.includes(t.id))
                            .map(task => (
                              <option key={task.id} value={task.id}>
                                {task.title}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Task Details */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium mb-4">Details</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600">Assignee</p>
                          <div className="flex items-center gap-2 mt-1">
                            {selectedTask.assignee ? (
                              <>
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {selectedTask.assignee.avatar}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {selectedTask.assignee.name}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500">Unassigned</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Due Date</p>
                          <p className="font-medium mt-1">
                            {selectedTask.dueDate.toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Priority</p>
                          <span
                            className={`inline-block mt-1 px-2 py-1 text-sm rounded-full ${
                              selectedTask.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : selectedTask.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Time Tracking */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-medium mb-4">Time Tracking</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Estimated</p>
                          <p className="font-medium">{formatTime(selectedTask.timeEstimate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Spent</p>
                          <p className="font-medium">{formatTime(selectedTask.timeSpent)}</p>
                        </div>
                        <div className="mt-4">
                          {isTracking === selectedTask.id ? (
                            <button
                              onClick={() => handleStopTimeTracking(selectedTask.id, 30)}
                              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                              Stop Tracking
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartTimeTracking(selectedTask.id)}
                              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                              Start Tracking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default TasksPage; 