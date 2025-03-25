import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a simple error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-6 bg-red-50 min-h-screen">
    <h1 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h1>
    <div className="p-4 bg-white rounded shadow mb-4">
      <p className="font-mono text-red-600">{error.message}</p>
      {error.stack && (
        <pre className="mt-2 p-2 bg-gray-100 overflow-auto text-xs text-gray-800 rounded">
          {error.stack}
        </pre>
      )}
    </div>
    <p>Please check the console for more details.</p>
    <button
      onClick={() => window.location.href = '/debug'}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go to Debug Page
    </button>
  </div>
);

// Render app with error handling
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render App:', error);
    root.render(<ErrorFallback error={error instanceof Error ? error : new Error('Unknown error')} />);
  }
} else {
  console.error('Root element not found');
}
