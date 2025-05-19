import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardPath } from '../../utils/dashboardPaths';
import { AuthForm } from '../../components/auth/AuthForm';
import { AuthSidebar } from '../../components/auth/AuthSidebar';
import { UserRole } from '../../types';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authSuccess, setAuthSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, error, isLoading, isAuthenticated, user } = useAuth();

  // Redirect after successful login/register
  useEffect(() => {
    if (authSuccess && user) {
      const from = (location.state as any)?.from?.pathname || '/';
      
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        navigate(getDashboardPath(user.role as UserRole), { replace: true });
      }
    }
  }, [authSuccess, user, navigate, location]);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
    agreedToTerms?: boolean;
  }) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
      } else {
        if (!data.agreedToTerms) {
          alert('Please agree to the terms and conditions');
          return;
        }
        
        if (!data.name || !data.role) {
          alert('Name and role are required for registration');
          return;
        }
        
        await register(data.name, data.email, data.password, data.role);
      }
      setAuthSuccess(true);
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-white">
        {/* Left Side - Form */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? 'Please enter your details to sign in to your account.' 
                : 'Fill in the details below to create your free account.'}
            </p>
          </div>

          <AuthForm
            isLogin={isLogin}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleView}
                className="ml-1 font-medium text-[#FF6B00] hover:text-[#FF8C00]"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Side - Image/Illustration */}
        <AuthSidebar />
      </div>
    </div>
  );
};

export default AuthPage; 