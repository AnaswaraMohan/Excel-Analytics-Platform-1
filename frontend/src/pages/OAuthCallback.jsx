import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../utils/auth';
import { validateOAuthResponse } from '../utils/oauthUtils';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          toast.error('OAuth authentication failed. Please try again.');
          navigate('/login');
          return;
        }

        if (token && userParam) {
          try {
            // Parse user data safely
            const userData = JSON.parse(decodeURIComponent(userParam));
            
            // Validate the OAuth response
            validateOAuthResponse(token, userData);
            
            // Store the token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Update auth service state if needed
            if (authService.setToken) {
              authService.setToken(token);
            }
            
            toast.success('OAuth authentication successful!');
            navigate('/dashboard');
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            toast.error('Invalid user data received from OAuth provider.');
            navigate('/login');
          }
        } else {
          console.error('Missing token or user data in OAuth callback');
          toast.error('Invalid OAuth response. Please try again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Authentication</h2>
          <p className="text-white/60">Please wait while we complete your login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback; 