import React, { useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Caught error:', event.error);
      setErrorInfo(event.error?.message || 'An error occurred during rendering');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (errorInfo) {
    return (
      <div className="p-8 bg-red-50 min-h-screen">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h1>
        <p className="mb-4">{errorInfo}</p>
        <button 
          onClick={() => window.location.href = '/debug'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Debug Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary; 