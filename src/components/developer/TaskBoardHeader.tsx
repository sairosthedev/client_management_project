import React from 'react';
import { FiFilter, FiSearch, FiPlus } from 'react-icons/fi';
import type { TaskStatus } from '../../types/task';
import type { SortField, SortDirection } from '../../types/developer';

interface TaskBoardHeaderProps {
  searchTerm: string;
  statusFilter: TaskStatus | 'all';
  projectFilter: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  onProjectFilterChange: (project: string) => void;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onNewTask: () => void;
}

export const TaskBoardHeader: React.FC<TaskBoardHeaderProps> = ({
  searchTerm,
  statusFilter,
  projectFilter,
  sortField,
  sortDirection,
  onSearchChange,
  onStatusFilterChange,
  onProjectFilterChange,
  onSortFieldChange,
  onSortDirectionChange,
  onNewTask,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <button 
            className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded"
            onClick={() => {/* Implement filter modal */}}
          >
            <FiFilter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as TaskStatus | 'all')}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 hover:bg-gray-100 rounded"
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={onNewTask}
        >
          <FiPlus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>
    </div>
  );
}; 