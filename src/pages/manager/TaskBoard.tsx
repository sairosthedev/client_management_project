import React, { useState, useCallback } from 'react';
import { TaskBoard as SharedTaskBoard } from '../../components/shared/TaskBoard';
import { useAuth } from '../../contexts/AuthContext';
import { useManagerTasks } from '../../hooks/useManagerTasks';
import type { Task } from '../../types/task';
import type { TeamMemberType } from '../../types';

const ManagerTaskBoard: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    refreshTasks,
  } = useManagerTasks();

  const currentUser: TeamMemberType = {
    _id: user?._id || '',
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'project_manager',
    avatar: user?.name?.charAt(0).toUpperCase() || 'P',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Project Tasks</h1>
          <p className="text-sm text-gray-500">Manage and track project progress</p>
        </div>
      </div>

      <SharedTaskBoard
        tasks={tasks}
        onTaskUpdate={updateTask}
        onTaskCreate={createTask}
        currentUser={currentUser}
        showStats={true}
        showTimeTracking={true}
      />
    </div>
  );
};

export default ManagerTaskBoard; 