import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const AuthSidebar: React.FC = () => {
  return (
    <div className="hidden lg:block bg-black p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 opacity-90"></div>
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Client Management System</h2>
          <p className="text-gray-300">Manage your projects, teams, and clients with ease.</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-[#FF6B00] mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-white">Track projects</h3>
              <p className="text-gray-300 text-sm">Monitor progress, deadlines, and milestones.</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-[#FF6B00] mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-white">Collaborate with teams</h3>
              <p className="text-gray-300 text-sm">Work together seamlessly with developers, managers, and clients.</p>
            </div>
          </div>
          <div className="flex items-start">
            <CheckCircle2 className="h-6 w-6 text-[#FF6B00] mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-white">Organize tasks</h3>
              <p className="text-gray-300 text-sm">Assign, prioritize, and track tasks efficiently.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-gray-700">
          <p className="text-gray-300 text-sm">
            "This platform has transformed how we manage our projects and client relationships."
          </p>
          <div className="mt-2 flex items-center">
            <div className="h-10 w-10 rounded-full bg-[#FF6B00] flex items-center justify-center text-white font-bold">
              MS
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">Macdonald Sairos</p>
              <p className="text-gray-400 text-sm">Product Manager</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#FF6B00] rounded-full opacity-20"></div>
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#FF6B00] rounded-full opacity-20"></div>
    </div>
  );
}; 