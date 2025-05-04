import React, { useRef } from 'react';
import { FiDownload, FiChevronDown } from 'react-icons/fi';

interface ExportDropdownProps {
  exportFormat: 'pdf' | 'csv';
  showFormatDropdown: boolean;
  setShowFormatDropdown: (show: boolean) => void;
  onFormatSelect: (format: 'pdf' | 'csv') => void;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({
  exportFormat,
  showFormatDropdown,
  setShowFormatDropdown,
  onFormatSelect
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFormatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowFormatDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowFormatDropdown(!showFormatDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <FiDownload className="w-4 h-4" />
        Export as {exportFormat.toUpperCase()}
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFormatDropdown ? 'transform rotate-180' : ''}`} />
      </button>
      
      {showFormatDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className={`w-full text-left px-4 py-2 text-sm ${exportFormat === 'pdf' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => onFormatSelect('pdf')}
            >
              Export as PDF
            </button>
            <button
              className={`w-full text-left px-4 py-2 text-sm ${exportFormat === 'csv' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => onFormatSelect('csv')}
            >
              Export as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 