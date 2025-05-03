import React from 'react';

const DebugPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <p>Debugging information:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Current URL: {window.location.href}</li>
          <li>React Router is {typeof Routes === 'undefined' ? 'NOT ' : ''}available</li>
          <li>Local Storage: {localStorage.getItem('user') ? 'User found' : 'No user found'}</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugPage; 