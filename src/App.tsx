import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserContextProvider } from './contexts/UserContextProvider';
import RouteConfig from './routes/RouteConfig';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <AuthProvider>
          <UserContextProvider>
            <RouteConfig />
          </UserContextProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;