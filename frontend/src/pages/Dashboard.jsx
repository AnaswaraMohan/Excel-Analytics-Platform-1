import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import { getUserUploads, deleteUpload, retryAnalysis, uploadExcelFile } from '../services/uploadService';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FiUpload, FiActivity, FiFileText, FiZap, FiCheck, 
  FiClock, FiAlertTriangle, FiTrash2, FiEye, FiRefreshCw, FiPlus,
  FiDatabase, FiTrendingUp, FiUser, FiLogOut, FiBarChart,
  FiDownload, FiSearch, FiGrid, FiPieChart, FiMoreVertical,
  FiSettings, FiBell, FiHelpCircle, FiChevronDown, FiFilter
} from 'react-icons/fi';

// Spotlight effect hook
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

// SpotlightCard wrapper
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

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Modern Glassmorphism Card Component with SpotlightCard integration
function GlassCard({ className = '', children, variant = 'default', ...props }) {
  const cardRef = useRef(null);
  useSpotlight(cardRef);
  
  const variants = {
    default: 'bg-white/5 border-white/10 hover:bg-white/10',
    primary: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/20 hover:border-emerald-400/30',
    success: 'bg-gradient-to-br from-emerald-500/10 to-teal-600/10 border-emerald-500/20 hover:border-emerald-400/30',
    warning: 'bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20 hover:border-amber-400/30',
    danger: 'bg-gradient-to-br from-red-500/10 to-pink-600/10 border-red-500/20 hover:border-red-400/30'
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative group backdrop-blur-lg border rounded-2xl transition-all duration-500 
        ${variants[variant]} ${className}
        overflow-hidden
      `}
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
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Loading Skeleton Component
function SkeletonLoader({ className = '', lines = 1 }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-white/10 rounded mb-2 last:mb-0" />
      ))}
    </div>
  );
}

// Toast Notification Component
function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border backdrop-blur-xl ${types[type]} animate-in slide-in-from-top-2`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  const statsRef = useRef([]);
  const filesRef = useRef([]);
  
  // State management
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [toast, setToast] = useState(null);

  // Initialize animations and data
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Fetch user profile
        const userProfile = await authService.getProfile();
        setUser(userProfile);
        
        // Load uploads
        await loadUploads();
        
        // Initialize animations
        initializeAnimations();
        
        // Show welcome toast
        showToast(`Welcome back, ${userProfile?.name?.split(' ')[0] || 'User'}!`, 'success');
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showToast('Failed to load dashboard. Please try again.', 'error');
        navigate('/login');
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Modern GSAP animations
  const initializeAnimations = () => {
    // Stagger animation for stats cards
    gsap.fromTo(statsRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.2
      }
    );

    // Files list animation
    gsap.fromTo(filesRef.current,
      { x: 100, opacity: 0 },
      { 
        x: 0, 
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.5
      }
    );
  };

  // Add refs to arrays
  const addStatsRef = (el) => {
    if (el && !statsRef.current.includes(el)) {
      statsRef.current.push(el);
    }
  };

  const addFilesRef = (el) => {
    if (el && !filesRef.current.includes(el)) {
      filesRef.current.push(el);
    }
  };

  // Toast notification handler
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
  };

  // Enhanced file upload with better error handling
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      showToast('Please upload a valid Excel file (.xlsx or .xls)', 'error');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be less than 10MB', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Smooth progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 100);

      const formData = new FormData();
      formData.append('file', file);
      
      await uploadExcelFile(formData);
      setUploadProgress(100);
      
      // Success animation and reload
      setTimeout(async () => {
        setIsUploading(false);
        setUploadProgress(0);
        await loadUploads();
        showToast('File uploaded successfully!', 'success');
        
        // Celebrate animation
        gsap.fromTo(statsRef.current,
          { scale: 1 },
          { 
            scale: 1.05, 
            duration: 0.3, 
            yoyo: true, 
            repeat: 1,
            ease: "power2.inOut"
          }
        );
      }, 800);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      showToast(error.message || 'Upload failed. Please try again.', 'error');
    }
  };

  // Enhanced data loading with error handling
  const loadUploads = async () => {
    try {
      setLoading(true);
      const data = await getUserUploads();
      setUploads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading uploads:', error);
      setUploads([]);
      showToast('Failed to load files. Please refresh the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  // File operations with enhanced feedback
  const handleRetryAnalysis = async (uploadId, fileName) => {
    try {
      await retryAnalysis(uploadId);
      showToast(`Retrying analysis for ${fileName}`, 'info');
      await loadUploads();
    } catch (error) {
      console.error('Error retrying analysis:', error);
      showToast('Failed to retry analysis. Please try again.', 'error');
    }
  };

  const handleDeleteUpload = async (uploadId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
    
    try {
      await deleteUpload(uploadId);
      showToast(`Successfully deleted ${fileName}`, 'success');
      await loadUploads();
      
      // Animate remaining items
      gsap.fromTo(filesRef.current,
        { x: -20, opacity: 0.8 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.05 }
      );
    } catch (error) {
      console.error('Error deleting upload:', error);
      showToast('Failed to delete file. Please try again.', 'error');
    }
  };

  // Enhanced status info with better colors
  const getStatusInfo = (upload) => {
    if (upload.isAnalyzed) {
      return {
        status: 'completed',
        icon: <FiCheck className="text-emerald-400" />,
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        label: 'Complete'
      };
    } else if (upload.analysisError) {
      return {
        status: 'failed',
        icon: <FiAlertTriangle className="text-red-400" />,
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        label: 'Failed'
      };
    } else {
      return {
        status: 'processing',
        icon: <FiClock className="text-amber-400 animate-spin" />,
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        label: 'Processing'
      };
    }
  };

  // Smart filtering with search
  const filteredUploads = uploads.filter(upload => {
    const fileName = upload.originalName || upload.filename || '';
    const matchesSearch = fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const statusInfo = getStatusInfo(upload);
    return matchesSearch && statusInfo.status === statusFilter;
  });

  // Dynamic stats calculation
  const stats = {
    total: uploads.length,
    completed: uploads.filter(u => u.isAnalyzed).length,
    processing: uploads.filter(u => !u.isAnalyzed && !u.analysisError).length,
    failed: uploads.filter(u => u.analysisError).length
  };

  // Enhanced logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      showToast('Successfully logged out', 'success');
      setTimeout(() => navigate('/'), 1000);
    }
  };

  // File size formatter
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Time ago formatter
  const timeAgo = (date) => {
    const now = new Date();
    const uploadDate = new Date(date);
    const diffInHours = Math.floor((now - uploadDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return uploadDate.toLocaleDateString();
  };

  return (
    <div 
      ref={dashboardRef}
      className="min-h-screen bg-black overflow-hidden relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-600/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Drag overlay with modern design */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center">
          <GlassCard className="p-12 text-center animate-in zoom-in-95 duration-300">
            <div className="relative">
              <FiUpload className="mx-auto mb-6 text-7xl text-blue-400 animate-bounce" />
              <div className="absolute inset-0 animate-ping">
                <FiUpload className="mx-auto mb-6 text-7xl text-blue-400/30" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Drop your Excel file</h3>
            <p className="text-gray-400">Release to upload and analyze</p>
          </GlassCard>
        </div>
      )}

      {/* Enhanced Modern Header */}
      <header className="relative z-10 h-20 bg-white/5 backdrop-blur-lg border-b border-white/10">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
        </div>
        
        <div className="relative h-full px-6 flex items-center justify-between">
          {/* Left - Enhanced Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-500 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300">
                <FiBarChart className="text-white text-xl relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
              </div>
            </div>
            <div className="group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:via-teal-400 group-hover:to-emerald-400 transition-all duration-500">
                Excel Analytics
              </h1>
              <p className="text-gray-400 text-sm font-medium">
                {user?.name ? (
                  <span className="flex items-center space-x-2">
                    <span>Welcome back, {user.name.split(' ')[0]}!</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  </span>
                ) : (
                  'Professional Dashboard'
                )}
              </p>
            </div>
          </div>
          
          {/* Center - Enhanced Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-4 py-2 rounded-xl bg-emerald-500/10 text-white font-medium text-sm shadow-lg border border-emerald-500/20 flex items-center space-x-2"
            >
              <FiGrid className="text-sm" />
              <span>Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/analytics')} 
              className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 text-sm font-medium flex items-center space-x-2 border border-transparent"
            >
              <FiActivity className="text-sm" />
              <span>Analytics</span>
            </button>
            <button 
              onClick={() => navigate('/reports')} 
              className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 text-sm font-medium flex items-center space-x-2 border border-transparent"
            >
              <FiFileText className="text-sm" />
              <span>Reports</span>
            </button>
            <button 
              onClick={() => navigate('/visualize')} 
              className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-200 text-sm font-medium flex items-center space-x-2 border border-transparent"
            >
              <FiPieChart className="text-sm" />
              <span>Visualize</span>
            </button>
          </nav>
          
          {/* Right - Enhanced Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden md:block relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Quick search..."
                className="pl-9 pr-4 py-2 w-48 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-200 text-sm backdrop-blur-xl"
              />
            </div>

            {/* Notifications with enhanced styling */}
            <div className="relative">
              <button className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 relative group">
                <FiBell className="text-lg group-hover:animate-pulse" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{notifications.length}</span>
                  </span>
                )}
              </button>
            </div>

            {/* Enhanced User menu */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 text-white transition-all duration-200 shadow-lg backdrop-blur-xl group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 group-hover:scale-105 transition-all duration-300">
                  <FiUser className="text-white text-sm" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">
                    {user?.name?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-400">Premium</p>
                </div>
                <FiChevronDown className={`text-sm transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Enhanced User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl animate-in slide-in-from-top-2 z-50 overflow-hidden">
                  {/* User info header */}
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <FiUser className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user?.name || 'User'}</p>
                        <p className="text-gray-400 text-xs">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu items */}
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm group">
                      <FiUser className="text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm group">
                      <FiSettings className="text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm group">
                      <FiActivity className="text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Activity</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm group">
                      <FiHelpCircle className="text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Help & Support</span>
                    </button>
                    <hr className="my-2 border-white/10" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 text-sm group"
                    >
                      <FiLogOut className="text-sm group-hover:scale-110 transition-transform duration-200" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with proper spacing and viewport optimization */}
      <main className="h-[calc(100vh-5rem)] px-8 py-4 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto grid grid-cols-12 gap-8">
          
          {/* Left Sidebar - Upload & Quick Stats (Optimized for single viewport) */}
          <div className="col-span-6 xl:col-span-6 space-y-4 overflow-hidden flex flex-col">
            
            {/* Enhanced Upload Zone - Compact for viewport fit */}
            <GlassCard className="relative overflow-hidden group flex-shrink-0" variant="primary">
              <div className="p-4">
                <div className="text-center mb-3">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center justify-center space-x-2">
                    <FiUpload className="text-emerald-400 text-sm" />
                    <span>Upload Excel File</span>
                  </h3>
                  <p className="text-gray-400 text-xs">Drag and drop or click to select</p>
                </div>
                
                <div className="border-2 border-dashed border-emerald-400/30 rounded-xl p-4 text-center hover:border-emerald-400/50 transition-all duration-300 group-hover:border-emerald-400/60 bg-gradient-to-br from-emerald-500/5 to-teal-600/5">
                  {isUploading ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <FiUpload className="mx-auto text-3xl text-emerald-400 animate-pulse" />
                        <div className="absolute inset-0 animate-ping">
                          <FiUpload className="mx-auto text-3xl text-emerald-400/30" />
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">Uploading...</p>
                        <p className="text-gray-400 text-xs mb-2">Processing your file</p>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 h-1.5 rounded-full transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${uploadProgress}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                          </div>
                        </div>
                        <p className="text-emerald-400 text-xs mt-1 font-medium">{Math.round(uploadProgress)}%</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <FiUpload className="mx-auto text-4xl text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-1">Drop Excel File Here</p>
                        <p className="text-gray-400 text-xs mb-2">or click below to browse</p>
                        <div className="flex justify-center space-x-1 mb-2">
                          <span className="inline-flex items-center px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                            .xlsx
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                            .xls
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 text-xs font-semibold group"
                      >
                        <FiPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
                        <span>Choose File</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">Max: 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Stats and Quick Actions Combined - Viewport optimized */}
            <div className="flex-1 min-h-0 space-y-4">
              {/* Enhanced Stats Grid - 2x2 layout for better viewport fit */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'total', label: 'Total Files', value: stats.total, icon: FiDatabase, color: 'emerald', variant: 'primary' },
                  { key: 'completed', label: 'Completed', value: stats.completed, icon: FiCheck, color: 'emerald', variant: 'success' },
                  { key: 'processing', label: 'Processing', value: stats.processing, icon: FiClock, color: 'amber', variant: 'warning' },
                  { key: 'failed', label: 'Failed', value: stats.failed, icon: FiAlertTriangle, color: 'red', variant: 'danger' }
                ].map((stat) => (
                  <GlassCard 
                    key={stat.key}
                    ref={addStatsRef}
                    className="p-3 hover:scale-[1.02] transition-all duration-300 group"
                    variant={stat.variant}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs font-medium mb-0.5">{stat.label}</p>
                        <p className={`text-xl font-bold text-${stat.color}-400 tabular-nums group-hover:scale-110 transition-transform duration-300`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-1.5 rounded-lg bg-${stat.color}-500/10 group-hover:bg-${stat.color}-500/20 transition-colors duration-300`}>
                        <stat.icon className={`text-base text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Quick Actions - Compact for viewport */}
              <GlassCard className="p-4 flex-1" variant="default">
                <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
                  <FiZap className="text-amber-400 text-sm" />
                  <span>Quick Actions</span>
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: FiActivity, label: 'Analytics', path: '/analytics', color: 'emerald', description: 'Data insights' },
                    { icon: FiFileText, label: 'Reports', path: '/reports', color: 'teal', description: 'Detailed reports' },
                    { icon: FiPieChart, label: 'Visualize', path: '/visualize', color: 'emerald', description: 'Interactive charts' }
                  ].map((action) => (
                    <button
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className="w-full flex items-center space-x-3 p-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-lg text-white transition-all duration-300 text-xs group hover:scale-[1.02]"
                    >
                      <div className={`p-1.5 rounded-lg bg-${action.color}-500/10 group-hover:bg-${action.color}-500/20 transition-colors duration-300`}>
                        <action.icon className={`text-sm text-${action.color}-400 group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-white group-hover:text-gray-100 text-xs">{action.label}</p>
                        <p className="text-xs text-gray-400 group-hover:text-gray-300">{action.description}</p>
                      </div>
                      <FiChevronDown className="text-gray-400 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Right Column - Files Management (Balanced width with proper spacing) */}
          <div className="col-span-6 xl:col-span-6 flex flex-col h-full">
            
            {/* Files Header - Ultra compact for viewport */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 space-y-2 lg:space-y-0 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Your Files
                </h2>
                <p className="text-gray-400 text-xs">
                  {filteredUploads.length} of {uploads.length} files
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              
              {/* Search and Filter - Ultra compact */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <FiSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-2 py-1.5 bg-white/[0.02] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.05] transition-all duration-200 text-xs w-32 backdrop-blur-xl"
                  />
                </div>
                
                <div className="relative">
                  <FiFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-7 pr-5 py-1.5 bg-white/[0.02] border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-400/50 focus:bg-white/[0.05] transition-all duration-200 text-xs backdrop-blur-xl appearance-none cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="completed">Done</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                  <FiChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                </div>
              </div>
            </div>

            {/* Files Container - Optimized for single viewport */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
              {loading ? (
                <GlassCard className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full"></div>
                    <p className="text-gray-400 text-xs">Loading files...</p>
                  </div>
                  <div className="mt-2 space-y-1">
                    {[...Array(3)].map((_, i) => (
                      <SkeletonLoader key={i} className="h-8" />
                    ))}
                  </div>
                </GlassCard>
              ) : filteredUploads.length === 0 ? (
                <GlassCard className="p-6 text-center flex-1 flex items-center justify-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-lg flex items-center justify-center">
                      <FiFileText className="text-2xl text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">
                        {uploads.length === 0 ? 'No files uploaded' : 'No matches found'}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {uploads.length === 0 
                          ? 'Upload your first Excel file to get started'
                          : 'Try adjusting your search or filter'
                        }
                      </p>
                    </div>
                    {uploads.length === 0 && (
                      <button
                        onClick={() => document.getElementById('file-upload').click()}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 text-xs"
                      >
                        <FiPlus className="text-xs" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </div>
                </GlassCard>
              ) : (
                <div className="space-y-1.5">
                  {filteredUploads.map((upload, index) => {
                    const statusInfo = getStatusInfo(upload);
                    const fileName = upload.originalName || upload.filename || 'Unknown file';
                    
                    return (
                      <SpotlightCard 
                        key={upload._id} 
                        ref={addFilesRef}
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-2.5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
                            {/* File Icon - Ultra compact */}
                            <div className="relative">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                                <FiFileText className="text-white text-sm" />
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-900 ${
                                statusInfo.status === 'completed' ? 'bg-emerald-500' :
                                statusInfo.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                              }`} />
                            </div>
                            
                            {/* File Info - Ultra compact */}
                            <div className="min-w-0 flex-1">
                              <h3 className="text-white font-semibold text-xs truncate group-hover:text-emerald-400 transition-colors duration-200">
                                {fileName}
                              </h3>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <p className="text-gray-400 text-xs">
                                  {timeAgo(upload.createdAt || upload.uploadedAt)}
                                </p>
                                {upload.fileSize && (
                                  <>
                                    <span className="text-gray-600 text-xs">•</span>
                                    <p className="text-gray-400 text-xs">
                                      {formatFileSize(upload.fileSize)}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Status and Actions - Ultra compact */}
                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            {/* Status Badge - Ultra compact */}
                            <span className={`px-1.5 py-0.5 rounded text-xs font-semibold border backdrop-blur-sm ${statusInfo.color}`}>
                              <span className="flex items-center space-x-0.5">
                                <span className="text-xs">{statusInfo.icon}</span>
                                <span className="hidden sm:inline text-xs">{statusInfo.label}</span>
                              </span>
                            </span>
                            
                            {/* Action Buttons - Ultra compact */}
                            <div className="flex items-center space-x-0.5">
                              {upload.isAnalyzed && (
                                <button
                                  onClick={() => navigate(`/visualize/${upload._id}`)}
                                  className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded transition-all duration-200 hover:scale-110 group/btn"
                                  title="View Analytics"
                                >
                                  <FiEye className="text-xs group-hover/btn:scale-110 transition-transform duration-200" />
                                </button>
                              )}
                              
                              {upload.analysisError && (
                                <button
                                  onClick={() => handleRetryAnalysis(upload._id, fileName)}
                                  className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded transition-all duration-200 hover:scale-110 group/btn"
                                  title="Retry Analysis"
                                >
                                  <FiRefreshCw className="text-xs group-hover/btn:scale-110 transition-transform duration-200" />
                                </button>
                              )}
                              
                              {/* More Options - Ultra compact */}
                              <div className="relative group/menu">
                                <button className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded transition-all duration-200 hover:scale-110">
                                  <FiMoreVertical className="text-xs" />
                                </button>
                                
                                {/* Dropdown Menu - Ultra compact */}
                                <div className="absolute right-0 top-full mt-1 w-28 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                                  <div className="p-1">
                                    <button className="w-full flex items-center space-x-1.5 px-2 py-1 text-gray-300 hover:text-white hover:bg-white/10 rounded text-xs">
                                      <FiDownload className="text-xs" />
                                      <span>Download</span>
                                    </button>
                                    <hr className="my-0.5 border-white/10" />
                                    <button 
                                      onClick={() => handleDeleteUpload(upload._id, fileName)}
                                      className="w-full flex items-center space-x-1.5 px-2 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded text-xs"
                                    >
                                      <FiTrash2 className="text-xs" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Click outside handler for user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
