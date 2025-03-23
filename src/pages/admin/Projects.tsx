import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCalendar, FiUsers, FiX, FiPaperclip, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';
import ProjectForm from '../../components/forms/ProjectForm';
import FileAttachment, { FileAttachmentType } from '../../components/shared/FileAttachment';
import ActivityFeed, { ActivityItem } from '../../components/shared/ActivityFeed';
import TeamMember, { TeamMemberType } from '../../components/shared/TeamMember';
import Milestone, { MilestoneType } from '../../components/shared/Milestone';
import ProjectAnalytics from '../../components/shared/ProjectAnalytics';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  client: string;
  status: 'active' | 'completed' | 'on_hold';
  team: TeamMemberType[];
  progress: number;
  files: FileAttachmentType[];
  activities: ActivityItem[];
  milestones: MilestoneType[];
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    assignee?: TeamMemberType;
    timeEstimate: number;
    timeSpent: number;
    dueDate: Date;
  }>;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-30'),
    client: 'Tech Solutions Inc',
    status: 'active',
    team: ['Maria Garcia', 'John Smith'],
    progress: 35,
    files: [],
    activities: [],
    milestones: [],
    tasks: [],
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Developing a cross-platform mobile app using React Native',
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-05-15'),
    client: 'Digital Innovations',
    status: 'active',
    team: ['Sarah Wilson', 'John Smith'],
    progress: 60,
    files: [],
    activities: [],
    milestones: [],
    tasks: [],
  },
];

const mockClients = [
  { id: '1', name: 'Tech Solutions Inc' },
  { id: '2', name: 'Digital Innovations' },
  { id: '3', name: 'Marketing Pro' },
];

const mockTeam = [
  { id: '1', name: 'Maria Garcia' },
  { id: '2', name: 'John Smith' },
  { id: '3', name: 'Sarah Wilson' },
];

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const currentUser = {
    id: 'current-user',
    name: 'Admin User',
    email: 'admin@example.com',
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = async (formData: Omit<Project, 'id' | 'progress' | 'files' | 'activities' | 'milestones' | 'tasks'>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProject: Project = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        files: [],
        activities: [],
        milestones: [],
        tasks: [],
      };
      
      setProjects(prev => [...prev, newProject]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async (formData: Omit<Project, 'id' | 'progress' | 'files' | 'activities' | 'milestones' | 'tasks'>) => {
    if (!editingProject) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(prev =>
        prev.map(project =>
          project.id === editingProject.id
            ? { ...project, ...formData }
            : project
        )
      );
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjects(prev => prev.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = async (projectId: string, files: File[]) => {
    // Simulate file upload
    const newFiles: FileAttachmentType[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: currentUser.name,
      uploadedAt: new Date(),
      url: URL.createObjectURL(file),
    }));

    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, files: [...project.files, ...newFiles] }
          : project
      )
    );

    // Add activity for file upload
    const activities: ActivityItem[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'attachment',
      content: file.name,
      user: currentUser,
      timestamp: new Date(),
    }));

    handleAddActivities(projectId, activities);
  };

  const handleDeleteFile = async (projectId: string, fileId: string) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, files: project.files.filter(f => f.id !== fileId) }
          : project
      )
    );
  };

  const handleAddComment = async (projectId: string, content: string) => {
    const newActivity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'comment',
      content,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(projectId, [newActivity]);
  };

  const handleAddActivities = (projectId: string, newActivities: ActivityItem[]) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, activities: [...newActivities, ...project.activities] }
          : project
      )
    );
  };

  const handleAddTeamMember = async (projectId: string, member: Omit<TeamMemberType, 'id'>) => {
    const newMember: TeamMemberType = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
    };

    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, team: [...project.team, newMember] }
          : project
      )
    );

    // Add activity for new team member
    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'assignment',
      content: `${member.name} (${member.role})`,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(projectId, [activity]);
  };

  const handleRemoveTeamMember = async (projectId: string, memberId: string) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, team: project.team.filter(m => m.id !== memberId) }
          : project
      )
    );
  };

  const handleAddMilestone = async (projectId: string, milestone: Omit<MilestoneType, 'id'>) => {
    const newMilestone: MilestoneType = {
      ...milestone,
      id: Math.random().toString(36).substr(2, 9),
    };

    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, milestones: [...project.milestones, newMilestone] }
          : project
      )
    );

    // Add activity for new milestone
    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'milestone',
      content: `Added milestone: ${milestone.title}`,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(projectId, [activity]);
  };

  const handleUpdateMilestone = async (
    projectId: string,
    milestoneId: string,
    updates: Partial<MilestoneType>
  ) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              milestones: project.milestones.map(milestone =>
                milestone.id === milestoneId
                  ? { ...milestone, ...updates }
                  : milestone
              ),
            }
          : project
      )
    );

    // Add activity for milestone update
    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'milestone',
      content: `Updated milestone: ${updates.title || 'Untitled'}`,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(projectId, [activity]);
  };

  const handleDeleteMilestone = async (projectId: string, milestoneId: string) => {
    const project = projects.find(p => p.id === projectId);
    const milestone = project?.milestones.find(m => m.id === milestoneId);

    if (!project || !milestone) return;

    setProjects(prev =>
      prev.map(p =>
        p.id === projectId
          ? {
              ...p,
              milestones: p.milestones.filter(m => m.id !== milestoneId),
            }
          : p
      )
    );

    // Add activity for milestone deletion
    const activity: ActivityItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'milestone',
      content: `Deleted milestone: ${milestone.title}`,
      user: currentUser,
      timestamp: new Date(),
    };

    handleAddActivities(projectId, [activity]);
  };

  const calculateProjectMetrics = (project: Project) => {
    const completedTasks = project.tasks.filter(task => task.status === 'done').length;
    const overdueTasks = project.tasks.filter(
      task => new Date(task.dueDate) < new Date() && task.status !== 'done'
    ).length;
    const totalTimeSpent = project.tasks.reduce((sum, task) => sum + task.timeSpent, 0);
    const totalTimeEstimate = project.tasks.reduce((sum, task) => sum + task.timeEstimate, 0);

    return {
      totalTasks: project.tasks.length,
      completedTasks,
      overdueTasks,
      totalTimeSpent,
      totalTimeEstimate,
      teamMembers: project.team,
      milestones: project.milestones,
      tasks: project.tasks,
    };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">{project.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                    setShowAnalytics(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiBarChart2 />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                    setShowProjectDetails(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiPaperclip />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{project.description}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                <span>-</span>
                <span>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiUsers className="w-4 h-4" />
                <span>{project.team.length} team members</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}
                >
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">{project.client}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Project Modal */}
      {(showAddModal || editingProject) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProject(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <ProjectForm
              initialData={editingProject || {}}
              onSubmit={editingProject ? handleEditProject : handleAddProject}
              onCancel={() => {
                setShowAddModal(false);
                setEditingProject(null);
              }}
              isSubmitting={isSubmitting}
              clients={mockClients}
              team={mockTeam}
            />
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                  <p className="text-gray-600 mt-1">{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setShowProjectDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Milestones Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Milestones</h3>
                    <Milestone
                      milestones={selectedProject.milestones}
                      onAddMilestone={(milestone) =>
                        handleAddMilestone(selectedProject.id, milestone)
                      }
                      onUpdateMilestone={(id, updates) =>
                        handleUpdateMilestone(selectedProject.id, id, updates)
                      }
                      onDeleteMilestone={(id) =>
                        handleDeleteMilestone(selectedProject.id, id)
                      }
                      projectTasks={selectedProject.tasks}
                    />
                  </div>

                  {/* Files Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Files</h3>
                    <FileAttachment
                      attachments={selectedProject.files}
                      onUpload={(files) => handleFileUpload(selectedProject.id, files)}
                      onDelete={(fileId) => handleDeleteFile(selectedProject.id, fileId)}
                    />
                  </div>

                  {/* Activity Feed */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Activity</h3>
                    <ActivityFeed
                      activities={selectedProject.activities}
                      onAddComment={(content) => handleAddComment(selectedProject.id, content)}
                      currentUser={currentUser}
                    />
                  </div>
                </div>

                <div>
                  {/* Team Members */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Team</h3>
                    <TeamMember
                      members={selectedProject.team}
                      onAddMember={(member) => handleAddTeamMember(selectedProject.id, member)}
                      onRemoveMember={(memberId) => handleRemoveTeamMember(selectedProject.id, memberId)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedProject.name} - Analytics
                </h2>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>

              <ProjectAnalytics
                metrics={calculateProjectMetrics(selectedProject)}
                startDate={selectedProject.startDate}
                endDate={selectedProject.endDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 