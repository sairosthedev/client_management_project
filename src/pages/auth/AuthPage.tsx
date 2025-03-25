import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Eye, EyeOff, Mail, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, error, isLoading, isAuthenticated, user } = useAuth();

  // Redirect after successful login/register
  useEffect(() => {
    // Only redirect if auth was successful (prevents immediate redirects)
    if (authSuccess && isAuthenticated && user) {
      // Check if we have a redirected location stored
      const from = (location.state as any)?.from?.pathname || '/';
      
      // If we do, go there, otherwise determine dashboard based on role
      if (from !== '/') {
        navigate(from, { replace: true });
      } else {
        // Determine dashboard path based on user role
        const getDashboardPath = (role: UserRole) => {
          switch (role) {
            case 'admin': return '/admin/dashboard';
            case 'project_manager': return '/manager/dashboard';
            case 'client': return '/client/projects';
            case 'qa_engineer': return '/qa/dashboard';
            case 'designer': return '/designer/tasks';
            default: return '/developer/tasks';
          }
        };
        
        navigate(getDashboardPath(user.role), { replace: true });
      }
    }
  }, [authSuccess, isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!agreedToTerms) {
          alert('Please agree to the terms and conditions');
          return;
        }
        await register(name, email, password, role);
      }
      
      // Mark auth as successful to trigger the redirect effect
      setAuthSuccess(true);
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
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

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <label 
                  htmlFor="name" 
                  className={`absolute left-4 ${
                    nameFocused || name ? 'text-xs top-2 text-indigo-600' : 'text-base top-1/2 -translate-y-1/2 text-gray-500'
                  } transition-all duration-200`}
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className={`h-5 w-5 ${nameFocused || name ? 'text-indigo-600' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`block w-full rounded-lg border ${
                      nameFocused ? 'border-indigo-600' : 'border-gray-300'
                    } pl-11 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <label 
                htmlFor="email" 
                className={`absolute left-4 ${
                  emailFocused || email ? 'text-xs top-2 text-indigo-600' : 'text-base top-1/2 -translate-y-1/2 text-gray-500'
                } transition-all duration-200`}
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${emailFocused || email ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full rounded-lg border ${
                    emailFocused ? 'border-indigo-600' : 'border-gray-300'
                  } pl-11 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label 
                htmlFor="password" 
                className={`absolute left-4 ${
                  passwordFocused || password ? 'text-xs top-2 text-indigo-600' : 'text-base top-1/2 -translate-y-1/2 text-gray-500'
                } transition-all duration-200`}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${passwordFocused || password ? 'text-indigo-600' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full rounded-lg border ${
                    passwordFocused ? 'border-indigo-600' : 'border-gray-300'
                  } pl-11 pr-11 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white`}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {!isLogin && (
              <div className="relative">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Select your role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="developer">Developer</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="client">Client</option>
                  <option value="qa_engineer">QA Engineer</option>
                  <option value="designer">Designer</option>
                </select>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            ) : (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  {isLogin ? 'Sign in to account' : 'Create account'} <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleView}
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Right Side - Image/Illustration */}
        <div className="hidden lg:block bg-indigo-600 p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 opacity-90"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Client Management System</h2>
              <p className="text-indigo-200">Manage your projects, teams, and clients with ease.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-white">Track projects</h3>
                  <p className="text-indigo-200 text-sm">Monitor progress, deadlines, and milestones.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-white">Collaborate with teams</h3>
                  <p className="text-indigo-200 text-sm">Work together seamlessly with developers, managers, and clients.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-white">Organize tasks</h3>
                  <p className="text-indigo-200 text-sm">Assign, prioritize, and track tasks efficiently.</p>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-indigo-500">
              <p className="text-indigo-200 text-sm">
                "This platform has transformed how we manage our projects and client relationships."
              </p>
              <div className="mt-2 flex items-center">
                <div className="h-10 w-10 rounded-full bg-indigo-800 flex items-center justify-center text-white font-bold">
                  JP
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">Jane Phillips</p>
                  <p className="text-indigo-300 text-sm">Product Manager</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 