import React, { useState, useCallback } from 'react';
import { FiMessageSquare, FiSend, FiEdit2, FiTrash2, FiClock, FiImage, FiPaperclip } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { FileAttachmentType } from './FileAttachment';

export interface ActivityItem {
  id: string;
  type: 'comment' | 'status_change' | 'assignment' | 'attachment' | 'other';
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  metadata?: {
    attachments?: FileAttachmentType[];
    mentions?: string[]; // User IDs
    originalContent?: string; // For edited comments
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onAddComment: (content: string, attachments?: File[]) => Promise<void>;
  onEditComment?: (id: string, content: string) => Promise<void>;
  onDeleteComment?: (id: string) => Promise<void>;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  teamMembers?: { id: string; name: string }[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUser,
  teamMembers = [],
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{ top: number; left: number } | null>(null);

  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
          setAttachments(prev => [...prev, file]);
        }
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && attachments.length === 0) return;

    try {
      await onAddComment(newComment.trim(), attachments);
      setNewComment('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditSubmit = async (id: string) => {
    if (!editContent.trim() || !onEditComment) return;

    try {
      await onEditComment(id, editContent.trim());
      setEditingCommentId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '@') {
      const textarea = e.currentTarget;
      const rect = textarea.getBoundingClientRect();
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const lines = textarea.value.substr(0, textarea.selectionStart).split('\n');
      const currentLine = lines.length;
      
      setCursorPosition({
        top: rect.top + currentLine * lineHeight,
        left: rect.left + textarea.selectionStart * 8, // Approximate character width
      });
      setShowMentions(true);
      setMentionSearch('');
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderActivityContent = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'comment':
        return (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {editingCommentId === activity.id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleEditSubmit(activity.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {activity.content}
                </ReactMarkdown>
                {activity.metadata?.attachments && activity.metadata.attachments.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {activity.metadata.attachments.map((file, index) => (
                      <div key={file.id} className="relative group">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="rounded-lg max-h-48 object-cover"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <FiPaperclip className="text-gray-400" />
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'status_change':
        return (
          <div className="text-gray-600">
            changed status to <span className="font-medium">{activity.content}</span>
          </div>
        );
      case 'assignment':
        return (
          <div className="text-gray-600">
            assigned to <span className="font-medium">{activity.content}</span>
          </div>
        );
      case 'attachment':
        return (
          <div className="text-gray-600">
            added attachment: <span className="font-medium">{activity.content}</span>
          </div>
        );
      default:
        return <div className="text-gray-600">{activity.content}</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-2">
        <div className="flex items-start gap-3">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment... (Supports markdown and @mentions)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              {showMentions && cursorPosition && (
                <div
                  className="absolute z-10 bg-white rounded-lg shadow-lg border p-2 w-48"
                  style={{ top: cursorPosition.top, left: cursorPosition.left }}
                >
                  {teamMembers
                    .filter(member => 
                      member.name.toLowerCase().includes(mentionSearch.toLowerCase())
                    )
                    .map(member => (
                      <div
                        key={member.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => {
                          const beforeCursor = newComment.substring(0, newComment.lastIndexOf('@'));
                          const afterCursor = newComment.substring(newComment.lastIndexOf('@') + 1);
                          setNewComment(`${beforeCursor}@${member.name} ${afterCursor}`);
                          setShowMentions(false);
                        }}
                      >
                        {member.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-20 w-20 object-cover rounded"
                      />
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded">
                        <FiPaperclip className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <label className="cursor-pointer text-gray-500 hover:text-gray-700">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileInput}
                accept="image/*,.pdf,.doc,.docx"
              />
              <FiPaperclip className="w-5 h-5" />
            </label>
          </div>
          <button
            type="submit"
            disabled={!newComment.trim() && attachments.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              newComment.trim() || attachments.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiSend />
            Send
          </button>
        </div>
      </form>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            {activity.user.avatar ? (
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">
                  {activity.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {activity.user.name}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <FiClock className="w-3 h-3" />
                  {formatTimestamp(activity.timestamp)}
                </span>
                {activity.type === 'comment' &&
                  activity.user.id === currentUser.id && (
                    <div className="ml-auto flex items-center gap-2">
                      {onEditComment && (
                        <button
                          onClick={() => {
                            setEditingCommentId(activity.id);
                            setEditContent(activity.content);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiEdit2 />
                        </button>
                      )}
                      {onDeleteComment && (
                        <button
                          onClick={() => onDeleteComment(activity.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  )}
              </div>
              {renderActivityContent(activity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed; 