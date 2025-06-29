// OAuth utility functions for environment validation and debugging

export const checkOAuthConfig = () => {
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const issues = [];

  if (!backendUrl) {
    issues.push('VITE_API_URL is not configured');
  }

  return {
    isValid: issues.length === 0,
    issues,
    backendUrl
  };
};

export const getOAuthUrl = (provider) => {
  const config = checkOAuthConfig();
  
  if (!config.isValid) {
    throw new Error(`OAuth configuration issues: ${config.issues.join(', ')}`);
  }

  return `${config.backendUrl}/api/auth/${provider}`;
};

export const validateOAuthResponse = (token, userData) => {
  if (!token) {
    throw new Error('No authentication token received');
  }

  if (!userData) {
    throw new Error('No user data received');
  }

  const requiredFields = ['_id', 'name', 'email'];
  const missingFields = requiredFields.filter(field => !userData[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required user fields: ${missingFields.join(', ')}`);
  }

  return true;
}; 