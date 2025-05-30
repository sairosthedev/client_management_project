import React, { useState, useEffect } from 'react';
import { FiUsers, FiMail, FiBarChart2, FiClock, FiCheckCircle, FiSearch, FiEdit2, FiTrash2, FiX, FiUserPlus } from 'react-icons/fi';
import { teamService } from '../services/teamService';
import type { TeamMemberType, UserRole } from '../types';
import type { Task } from '../types/task';
import { useManagerTasks } from '../hooks/useManagerTasks';

interface TeamPageComponentProps {
  role: 'developer' | 'project_manager' | 'admin';
  canEditMembers?: boolean;
  canAssignTasks?: boolean;
  canViewSensitiveInfo?: boolean;
}

const TeamPageComponent: React.FC<TeamPageComponentProps> = ({
  role,
  canEditMembers = false,
  canAssignTasks = false,
  canViewSensitiveInfo = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMemberType | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<TeamMemberType>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isReassigningTask, setIsReassigningTask] = useState(false);
  const [taskToReassign, setTaskToReassign] = useState<Task | null>(null);
  const { tasks, loading: tasksLoading, updateTask, refreshTasks } = useManagerTasks();

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    const members = await teamService.getAllTeamMembers();
    setTeamMembers(members);
  };

  const handleCreateMember = async () => {
    if (!editForm.name || !editForm.email || !editForm.role) return;
    
    try {
      await teamService.createTeamMember({
        name: editForm.name,
        email: editForm.email,
        role: editForm.role as UserRole,
        avatar: editForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        skills: editForm.skills || [],
        projects: editForm.projects || [],
      });
      await loadTeamMembers();
      setIsCreating(false);
      setEditForm({});
    } catch (error) {
      console.error('Error creating team member:', error);
    }
  };

  const handleUpdateMember = async () => {
    if (!selectedMember || !editForm.name) return;
    
    try {
      await teamService.updateTeamMember(selectedMember.id, editForm);
      await loadTeamMembers();
      setIsEditing(false);
      setEditForm({});
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamService.deleteTeamMember(id);
        await loadTeamMembers();
        setSelectedMember(null);
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const getMemberStats = (memberId: string) => {
    const memberTasks = tasks.filter(task => {
      if (typeof task.assignedTo === 'string') {
        return task.assignedTo === memberId;
      }
      return task.assignedTo?._id === memberId;
    });
    
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const totalTasks = memberTasks.length;
    const totalTimeSpent = memberTasks.reduce((acc, task) => acc + (task.actualHours || 0), 0);
    const totalEstimatedTime = memberTasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0);
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks: memberTasks.filter(task => task.status === 'in-progress').length,
      totalTimeSpent,
      totalEstimatedTime
    };
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={editForm.name || ''}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={editForm.email || ''}
          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={editForm.role || ''}
          onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a role</option>
          <option value="developer">Developer</option>
          <option value="project_manager">Project Manager</option>
          <option value="admin">Admin</option>
          <option value="designer">Designer</option>
          <option value="full_stack_developer">Full Stack Developer</option>
          <option value="ui_ux_designer">UI/UX Designer</option>
          <option value="devops_engineer">DevOps Engineer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
        <input
          type="text"
          value={editForm.skills?.join(', ') || ''}
          onChange={(e) => setEditForm({ ...editForm, skills: e.target.value.split(',').map(s => s.trim()) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Projects (comma-separated)</label>
        <input
          type="text"
          value={editForm.projects?.join(', ') || ''}
          onChange={(e) => setEditForm({ ...editForm, projects: e.target.value.split(',').map(s => s.trim()) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const handleAssignTask = async (taskId: string, newAssigneeId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      const newAssignee = teamMembers.find(m => m._id === newAssigneeId);
      if (newAssignee) {
        try {
          await updateTask(taskId, {
            assignedTo: newAssigneeId,
            status: 'in-progress'
          });
          await refreshTasks();
          setSelectedTask(null);
          setIsAssigningTask(false);
        } catch (error) {
          console.error('Error assigning task:', error);
        }
      }
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMember && contactMessage.trim()) {
      // In a real app, this would send the message to a backend service
      console.log(`Sending message to ${selectedMember.name}: ${contactMessage}`);
      alert('Message sent successfully!');
      setContactMessage('');
      setShowContactForm(false);
    }
  };

  const calculatePerformanceMetrics = (memberId: string) => {
    const memberTasks = tasks.filter(task => task.assignedTo?._id === memberId);
    const totalTasks = memberTasks.length;
    const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    const totalTimeSpent = memberTasks.reduce((acc, task) => acc + (task.actualHours || 0), 0);
    const averageTimePerTask = totalTasks ? totalTimeSpent / totalTasks : 0;

    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalTimeSpent,
      averageTimePerTask,
      onTimeTasks: memberTasks.filter(task => new Date(task.dueDate) >= new Date()).length,
    };
  };

  const handleReassignTask = (task: Task) => {
    setTaskToReassign(task);
    setIsReassigningTask(true);
  };

  const executeTaskReassignment = async (task: Task, newAssigneeId: string) => {
    const taskIndex = tasks.findIndex(t => t._id === task._id);
    const newAssignee = teamMembers.find(m => m._id === newAssigneeId);
    
    if (taskIndex !== -1 && newAssignee) {
      try {
        await updateTask(task._id, {
          assignedTo: newAssigneeId,
          status: 'in-progress'
        });
        await refreshTasks();
        setTaskToReassign(null);
        setIsReassigningTask(false);
      } catch (error) {
        console.error('Error reassigning task:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <div className="flex items-center gap-4">
          {canEditMembers && (
            <button
              onClick={() => {
                setIsCreating(true);
                setEditForm({});
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Add Team Member
            </button>
          )}
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
      </div>

      {/* Create Member Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Team Member</h2>
              <button onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>
            {renderForm()}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMember}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => {
          const stats = getMemberStats(member._id);
          return (
            <div
              key={member._id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{member.avatar || member.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <p className="text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {canEditMembers && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember(member);
                        setEditForm(member);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                  )}
                  {canEditMembers && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(member._id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-500">Tasks</p>
                  <p className="text-lg font-semibold">{stats.completedTasks}/{stats.totalTasks}</p>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-500">Time Spent</p>
                  <p className="text-lg font-semibold">{formatTime(stats.totalTimeSpent)} / {formatTime(stats.totalEstimatedTime)}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {member.skills?.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                    >
                      {skill}
                    </span>
                  )) || <span className="text-gray-500 text-sm">No skills listed</span>}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Projects</h4>
                <div className="flex flex-wrap gap-2">
                  {member.projects?.map(project => (
                    <span
                      key={project}
                      className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-sm"
                    >
                      {project}
                    </span>
                  )) || <span className="text-gray-500 text-sm">No projects listed</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Member Modal */}
      {isEditing && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Team Member</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                <FiX />
              </button>
            </div>
            {renderForm()}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMember}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex items-center gap-3">
                  {canEditMembers && (
                    <>
                      <button
                        onClick={() => {
                          setEditForm(selectedMember);
                          setIsEditing(true);
                          setSelectedMember(null);
                        }}
                        className="px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                      >
                        <FiEdit2 />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteMember(selectedMember._id);
                        }}
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                {canAssignTasks && (
                  <button
                    onClick={() => setIsAssigningTask(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <FiCheckCircle />
                    Assign Task
                  </button>
                )}
                {canViewSensitiveInfo && (
                  <button
                    onClick={() => setShowPerformance(true)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                  >
                    <FiBarChart2 />
                    View Performance
                  </button>
                )}
                <button
                  onClick={() => setShowContactForm(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <FiMail />
                  Contact
                </button>
              </div>

              {/* Performance Metrics Modal */}
              {showPerformance && selectedMember && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Performance Metrics</h3>
                    <button
                      onClick={() => setShowPerformance(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX />
                    </button>
                  </div>
                  {(() => {
                    const metrics = calculatePerformanceMetrics(selectedMember._id);
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Completion Rate</p>
                          <p className="text-xl font-medium">{metrics.completionRate.toFixed(1)}%</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Tasks Completed</p>
                          <p className="text-xl font-medium">{metrics.completedTasks}/{metrics.totalTasks}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Average Time per Task</p>
                          <p className="text-xl font-medium">{formatTime(metrics.averageTimePerTask)}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-sm text-gray-600">On-time Tasks</p>
                          <p className="text-xl font-medium">{metrics.onTimeTasks}/{metrics.totalTasks}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Contact Form */}
              {showContactForm && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Contact {selectedMember.name}</h3>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX />
                    </button>
                  </div>
                  <form onSubmit={handleContactSubmit}>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Task Assignment Modal */}
              {isAssigningTask && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Assign Task</h3>
                    <button
                      onClick={() => setIsAssigningTask(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {tasks
                      .filter(task => !task.assignedTo || task.assignedTo._id !== selectedMember._id)
                      .map(task => (
                        <div
                          key={task._id}
                          className="bg-white p-3 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-gray-600">{task.project}</p>
                          </div>
                          <button
                            onClick={() => handleAssignTask(task._id, selectedMember._id || '')}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Assign
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Member's Tasks */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Tasks</h3>
                  <div className="space-y-3">
                    {tasks
                      .filter(task => task.assignedTo?._id === selectedMember._id)
                      .map(task => (
                        <div
                          key={task._id}
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
                                task.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {task.status === 'in-progress' ? 'In Progress' : 
                               task.status === 'completed' ? 'Completed' : 
                               task.status === 'pending' ? 'Pending' : task.status}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                            <span>{task.project}</span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span>Time: {formatTime(task.actualHours || 0)} / {formatTime(task.estimatedHours || 0)}</span>
                          </div>
                          {canAssignTasks && (
                            <div className="mt-3">
                              <button
                                onClick={() => handleReassignTask(task)}
                                className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1"
                              >
                                <FiUserPlus className="w-4 h-4" />
                                Reassign Task
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Member's Skills */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills?.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    )) || <span className="text-gray-500 text-sm">No skills listed</span>}
                  </div>
                </div>

                {/* Member's Projects */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Projects</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projects?.map(project => (
                      <span
                        key={project}
                        className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                      >
                        {project}
                      </span>
                    )) || <span className="text-gray-500 text-sm">No projects listed</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Reassignment Modal */}
      {isReassigningTask && taskToReassign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reassign Task</h2>
              <button
                onClick={() => {
                  setIsReassigningTask(false);
                  setTaskToReassign(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Task: {taskToReassign.title}</h3>
              <p className="text-sm text-gray-600">{taskToReassign.description}</p>
            </div>
            <div className="space-y-3">
              {teamMembers
                .filter(member => member._id !== taskToReassign.assignedTo?._id)
                .map(member => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => executeTaskReassignment(taskToReassign, member._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Assign
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPageComponent; 