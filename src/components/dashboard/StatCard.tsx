import React from 'react';
import { StatCardProps } from '../../types/dashboard';

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium">{value}</h3>
          <p className="text-gray-600 text-sm">{label}</p>
        </div>
      </div>
      {trend !== undefined && (
        <div className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  </div>
); 