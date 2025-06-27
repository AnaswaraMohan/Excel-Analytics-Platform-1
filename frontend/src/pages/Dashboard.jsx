import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/auth';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [metrics, setMetrics] = useState({ files: 0, sheets: 0, dataPoints: 0 });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(null);
  const navigate = useNavigate();

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

  // Dashboard cards (actions)
  const dashboardCards = [
    {
      title: 'Upload Files',
      description: 'Upload and manage your Excel files',
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      color: 'bg-malachite-500',
      iconColor: 'text-malachite-500',
      action: 'Upload',
      soon: false,
      onClick: () => handleUploadClick(),
    },
    {
      title: 'Analyze Data',
      description: 'Visualize and understand your data',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2z',
      color: 'bg-limegreen-500',
      iconColor: 'text-limegreen-500',
      action: 'Analyze',
      soon: true,
      onClick: null,
    },
    {
      title: 'Generate Reports',
      description: 'Create and share professional reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'bg-pigmentgreen-500',
      iconColor: 'text-pigmentgreen-500',
      action: 'Generate',
      soon: true,
      onClick: null,
    },
    {
      title: 'AI Insights',
      description: 'Get intelligent insights from your data',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'bg-blackolive-500',
      iconColor: 'text-blackolive-500',
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
    navigate('/login');
  };
  // Upload handler
  const handleUploadClick = () => {
    navigate('/upload');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-malachite-50 via-white to-limegreen-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pigmentgreen-600" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-malachite-50 via-white to-limegreen-100 flex flex-col">
      {/* Modern Glassy Navbar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-0">
        <div className="flex items-center justify-between w-full h-20 bg-blackolive-950/90 backdrop-blur-xl border border-blackolive-800 shadow-2xl rounded-full px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center min-w-[120px]">
              <span className="text-2xl font-bold bg-gradient-to-r from-malachite-400 to-pigmentgreen-400 bg-clip-text text-transparent select-none">Excelify</span>
            </div>
            <nav className="hidden md:flex gap-6" role="tablist" aria-label="Dashboard Tabs">
              {['Overview', 'Files', 'Analytics', 'Reports'].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(idx)}
                  onKeyDown={handleTabKeyDown}
                  className={`font-medium text-base transition-colors duration-200 outline-none ${activeTab === idx ? 'text-pigmentgreen-500 underline underline-offset-8' : 'text-blackolive-500 hover:text-pigmentgreen-500'}`}
                  aria-selected={activeTab === idx}
                  aria-controls={`dashboard-tabpanel-${idx}`}
                  tabIndex={0}
                  role="tab"
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="relative user-menu-container flex items-center min-w-[120px] justify-end">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center focus:outline-none group"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={showUserMenu}
            >
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-malachite-500 to-pigmentgreen-600 flex items-center justify-center border-2 border-malachite-400 shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <svg className={`ml-2 w-4 h-4 text-malachite-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showUserMenu && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-blackolive-900/95 rounded-xl shadow-2xl py-2 z-30 border border-blackolive-700 animate-fade-in">
                <div className="px-5 py-4 border-b border-blackolive-700 text-center">
                  <p className="text-lg font-semibold text-malachite-400">{user?.name}</p>
                  <p className="text-sm text-white/60 truncate">{user?.email}</p>
                </div>
                <button onClick={goToProfile} className="block w-full text-left px-5 py-3 text-sm text-white/80 hover:bg-blackolive-800">Your Profile</button>
                <button className="block w-full text-left px-5 py-3 text-sm text-white/80 hover:bg-blackolive-800">Settings</button>
                <div className="border-t border-blackolive-700"></div>
                <button onClick={handleSignOut} className="block w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-blackolive-800">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow pt-32 pb-12 px-4 max-w-7xl mx-auto w-full">
        {/* Welcome Section - only for Overview */}
        {activeTab === 0 && (
          <section className="mb-12">
            <div className="rounded-3xl bg-white/60 backdrop-blur-md shadow-xl p-10 flex flex-col md:flex-row items-center gap-8 border border-white/30">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-pigmentgreen-600 mb-4">Welcome, {user?.name || 'User'}!</h1>
                <p className="text-lg text-blackolive-500 mb-4">Transform your Excel data into powerful insights, visualizations, and reports—all in one place.</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-4 py-1 rounded-full bg-pigmentgreen-100 text-pigmentgreen-600 text-sm font-medium">Real-time Analysis</span>
                  <span className="px-4 py-1 rounded-full bg-malachite-100 text-malachite-600 text-sm font-medium">Smart Visualization</span>
                  <span className="px-4 py-1 rounded-full bg-limegreen-100 text-limegreen-600 text-sm font-medium">AI Insights</span>
                  <span className="px-4 py-1 rounded-full bg-blackolive-100 text-blackolive-600 text-sm font-medium">Automated Reports</span>
                </div>
              </div>
              <div className="flex-1 flex justify-center md:justify-end">
                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-pigmentgreen-500/80 to-malachite-500/80 flex items-center justify-center shadow-2xl">
                  <svg className="w-32 h-32 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <rect x="8" y="8" width="32" height="32" rx="8" fill="currentColor" className="text-pigmentgreen-500" />
                    <path d="M16 24h16M16 32h8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="16" y="16" width="16" height="8" rx="2" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* Tab Content */}
        <section id={`dashboard-tabpanel-${activeTab}`} role="tabpanel" aria-labelledby={`dashboard-tab-${activeTab}`}> 
          {activeTab === 0 && (
            <>
              {/* Stats Grid */}
              <div className="w-full mt-4 mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">Your Analytics Overview</h2>
                {metricsLoading ? (
                  <div className="flex items-center gap-2 text-blackolive-500"><span className="animate-spin h-5 w-5 border-b-2 border-pigmentgreen-600 rounded-full"></span> Loading metrics...</div>
                ) : metricsError ? (
                  <div className="text-red-500">{metricsError}</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition border border-gray-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-12 w-12 text-malachite-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                        </div>
                        <div className="ml-4 text-left">
                          <h3 className="text-lg font-medium text-gray-500">Files</h3>
                          <div className="mt-1 text-3xl font-bold text-gray-900">{metrics.files}</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition border border-gray-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-12 w-12 text-limegreen-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="ml-4 text-left">
                          <h3 className="text-lg font-medium text-gray-500">Sheets</h3>
                          <div className="mt-1 text-3xl font-bold text-gray-900">{metrics.sheets}</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition border border-gray-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-12 w-12 text-pigmentgreen-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        </div>
                        <div className="ml-4 text-left">
                          <h3 className="text-lg font-medium text-gray-500">Data Points</h3>
                          <div className="mt-1 text-3xl font-bold text-gray-900">{metrics.dataPoints}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Feature Cards */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-left text-gray-800 mb-3">Powerful Features at Your Fingertips</h2>
                <p className="text-lg text-gray-600 text-left mb-8">Access these tools to transform your Excel data into valuable insights</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {dashboardCards.map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-2xl shadow-lg p-8 bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.03] border border-gray-100 flex flex-col ${card.soon ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      tabIndex={card.soon ? -1 : 0}
                      aria-disabled={card.soon}
                      aria-label={card.title}
                      onClick={card.soon ? undefined : card.onClick}
                    >
                      <div className="flex items-start">
                        <div className={`rounded-full p-4 ${card.color}`}>
                          <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} /></svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                          <p className="text-base text-gray-500 mb-6">{card.description}</p>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <button
                          disabled={card.soon}
                          onClick={card.soon ? undefined : card.onClick}
                          className={`w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all duration-300 ${card.soon ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-200' : card.color === 'bg-malachite-500' ? 'bg-malachite-600 text-white hover:bg-malachite-700' : card.color === 'bg-limegreen-500' ? 'bg-limegreen-600 text-white hover:bg-limegreen-700' : card.color === 'bg-pigmentgreen-500' ? 'bg-pigmentgreen-600 text-white hover:bg-pigmentgreen-700' : 'bg-blackolive-600 text-white hover:bg-blackolive-700'}`}
                          aria-label={card.action}
                        >
                          {card.action}
                          {card.soon && <span className="ml-2 text-xs">(Coming Soon)</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Files Tab */}
          {activeTab === 1 && (
            <div className="min-h-[calc(60vh)] py-10">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Excel Files</h3>
                        <p className="mt-1 text-sm text-gray-500">Upload and manage your Excel spreadsheets</p>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        <button type="button" disabled className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:hover:bg-gray-400 disabled:cursor-not-allowed">
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          Upload New File (Coming Soon)
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Empty state */}
                  <div className="bg-white px-4 py-24 sm:px-6 text-center border-t border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No files</h3>
                    <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">Get started by uploading an Excel file to begin analyzing your data.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Analytics Tab */}
          {activeTab === 2 && (
            <div className="min-h-[calc(60vh)] py-10">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Data Analytics</h3>
                      <p className="mt-1 text-sm text-gray-500">Visualize and analyze your Excel data</p>
                    </div>
                  </div>
                  {/* Empty state */}
                  <div className="bg-white px-4 py-24 sm:px-6 text-center border-t border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No analytics available</h3>
                    <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">Upload an Excel file to begin analyzing your data and unlocking powerful visualizations.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Reports Tab */}
          {activeTab === 3 && (
            <div className="min-h-[calc(60vh)] py-10">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Reports</h3>
                      <p className="mt-1 text-sm text-gray-500">Generate and share reports from your data</p>
                    </div>
                  </div>
                  {/* Empty state */}
                  <div className="bg-white px-4 py-24 sm:px-6 text-center border-t border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No reports yet</h3>
                    <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">Start by analyzing your data to generate professional and shareable reports.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

