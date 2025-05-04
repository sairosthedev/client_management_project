import React, { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isToday,
  isSameDay
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUsers, FiFlag, FiPlus, FiFilter } from 'react-icons/fi';
import { Project } from '../../mocks/projects';
import { mockProjects } from '../../mocks/projects';
import { Task } from '../../types/task';
import { mockTasks } from '../../mocks/tasks';
import { Modal } from '../../components/common/Modal';
import { TeamMemberType } from '../../types';
import { mockTeam } from '../../mocks/team';
import { TaskModal } from '../../components/modals/TaskModal';
import { ProjectCreationModal } from '../../components/modals/ProjectCreationModal';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'project_deadline' | 'task_deadline';
  status: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface CalendarTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate: Date;
  timeEstimate: number;
  timeSpent: number;
  project: string;
  dependencies: string[];
  files: any[];
  activities: any[];
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    assignee: '',
    priority: '',
    project: '',
    type: '',
  });

  useEffect(() => {
    // In a real app, fetch this data from your API
    const projectList = Object.values(mockProjects);
    setProjects(projectList);
    
    // Combine project deadlines and task deadlines into events
    const projectEvents: CalendarEvent[] = projectList.map(project => ({
      id: project.id,
      title: `${project.name} Due`,
      date: new Date(project.endDate),
      type: 'project_deadline',
      status: project.status
    }));

    // Convert mock tasks to CalendarTask type
    const calendarTasks: CalendarTask[] = mockTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
      timeEstimate: task.timeEstimate,
      timeSpent: task.timeSpent,
      project: '',
      dependencies: [],
      files: [],
      activities: []
    }));

    const taskEvents: CalendarEvent[] = calendarTasks.map(task => ({
      id: task.id,
      title: task.title,
      date: new Date(task.dueDate),
      type: 'task_deadline',
      status: task.status,
      priority: task.priority,
      assignee: task.assignee
    }));

    setTasks(calendarTasks);
    setEvents([...projectEvents, ...taskEvents]);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  
  // Generate calendar days manually instead of using eachDayOfInterval
  const calendarDays: Date[] = [];
  let day = calendarStart;
  while (day <= endOfWeek(monthEnd)) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getDayEvents = (day: Date) => {
    return events.filter(event => {
      const matchesDay = isSameDay(event.date, day);
      const matchesAssignee = !filters.assignee || event.assignee?.id === filters.assignee;
      const matchesPriority = !filters.priority || event.priority === filters.priority;
      const matchesProject = !filters.project || (event.type === 'project_deadline' ? event.id === filters.project : tasks.find(t => t.id === event.id)?.project === filters.project);
      const matchesType = !filters.type || event.type === filters.type;

      return matchesDay && matchesAssignee && matchesPriority && matchesProject && matchesType;
    });
  };

  const handleDayClick = (day: Date) => {
    const dayEvents = getDayEvents(day);
    if (dayEvents.length > 0) {
      setSelectedDay(day);
      setSelectedEvents(dayEvents);
    }
  };

  const getProjectDetails = (eventId: string) => {
    return projects.find(p => p.id === eventId);
  };

  const getTaskDetails = (eventId: string) => {
    return tasks.find(t => t.id === eventId);
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateTask = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        dependencies: [],
        files: [],
        activities: [],
        timeSpent: 0,
      };

      // In a real app, make an API call here
      console.log('Creating task:', newTask);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      const newCalendarTask: CalendarTask = {
        ...newTask,
        project: '',
        dependencies: [],
        files: [],
        activities: []
      };

      const newEvent: CalendarEvent = {
        id: newTask.id,
        title: newTask.title,
        date: new Date(newTask.dueDate),
        type: 'task_deadline',
        status: newTask.status,
        priority: newTask.priority,
        assignee: newTask.assignee
      };

      setTasks(prev => [...prev, newCalendarTask]);
      setEvents(prev => [...prev, newEvent]);
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        client: formData.client,
        status: formData.status,
        team: [],
        progress: 0,
      };

      // In a real app, make an API call here
      console.log('Creating project:', newProject);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      const newEvent: CalendarEvent = {
        id: newProject.id,
        title: `${newProject.name} Due`,
        date: new Date(newProject.endDate),
        type: 'project_deadline',
        status: newProject.status
      };

      setProjects(prev => [...prev, newProject]);
      setEvents(prev => [...prev, newEvent]);
      setShowAddProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Project Calendar</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="w-4 h-4" />
            Add Task
          </button>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FiPlus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={filters.assignee}
          onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Assignees</option>
          {mockTeam.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.project}
          onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="project_deadline">Project Deadlines</option>
          <option value="task_deadline">Task Deadlines</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-white p-4 text-center font-medium">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day: Date, i: number) => {
            const dayEvents = getDayEvents(day);
            return (
              <div
                key={i}
                onClick={() => handleDayClick(day)}
                className={`bg-white p-4 min-h-[120px] border-t border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  !isSameMonth(day, monthStart) ? 'text-gray-400' : ''
                } ${isToday(day) ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
              >
                <span className={`text-sm ${isToday(day) ? 'font-bold text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </span>
                
                <div className="mt-2 space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.type === 'project_deadline'
                          ? 'bg-purple-100 text-purple-700'
                          : event.priority
                          ? getPriorityColor(event.priority)
                          : 'bg-blue-100 text-blue-700'
                      }`}
                      title={`${event.title}${event.assignee ? ` (${event.assignee.name})` : ''}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={selectedDay !== null}
        onClose={() => {
          setSelectedDay(null);
          setSelectedEvents([]);
        }}
        title={selectedDay ? format(selectedDay, 'MMMM d, yyyy') : ''}
      >
        <div className="space-y-4">
          {selectedEvents.map(event => {
            if (event.type === 'project_deadline') {
              const project = getProjectDetails(event.id);
              if (!project) return null;

              return (
                <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>Start: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>End: {format(new Date(project.endDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiUsers className="w-4 h-4" />
                      <span>Team: {project.team.length} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" />
                      <span>Progress: {project.progress}%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            } else {
              const task = getTaskDetails(event.id);
              if (!task) return null;

              return (
                <div key={event.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-lg">{task.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiCalendar className="w-4 h-4" />
                      <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-4 h-4" />
                      <span>Time: {task.timeSpent}/{task.timeEstimate} mins</span>
                    </div>
                    {task.assignee && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiUsers className="w-4 h-4" />
                        <span>Assignee: {task.assignee.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiFlag className="w-4 h-4" />
                      <span>Status: {task.status.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </Modal>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSubmit={handleCreateTask}
        isSubmitting={isSubmitting}
        editingTask={null}
        team={mockTeam}
      />

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSubmit={handleCreateProject}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Calendar; 