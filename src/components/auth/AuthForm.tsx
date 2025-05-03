import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User, Lock, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: {
    email: string;
    password: string;
    name?: string;
    role?: UserRole;
    agreedToTerms?: boolean;
  }) => void;
  isLoading: boolean;
  error?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  onSubmit,
  isLoading,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && !agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    onSubmit({
      email,
      password,
      ...(isLogin ? {} : { name, role, agreedToTerms })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!isLogin && (
        <div className="relative">
          <label 
            htmlFor="name" 
            className={`absolute left-4 ${
              nameFocused || name ? 'text-xs top-2 text-[#FF6B00]' : 'text-base top-1/2 -translate-y-1/2 text-gray-500'
            } transition-all duration-200`}
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className={`h-5 w-5 ${nameFocused || name ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
            </div>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`block w-full rounded-lg border ${
                nameFocused ? 'border-[#FF6B00]' : 'border-gray-300'
              } pl-11 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-white`}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              required={!isLogin}
              placeholder="John Doe"
            />
          </div>
        </div>
      )}

      <div className="relative">
        <label 
          htmlFor="email" 
          className={`absolute left-4 ${
            emailFocused || email ? 'text-xs top-2 text-[#FF6B00]' : 'text-base top-1/2 -translate-y-1/2 text-gray-500'
          } transition-all duration-200`}
        >
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className={`h-5 w-5 ${emailFocused || email ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`block w-full rounded-lg border ${
              emailFocused ? 'border-[#FF6B00]' : 'border-gray-300'
            } pl-11 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-white`}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="relative">
        <label 
          htmlFor="password" 
          className={`absolute left-4 ${
            passwordFocused || password ? 'text-xs top-2 text-[#FF6B00]' : 'text-base top-1/2 -translate-y-1/2 text-gray-500'
          } transition-all duration-200`}
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className={`h-5 w-5 ${passwordFocused || password ? 'text-[#FF6B00]' : 'text-gray-400'}`} />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`block w-full rounded-lg border ${
              passwordFocused ? 'border-[#FF6B00]' : 'border-gray-300'
            } pl-11 pr-11 pt-6 pb-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-white`}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
            placeholder="Enter your password"
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
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-white"
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
              className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm font-medium text-[#FF6B00] hover:text-[#FF8C00]">
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
              className="h-4 w-4 text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600">
              I agree to the <a href="#" className="text-[#FF6B00] hover:text-[#FF8C00]">Terms of Service</a> and <a href="#" className="text-[#FF6B00] hover:text-[#FF8C00]">Privacy Policy</a>
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3.5 border border-transparent text-base font-medium rounded-lg text-black bg-[#FF6B00] hover:bg-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B00] transition-colors duration-200"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
}; 