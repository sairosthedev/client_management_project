import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  iconColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className={`${iconColor} w-8 h-8`} />
      </div>
    </div>
  );
}; 