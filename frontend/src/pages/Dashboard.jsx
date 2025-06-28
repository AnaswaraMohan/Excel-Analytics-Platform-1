import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import { gsap } from 'gsap';

// Spotlight effect hook (from LandingPage)
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

// SpotlightCard wrapper (from LandingPage)
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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [metrics, setMetrics] = useState({ files: 0, sheets: 0, dataPoints: 0 });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(null);
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef([]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await authService.getProfile();
        setUser(userProfile);
      } catch (error) {
        toast.error('Failed to fetch user profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch dashboard metrics from backend (mocked for now)
  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError(null);
      try {
        // TODO: Replace with real API call
        // const response = await fetch('/api/dashboard/metrics');
        // const data = await response.json();
        // setMetrics(data);
        setTimeout(() => {
          setMetrics({ files: 12, sheets: 34, dataPoints: 5678 });
          setMetricsLoading(false);
        }, 800);
      } catch (err) {
        setMetricsError('Failed to load metrics');
        setMetricsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!isLoading && dashboardRef.current) {
      // Enable GSAP performance optimizations
      gsap.config({
        force3D: true,
        nullTargetWarn: false
      });

      // Dashboard entrance animation
      gsap.fromTo(dashboardRef.current, 
        { 
          opacity: 0, 
          y: 30 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        }
      );

      // Stats cards animation
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children, 
          {
            y: 50,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.3
          }
        );
      }

      // Feature cards animation
      cardsRef.current.forEach((ref, index) => {
        if (ref) {
          gsap.fromTo(ref, 
            {
              y: 60,
              opacity: 0,
              scale: 0.9
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.5 + (index * 0.1)
            }
          );
        }
      });
    }
  }, [isLoading]);

  // Dashboard cards (actions)
  const dashboardCards = [
    {
      title: 'Upload Files',
      description: 'Upload and manage your Excel files with our secure, lightning-fast processing engine.',
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      color: 'from-pigmentgreen-500 to-malachite-500',
      action: 'Upload',
      soon: false,
      onClick: () => handleUploadClick(),
    },
    {
      title: 'Analyze Data',
      description: 'Transform your raw data into stunning, interactive visualizations and dashboards.',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2z',
      color: 'from-malachite-500 to-pigmentgreen-500',
      action: 'Analyze',
      soon: true,
      onClick: null,
    },
    {
      title: 'Generate Reports',
      description: 'Create professional, shareable reports with automated insights and recommendations.',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'from-pigmentgreen-500 to-malachite-500',
      action: 'Generate',
      soon: true,
      onClick: null,
    },
    {
      title: 'AI Insights',
      description: 'Get intelligent insights and recommendations powered by advanced AI algorithms.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'from-malachite-500 to-pigmentgreen-500',
      action: 'Explore',
      soon: true,
      onClick: null,
    },
  ];

  // Accessibility: keyboard navigation for tabs
  const handleTabKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      setActiveTab((prev) => (prev + 1) % 4);
    } else if (e.key === 'ArrowLeft') {
      setActiveTab((prev) => (prev - 1 + 4) % 4);
    }
  };

  // Handle click away from user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Navigate to profile page
  const goToProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  // Sign out handler
  const handleSignOut = () => {
    authService.logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  // Upload handler
  const handleUploadClick = () => {
    navigate('/upload');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pigmentgreen-500" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="min-h-screen bg-black flex flex-col">
      {/* Modern Glassy Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 h-20">
        <div className="flex justify-between items-center gap-4 h-full">
          {/* Left Capsule - Brand & Navigation */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl h-16 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center h-full px-6 space-x-6">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-white">Excelify</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                {['Overview', 'Files', 'Analytics', 'Reports'].map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    onKeyDown={handleTabKeyDown}
                    className={`font-medium text-base transition-all duration-300 outline-none relative ${activeTab === idx ? 'text-pigmentgreen-400' : 'text-white/70 hover:text-white'}`}
                    aria-selected={activeTab === idx}
                    aria-controls={`dashboard-tabpanel-${idx}`}
                    tabIndex={0}
                    role="tab"
                  >
                    {tab}
                    {activeTab === idx && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Capsule - User Menu */}
          <div className="relative user-menu-container">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl h-16 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center h-full px-6 space-x-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500 focus:ring-offset-2 focus:ring-offset-black rounded-full p-1 group transition-all duration-200"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-105 transition-all duration-200">
                    <span className="text-white font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <svg 
                    className={`ml-3 w-4 h-4 text-white/70 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl py-3 z-50 border border-white/20 transform transition-all duration-200 ease-out animate-in slide-in-from-top-2">
                <div className="px-6 py-4 border-b border-white/10 text-center">
                  <p className="text-lg font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-white/60 truncate mt-1">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={goToProfile} 
                    className="flex items-center w-full px-6 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Profile
                  </button>
                  <button className="flex items-center w-full px-6 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors duration-150">
                    <svg className="w-4 h-4 mr-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <button 
                    onClick={handleSignOut} 
                    className="flex items-center w-full px-6 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-12 px-4 max-w-7xl mx-auto w-full">
        {/* Welcome Section - only for Overview */}
        {activeTab === 0 && (
          <section className="mb-16">
            <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-12 shadow-xl border border-white/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Welcome back, <span className="bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent">{user?.name || 'User'}</span>!
                  </h1>
                  <p className="text-lg lg:text-xl text-white/80 mb-6 leading-relaxed">
                    Transform your Excel data into powerful insights, visualizations, and reports—all in one place.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white/90">Real-time Analysis</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white/90">Smart Visualization</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white/90">AI Insights</span>
                    <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white/90">Automated Reports</span>
                  </div>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-pigmentgreen-500/20 to-malachite-500/20 flex items-center justify-center shadow-2xl border border-white/10">
                    <svg className="w-32 h-32 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                      <rect x="8" y="8" width="32" height="32" rx="8" fill="currentColor" className="text-pigmentgreen-500/30" />
                      <path d="M16 24h16M16 32h8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="16" y="16" width="16" height="8" rx="2" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </section>
        )}

        {/* Tab Content */}
        <section id={`dashboard-tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`dashboard-tab-${activeTab}`}> 
          {activeTab === 0 && (
            <>
              {/* Stats Grid */}
              <div ref={statsRef} className="w-full mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-left">Your Analytics Overview</h2>
                {metricsLoading ? (
                  <div className="flex items-center gap-3 text-white/60">
                    <span className="animate-spin h-6 w-6 border-b-2 border-pigmentgreen-500 rounded-full"></span> 
                    Loading metrics...
                  </div>
                ) : metricsError ? (
                  <div className="text-red-400">{metricsError}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-white/70">Files</h3>
                          <div className="mt-1 text-3xl font-bold text-white">{metrics.files}</div>
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-malachite-500 to-pigmentgreen-500 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-white/70">Sheets</h3>
                          <div className="mt-1 text-3xl font-bold text-white">{metrics.sheets}</div>
                        </div>
                      </div>
                    </SpotlightCard>
                    <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-xl flex items-center justify-center">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-white/70">Data Points</h3>
                          <div className="mt-1 text-3xl font-bold text-white">{metrics.dataPoints}</div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                )}
              </div>

              {/* Feature Cards */}
              <div className="mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-left">Powerful Features at Your Fingertips</h2>
                <p className="text-lg text-white/80 mb-12 text-left leading-relaxed">Access these tools to transform your Excel data into valuable insights</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {dashboardCards.map((card, index) => (
                    <SpotlightCard
                      key={card.title}
                      ref={(el) => (cardsRef.current[index] = el)}
                      className={`bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${card.soon ? 'opacity-60' : 'cursor-pointer'}`}
                      onClick={card.soon ? undefined : card.onClick}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start mb-6">
                          <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                          <p className="text-white/70 mb-6 leading-relaxed">{card.description}</p>
                        </div>
                        <div className="mt-auto">
                          <button
                            disabled={card.soon}
                            onClick={card.soon ? undefined : card.onClick}
                            className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold transition-all duration-300 ${
                              card.soon 
                                ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                                : `bg-gradient-to-r ${card.color} text-white hover:shadow-xl hover:scale-[1.02]`
                            }`}
                          >
                            {card.action}
                            {card.soon && <span className="ml-2 text-xs">(Coming Soon)</span>}
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Files Tab */}
          {activeTab === 1 && (
            <div className="min-h-[60vh] py-10">
              <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No files uploaded yet</h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                    Get started by uploading an Excel file to begin analyzing your data and unlocking powerful insights.
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Upload Your First File
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </button>
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 2 && (
            <div className="min-h-[60vh] py-10">
              <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-malachite-500 to-pigmentgreen-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No analytics available</h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                    Upload an Excel file to begin analyzing your data and unlocking powerful visualizations.
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-malachite-500 to-pigmentgreen-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Start Analyzing
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 3 && (
            <div className="min-h-[60vh] py-10">
              <SpotlightCard className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No reports yet</h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                    Start by analyzing your data to generate professional and shareable reports.
                  </p>
                  <button
                    onClick={handleUploadClick}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    Generate Reports
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              </SpotlightCard>
            </div>
          )}
        </section>
      </main>
      <Footer variant="dark" />
    </div>
  );
};

export default Dashboard;

