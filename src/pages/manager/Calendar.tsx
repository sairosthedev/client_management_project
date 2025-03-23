import React from 'react';

const Calendar: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project Calendar</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Calendar header */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-white p-4 text-center font-medium">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-4 min-h-[100px] border-t border-gray-100"
            >
              <span className="text-gray-500">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 