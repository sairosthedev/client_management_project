import React from 'react';
import { TimelineItem } from '../../types/dashboard';

interface TimelineProps {
  items: TimelineItem[];
}

const getStatusColor = (status: TimelineItem['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-600';
    case 'in-progress':
      return 'bg-blue-600';
    case 'pending':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
};

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
            <div className="flex-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <div className="text-sm text-gray-600">Due in {item.dueDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 