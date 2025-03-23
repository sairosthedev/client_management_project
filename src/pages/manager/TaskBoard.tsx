import React from 'react';

const TaskBoard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Task Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* To Do Column */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-800 mb-4">To Do</h2>
          <div className="space-y-3">
            {/* Task cards will go here */}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-800 mb-4">In Progress</h2>
          <div className="space-y-3">
            {/* Task cards will go here */}
          </div>
        </div>

        {/* Review Column */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-800 mb-4">Review</h2>
          <div className="space-y-3">
            {/* Task cards will go here */}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="font-medium text-gray-800 mb-4">Done</h2>
          <div className="space-y-3">
            {/* Task cards will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard; 