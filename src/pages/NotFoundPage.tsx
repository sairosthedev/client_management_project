import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <div className="h-2 w-24 bg-indigo-600 mx-auto my-6 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="mx-auto text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 