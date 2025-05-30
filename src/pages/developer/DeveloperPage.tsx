import React, { useState } from 'react';
import { TaskBoard } from '../../components/shared/TaskBoard';
import { useDeveloperTasks } from '../../hooks/useDeveloperTasks';
import { useAuth } from '../../contexts/AuthContext';
import { TaskBoardHeader } from '../../components/developer/TaskBoardHeader';
import { TaskStats } from '../../components/developer/TaskStats';
import type { Task } from '../../types/task';
import type { TeamMemberType } from '../../types';

const DeveloperPage: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    refreshTasks
  } = useDeveloperTasks();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [sortField, setSortField] = useState<string>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (!user) {
    return <div>Please log in to view your tasks.</div>;
  }

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentUser: TeamMemberType = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.name.charAt(0).toUpperCase(),
    skills: [],
    projects: [],
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesProject = !projectFilter || task.project === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[sortField as keyof Task];
    const bValue = b[sortField as keyof Task];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaskBoardHeader
          onNewTask={() => {}}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
        />
        
        <div className="mt-8">
          <TaskStats tasks={tasks} />
        </div>

        <div className="mt-8">
          <TaskBoard
            tasks={sortedTasks}
            onTaskUpdate={updateTask}
            onTaskCreate={createTask}
            currentUser={currentUser}
            showStats={true}
            showTimeTracking={true}
            clientId={user._id}
          />
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage; 