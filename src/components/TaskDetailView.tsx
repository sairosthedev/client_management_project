import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Tag, Users, X, MessageSquare, Paperclip, Link2, Play, Pause, Timer, Flag, CheckCircle2 } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import NotionEditor from './NotionEditor';
import type { Task } from '../types/task';

interface TimeTracking {
  totalTime: number; // in seconds
  isRunning: boolean;
  startTime?: number;
  timeEntries: TimeEntry[];
}

interface TimeEntry {
  id: string;
  startTime: number;
  endTime: number;
  description?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  reactions: Reaction[];
  replies: Comment[];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  value: any;
  options?: string[];
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
}

interface TaskDetailViewProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'subtasks'>('details');
  const [elapsedTime, setElapsedTime] = useState(task.timeTracking.totalTime);

  // Time tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (editedTask.timeTracking.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const startTime = editedTask.timeTracking.startTime || now;
        const additionalTime = differenceInSeconds(now, startTime) * 1000;
        setElapsedTime(editedTask.timeTracking.totalTime + additionalTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [editedTask.timeTracking.isRunning, editedTask.timeTracking.startTime]);

  const toggleTimeTracking = () => {
    const now = Date.now();
    if (editedTask.timeTracking.isRunning) {
      // Stop timer
      const timeEntry: TimeEntry = {
        id: Date.now().toString(),
        startTime: editedTask.timeTracking.startTime!,
        endTime: now,
      };
      setEditedTask({
        ...editedTask,
        timeTracking: {
          ...editedTask.timeTracking,
          isRunning: false,
          totalTime: elapsedTime,
          timeEntries: [...editedTask.timeTracking.timeEntries, timeEntry],
        },
      });
    } else {
      // Start timer
      setEditedTask({
        ...editedTask,
        timeTracking: {
          ...editedTask.timeTracking,
          isRunning: true,
          startTime: now,
        },
      });
    }
  };

  const formatTime = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const addSubtask = () => {
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title: 'New subtask',
      completed: false,
    };
    setEditedTask({
      ...editedTask,
      subtasks: [...editedTask.subtasks, newSubtask],
    });
  };

  const toggleSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ),
    });
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      timestamp: new Date().toISOString(),
      reactions: [],
      replies: [],
    };

    setEditedTask({
      ...editedTask,
      comments: [...editedTask.comments, comment],
    });
    setNewComment('');
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-xl font-semibold">{task.title}</h2>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTimeTracking}
                className={`p-2 rounded-full ${
                  editedTask.timeTracking.isRunning
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                {editedTask.timeTracking.isRunning ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <div className="text-sm font-mono">{formatTime(elapsedTime)}</div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('subtasks')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'subtasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subtasks
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 border-b-2 font-medium text-sm ${
                activeTab === 'activity'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {activeTab === 'details' && (
                <>
                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                    {isEditing ? (
                      <textarea
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-600">{task.description}</p>
                    )}
                  </div>

                  {/* Time Tracking */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Time Tracking</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Estimated Time</label>
                        <div className="mt-1 text-lg font-medium">
                          {formatTime(task.estimatedHours)}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Time Spent</label>
                        <div className="mt-1 text-lg font-medium">
                          {formatTime(task.actualHours)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Custom Fields</h3>
                    {editedTask.customFields.map((field) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{field.name}</span>
                        {field.type === 'select' ? (
                          <select
                            value={field.value}
                            onChange={(e) => {
                              setEditedTask({
                                ...editedTask,
                                customFields: editedTask.customFields.map(f =>
                                  f.id === field.id ? { ...f, value: e.target.value } : f
                                ),
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          >
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type === 'date' ? 'date' : 'text'}
                            value={field.value}
                            onChange={(e) => {
                              setEditedTask({
                                ...editedTask,
                                customFields: editedTask.customFields.map(f =>
                                  f.id === field.id ? { ...f, value: e.target.value } : f
                                ),
                              });
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Comments */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Comments</h3>
                    <div className="space-y-4">
                      {editedTask.comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">{comment.author}</span>
                              <span className="text-gray-500 ml-2">
                                {format(new Date(comment.timestamp), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-700">{comment.content}</div>
                            <div className="mt-2 flex items-center space-x-2">
                              {comment.reactions.map((reaction) => (
                                <button
                                  key={reaction.emoji}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {reaction.emoji} {reaction.count}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={addComment}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'subtasks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Subtasks</h3>
                    <button
                      onClick={addSubtask}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Subtask
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editedTask.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(subtask.id)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {subtask.title}
                        </span>
                        {subtask.assignee && (
                          <span className="text-sm text-gray-500">{subtask.assignee}</span>
                        )}
                        {subtask.dueDate && (
                          <span className="text-sm text-gray-500">
                            {format(new Date(subtask.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Time Entries</h3>
                  <div className="space-y-2">
                    {editedTask.timeTracking.timeEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Timer className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {format(entry.startTime, 'MMM d, h:mm a')} -{' '}
                            {format(entry.endTime, 'h:mm a')}
                          </span>
                        </div>
                        <span className="text-sm font-mono text-gray-500">
                          {formatTime(entry.endTime - entry.startTime)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Status</h3>
                <select
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="blocked">Blocked</option>
                  <option value="on_hold">On Hold</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Priority</h3>
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Assignee */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Assignee</h3>
                <select
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Due Date</h3>
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Watchers */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Watchers</h3>
                <div className="flex flex-wrap gap-2">
                  {editedTask.watchers.map((watcher) => (
                    <span
                      key={watcher}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {watcher}
                      <button
                        onClick={() => setEditedTask({
                          ...editedTask,
                          watchers: editedTask.watchers.filter((w) => w !== watcher),
                        })}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add watcher..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const value = input.value.trim();
                      if (value && !editedTask.watchers.includes(value)) {
                        setEditedTask({
                          ...editedTask,
                          watchers: [...editedTask.watchers, value],
                        });
                        input.value = '';
                      }
                    }
                  }}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Dependencies */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Dependencies</h3>
                <div className="space-y-2">
                  {editedTask.dependencies.map((dependency) => (
                    <div
                      key={dependency}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <span className="text-sm text-gray-700">{dependency}</span>
                      <button
                        onClick={() => setEditedTask({
                          ...editedTask,
                          dependencies: editedTask.dependencies.filter((d) => d !== dependency),
                        })}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add dependency..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const value = input.value.trim();
                      if (value && !editedTask.dependencies.includes(value)) {
                        setEditedTask({
                          ...editedTask,
                          dependencies: [...editedTask.dependencies, value],
                        });
                        input.value = '';
                      }
                    }
                  }}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {editedTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        onClick={() => setEditedTask({
                          ...editedTask,
                          tags: editedTask.tags.filter((t) => t !== tag),
                        })}
                        className="ml-1 text-blue-400 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.target as HTMLInputElement;
                      const value = input.value.trim();
                      if (value && !editedTask.tags.includes(value)) {
                        setEditedTask({
                          ...editedTask,
                          tags: [...editedTask.tags, value],
                        });
                        input.value = '';
                      }
                    }
                  }}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Attachments */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                <div className="space-y-2">
                  {editedTask.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center">
                        <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <span className="text-sm text-gray-700 block">{attachment.name}</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(attachment.uploadedAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Link2 className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Cancel Editing' : 'Edit'}
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;