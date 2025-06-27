import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../utils/auth';
import AuthLayout from '../components/AuthLayout';

const Login = ({ isModal = false, onSwitchModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await authService.login(formData);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    }

    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const FormContent = (
    <>
      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </button>
        
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="mx-4 text-sm font-medium text-white/40">OR</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={onChange}
            className={`w-full px-4 py-3 rounded-lg bg-transparent border ${isModal ? 'border-white/20 focus:border-pigmentgreen-400 text-white' : 'border-jet-300 focus:border-pigmentgreen-500 text-jet-500'} focus:ring-0 focus:outline-none transition-colors duration-200`}
            placeholder="you@example.com"
          />
        </div>

        {/* Password Input */}
        <div className="relative flex items-center">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={onChange}
            className={`w-full px-4 py-3 rounded-lg bg-transparent border ${isModal ? 'border-white/20 focus:border-pigmentgreen-400 text-white' : 'border-jet-300 focus:border-pigmentgreen-500 text-jet-500'} focus:ring-0 focus:outline-none transition-colors duration-200 pr-10`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-0 px-3 flex items-center text-sm leading-5 h-full"
          >
            {showPassword ? (
              <svg className={`h-5 w-5 ${isModal ? 'text-white/50' : 'text-jet-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .527-1.666 1.32-3.207 2.278-4.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c1.135 0 2.235.222 3.27.638m3.936 2.596A10.016 10.016 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7-1.135 0-2.235-.222-3.27-.638m0 0L2.25 21.75" />
              </svg>
            ) : (
              <svg className={`h-5 w-5 ${isModal ? 'text-white/50' : 'text-jet-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 hover:from-pigmentgreen-600 hover:to-malachite-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pigmentgreen-500 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
      
      {isModal && (
        <div className="mt-6 text-center">
          <p className="text-sm text-white/50">
            Don't have an account?{' '}
            <button onClick={onSwitchModal} className="font-medium text-pigmentgreen-400 hover:text-pigmentgreen-300">
              Sign Up
            </button>
          </p>
        </div>
      )}

      {!isModal && (
        <div className="mt-6 text-center">
          <p className="text-sm text-jet-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-pigmentgreen-600 hover:text-pigmentgreen-500">
              Sign Up
            </Link>
          </p>
        </div>
      )}
    </>
  );

  if (isModal) {
    return FormContent;
  }
  
  return (
    <AuthLayout 
      title="Welcome Back"
    >
      {FormContent}
    </AuthLayout>
  );
};

export default Login;
