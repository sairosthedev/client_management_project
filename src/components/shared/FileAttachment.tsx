import React, { useState, useCallback } from 'react';
import { FiFile, FiX, FiDownload, FiUpload, FiImage } from 'react-icons/fi';

export interface FileAttachmentType {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
  previewUrl?: string; // For image thumbnails
}

interface FileAttachmentProps {
  attachments: FileAttachmentType[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (fileId: string) => Promise<void>;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[]; // e.g. ['image/*', 'application/pdf']
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  attachments,
  onUpload,
  onDelete,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  allowedFileTypes = ['*/*'],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        }
      }
    }

    if (imageFiles.length > 0) {
      const validFiles = validateFiles(imageFiles);
      if (validFiles.length > 0) {
        await onUpload(validFiles);
      }
    }
  }, [onUpload]);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFiles = (files: File[]): File[] => {
    return files.filter(file => {
      if (file.size > maxFileSize) {
        setError(`File ${file.name} is too large. Maximum size is ${maxFileSize / 1024 / 1024}MB`);
        return false;
      }
      
      if (!allowedFileTypes.includes('*/*') && 
          !allowedFileTypes.some(type => file.type.match(type.replace('*', '.*')))) {
        setError(`File ${file.name} type is not allowed`);
        return false;
      }
      
      return true;
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = validateFiles(Array.from(e.dataTransfer.files));
    if (files.length > 0) {
      await onUpload(files);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files) {
      const files = validateFiles(Array.from(e.target.files));
      if (files.length > 0) {
        await onUpload(files);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = (file: FileAttachmentType) => {
    return file.type.startsWith('image/');
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <FiUpload className="text-gray-400 w-8 h-8 mb-2" />
          <p className="text-gray-600 mb-2">
            Drag and drop files here, paste screenshots, or{' '}
            <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileInput}
                accept={allowedFileTypes.join(',')}
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Maximum file size: {maxFileSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Attached Files Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {attachments.map((file) => (
          <div
            key={file.id}
            className="group relative bg-gray-50 rounded-lg overflow-hidden"
          >
            {isImage(file) ? (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={file.previewUrl || file.url}
                  alt={file.name}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 flex items-center justify-center bg-gray-100">
                <FiFile className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="p-2">
              <p className="text-sm font-medium text-gray-700 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-black bg-opacity-50 rounded-lg p-1">
              <button
                onClick={() => window.open(file.url, '_blank')}
                className="text-white hover:text-blue-200"
                title="Download"
              >
                <FiDownload className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="text-white hover:text-red-200"
                title="Delete"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileAttachment; 