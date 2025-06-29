import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';
import { 
  Box, 
  Heading, 
  Text, 
  Flex, 
  Stack, 
  Badge, 
  Button, 
  Avatar, 
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab, 
  TabPanel,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Switch
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiEdit, FiSave, FiX } from 'react-icons/fi';

// Spotlight effect hook (from Dashboard/LandingPage)
function useSpotlight(ref) {
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ref.current.style.setProperty('--mouse-x', `${x}px`);
      ref.current.style.setProperty('--mouse-y', `${y}px`);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);
}

function SpotlightCard({ className = '', children, ...props }) {
  const cardRef = useRef(null);
  useSpotlight(cardRef);
  return (
    <div
      ref={cardRef}
      className={`relative group ${className}`}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15), transparent 40%)',
        }}
      ></div>
      {children}
    </div>
  );
}

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [hideEmail, setHideEmail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteInputRef = useRef();
  const profileRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form errors
  const [errors, setErrors] = useState({});
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const dangerZoneBg = useColorModeValue('red.50', 'red.900');
  const dangerZoneBorder = useColorModeValue('red.200', 'red.700');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        setFormData({
          name: userProfile.name || '',
          displayName: userProfile.name?.split(' ')[0] || '',
          email: userProfile.email || ''
        });
      } catch (error) {
        toast.error('Failed to fetch user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!isLoading && profileRef.current) {
      gsap.fromTo(profileRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    }
  }, [isLoading]);

  const handleLogout = () => {
    authService.logout();
    toast.success('Successfully logged out');
    navigate('/');
  };
  
  const handleToggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
    toast.success(`Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateProfile = async () => {
    if (!validatePersonalInfo()) return;
    
    setIsSubmitting(true);
    try {
      // Use the auth service to update profile
      await authService.updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      // Update local user state
      setUser({
        ...user,
        name: formData.name,
        email: formData.email
      });
      
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const changePassword = async () => {
    if (!validatePasswordChange()) return;
    
    setIsSubmitting(true);
    try {
      // Use the auth service to change password
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Reset form fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== 'delete' && confirmDelete !== user?.email) {
      toast.error('Please type "delete" or your email to confirm');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await authService.deleteAccount();
      setShowDeleteModal(false);
      toast.success('Account deleted successfully');
      authService.logout();
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user.name || '',
      displayName: user.name?.split(' ')[0] || '',
      email: user.email || ''
    });
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pigmentgreen-500" />
      </div>
    );
  }
  
  // Format joined date
  const formatJoinedDate = () => {
    if (!user?.createdAt) return 'N/A';
    
    const createdDate = new Date(user.createdAt);
    const today = new Date();
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Joined Today';
    } else if (diffDays === 1) {
      return 'Joined Yesterday';
    } else {
      return `Joined on ${createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`;
    }
  };
  return (
    <div ref={profileRef} className="min-h-screen bg-black flex flex-col items-center pt-24 pb-16 px-4">
      {/* Profile Card */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 flex flex-col items-center md:items-start">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 flex items-center justify-center border-4 border-white/10 shadow-lg mb-4">
            <span className="text-white font-bold text-4xl select-none">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          <div className="text-center md:text-left w-full">
            <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
            {user?.role && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${user.role === 'admin' ? 'bg-purple-600/80 text-white' : 'bg-pigmentgreen-600/80 text-white'}`}>{user.role}</span>
            )}
            <div className="text-white/70 text-sm mb-2">{formatJoinedDate()}</div>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={handleLogout} className="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-800 transition-all">Sign Out</button>
              <Link to="/dashboard" className="w-full block">
                <button className="w-full py-2 rounded-xl bg-white/10 text-white/80 font-semibold shadow hover:bg-white/20 transition-all mt-2">Back to Dashboard</button>
              </Link>
            </div>
          </div>
        </SpotlightCard>
        {/* Settings Tabs */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {['Personal Info', 'Security', 'Danger Zone'].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setTabIndex(idx)}
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${tabIndex === idx ? 'bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white border-pigmentgreen-500 shadow-lg' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Tab Panels */}
          <div className="w-full">
            {/* Personal Info Tab */}
            {tabIndex === 0 && (
              <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Personal Information</h3>
                  {!editMode ? (
                    <button onClick={() => setEditMode(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold shadow hover:from-pigmentgreen-600 hover:to-malachite-600 transition-all">Edit</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-white/10 text-white/80 font-semibold shadow hover:bg-white/20 transition-all">Cancel</button>
                      <button onClick={updateProfile} disabled={isSubmitting} className="px-4 py-2 rounded-lg bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold shadow hover:from-pigmentgreen-600 hover:to-malachite-600 transition-all disabled:opacity-60">{isSubmitting ? 'Saving...' : 'Save'}</button>
                    </div>
                  )}
                </div>
                {!editMode ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-white/50 uppercase font-semibold">Full Name</div>
                      <div className="text-base text-white font-medium mt-1">{user?.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase font-semibold">Display Name</div>
                      <div className="text-base text-white font-medium mt-1">{formData.displayName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase font-semibold">Email Address</div>
                      <div className="flex items-center mt-1">
                        <span className="text-base text-white font-medium">
                          {hideEmail ? `${user?.email.substring(0, 3)}****${user?.email.substring(user?.email.lastIndexOf('@'))}` : user?.email}
                        </span>
                        <button onClick={() => setHideEmail(!hideEmail)} className="ml-3 px-2 py-1 rounded bg-white/10 text-xs text-white/70 hover:bg-white/20 transition-all">{hideEmail ? 'Show' : 'Hide'}</button>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 uppercase font-semibold">Member Since</div>
                      <div className="text-base text-white font-medium mt-1">{formatJoinedDate()}</div>
                    </div>
                  </div>
                ) : (
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">Full Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500" placeholder="Enter your full name" />
                      {errors.name && <div className="text-xs text-red-400 mt-1">{errors.name}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">Display Name</label>
                      <input name="displayName" value={formData.displayName} onChange={handleInputChange} className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500" placeholder="Enter your display name" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500" placeholder="Enter your email address" />
                      {errors.email && <div className="text-xs text-red-400 mt-1">{errors.email}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">Email Visibility</label>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={!hideEmail} onChange={() => setHideEmail(!hideEmail)} className="accent-pigmentgreen-500 w-4 h-4" />
                        <span className="text-xs text-white/60">Show email on profile</span>
                      </div>
                    </div>
                  </form>
                )}
                <div className="border-t border-white/10 my-8" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/50 uppercase font-semibold mb-1">Email Notifications</div>
                    <div className="text-sm text-white/70">Receive alerts and updates via email</div>
                  </div>
                  <button onClick={handleToggleNotifications} className={`w-12 h-7 rounded-full flex items-center transition-all duration-200 ${emailNotifications ? 'bg-gradient-to-r from-pigmentgreen-500 to-malachite-500' : 'bg-white/10'}`}> <span className={`inline-block w-6 h-6 rounded-full bg-white shadow transform transition-all duration-200 ${emailNotifications ? 'translate-x-5' : 'translate-x-1'}`}></span> </button>
                </div>
              </SpotlightCard>
            )}
            {/* Security Tab */}
            {tabIndex === 1 && (
              <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
                <div className="border border-white/10 rounded-2xl p-6 mb-8 bg-white/5">
                  <h4 className="text-lg font-semibold text-white mb-4">Change Password</h4>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">Current Password</label>
                      <div className="relative">
                        <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500 w-full" placeholder="Enter current password" />
                        <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-2 top-2 text-white/60 text-lg">{showCurrentPassword ? '🙈' : '👁️'}</button>
                      </div>
                      {errors.currentPassword && <div className="text-xs text-red-400 mt-1">{errors.currentPassword}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">New Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500 w-full" placeholder="Enter new password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-white/60 text-lg">{showPassword ? '🙈' : '👁️'}</button>
                      </div>
                      {errors.newPassword && <div className="text-xs text-red-400 mt-1">{errors.newPassword}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/50 font-semibold">Confirm Password</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500 w-full" placeholder="Confirm new password" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-2 text-white/60 text-lg">{showConfirmPassword ? '🙈' : '👁️'}</button>
                      </div>
                      {errors.confirmPassword && <div className="text-xs text-red-400 mt-1">{errors.confirmPassword}</div>}
                    </div>
                  </form>
                  <button onClick={changePassword} disabled={isSubmitting} className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold shadow hover:from-pigmentgreen-600 hover:to-malachite-600 transition-all disabled:opacity-60">{isSubmitting ? 'Updating...' : 'Update Password'}</button>
                </div>
                <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
                  <h4 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h4>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm text-white/70">Add an extra layer of security to your account</div>
                      <div className="text-sm font-semibold mt-1 text-white/80">Status: <span className="inline-block px-2 py-1 rounded-full bg-red-500/80 text-white text-xs ml-1">Disabled</span></div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold shadow hover:from-pigmentgreen-600 hover:to-malachite-600 transition-all">Enable 2FA</button>
                  </div>
                </div>
              </SpotlightCard>
            )}
            {/* Danger Zone Tab */}
            {tabIndex === 2 && (
              <SpotlightCard className="bg-gradient-to-br from-red-900/40 to-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-red-500/30">
                <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>
                <div className="text-white/80 mb-4">The following actions are irreversible. Please proceed with caution.</div>
                <div className="border border-red-500/30 rounded-2xl p-6 bg-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-white">Delete Account</div>
                    <div className="text-sm text-white/70 mt-1">Once deleted, all your data will be permanently removed. This action cannot be undone.</div>
                  </div>
                  <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all">Delete Account</button>
                </div>
              </SpotlightCard>
            )}
          </div>
        </div>
      </div>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-to-br from-red-900/80 to-black/90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-red-500/30 relative animate-in slide-in-from-top-2">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3 text-white/60 hover:text-white text-xl">&times;</button>
            <h3 className="text-2xl font-bold text-red-400 mb-4">Delete Account</h3>
            <div className="text-white/80 mb-4">This action cannot be undone. All your data will be permanently deleted.</div>
            <div className="text-white/80 font-semibold mb-2">Type "delete" or your email address to confirm:</div>
            <input ref={deleteInputRef} placeholder={`Type "delete" or ${user?.email}`} value={confirmDelete} onChange={e => setConfirmDelete(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4" />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 rounded-xl bg-white/10 text-white/80 font-semibold shadow hover:bg-white/20 transition-all">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={confirmDelete !== 'delete' && confirmDelete !== user?.email || isSubmitting} className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold shadow hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-60">{isSubmitting ? 'Deleting...' : 'Delete Permanently'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
