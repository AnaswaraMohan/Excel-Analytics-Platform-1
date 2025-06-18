import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white text-xl font-bold">
              Excel Analytics Platform
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white">Welcome, {user.name}</span>
              <span className="text-blue-200 text-sm">({user.role})</span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
