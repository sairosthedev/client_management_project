import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { Task } from '../types/task';

const TaskPage: React.FC = () => {
  const { clientId, projectId } = useParams<{ clientId: string; projectId: string }>();
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleTaskCreated = () => {
    setShowForm(false);
    setSelectedTask(undefined);
  };

  if (!clientId || !projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Request</h1>
          <p className="text-gray-600">Client ID or Project ID is missing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {selectedTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <TaskForm
            clientId={clientId}
            projectId={projectId}
            onTaskCreated={handleTaskCreated}
            initialTask={selectedTask}
          />
        </div>
      )}

      <TaskList clientId={clientId} projectId={projectId} />
    </div>
  );
};

export default TaskPage; 