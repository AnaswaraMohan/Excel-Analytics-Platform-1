import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

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
  // Cards for the dashboard section
  const dashboardCards = [    {
      title: 'Upload Files',
      description: 'Upload and manage your Excel files',
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      color: 'bg-malachite-500',
      iconColor: 'text-malachite-500',
      action: 'Upload',
      soon: false,
      onClick: () => handleUploadClick()
    },
    {
      title: 'Analyze Data',
      description: 'Visualize and understand your data',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      color: 'bg-limegreen-500',
      iconColor: 'text-limegreen-500',
      action: 'Analyze',
      soon: true
    },
    {
      title: 'Generate Reports',
      description: 'Create and share professional reports',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'bg-pigmentgreen-500',
      iconColor: 'text-pigmentgreen-500',
      action: 'Generate',
      soon: true
    },
    {
      title: 'AI Insights',
      description: 'Get intelligent insights from your data',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'bg-blackolive-500',
      iconColor: 'text-blackolive-500',
      action: 'Explore',
      soon: true
    }
  ];
  // Key metrics for dashboard
  const metrics = [
    { label: 'Files', value: '0', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-malachite-600' },
    { label: 'Sheets', value: '0', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-limegreen-600' },
    { label: 'Data Points', value: '0', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', color: 'text-pigmentgreen-600' },
  ];

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
      <div className="min-h-screen bg-malachite-50">
        <div className="bg-white shadow sticky top-0 z-10 flex justify-between items-center px-6 h-16">
          <h1 className="text-xl font-semibold text-pigmentgreen-600">Excel Analytics Platform</h1>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-malachite-600"></div>
        </div>
      </div>
    );
  }
  return (    <div className="min-h-screen bg-malachite-50">      {/* Top Navbar with Navigation */}      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-pigmentgreen-600 mr-10">Excel Analytics Platform</h1>
              
              {/* Navigation Bar - now inline with logo - Dashboard removed */}
              <nav className="flex space-x-8">
                <button 
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 0 
                    ? 'border-malachite-600 text-malachite-600' 
                    : 'border-transparent text-blackolive-500 hover:text-pigmentgreen-600 hover:border-malachite-300'}`}
                  onClick={() => setActiveTab(0)}
                >
                  Overview
                </button>
                <Link 
                  to="/features"
                  className="py-4 px-2 border-b-2 border-transparent text-blackolive-500 hover:text-pigmentgreen-600 hover:border-malachite-300 font-medium text-sm"
                >
                  Features
                </Link>
                <button 
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 1 
                    ? 'border-malachite-600 text-malachite-600' 
                    : 'border-transparent text-blackolive-500 hover:text-pigmentgreen-600 hover:border-malachite-300'}`}
                  onClick={() => setActiveTab(1)}
                >
                  Files
                </button>
                <button 
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 2 
                    ? 'border-malachite-600 text-malachite-600' 
                    : 'border-transparent text-blackolive-500 hover:text-pigmentgreen-600 hover:border-malachite-300'}`}
                  onClick={() => setActiveTab(2)}
                >
                  Analytics
                </button>
                <button 
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${activeTab === 3 
                    ? 'border-malachite-600 text-malachite-600' 
                    : 'border-transparent text-blackolive-500 hover:text-pigmentgreen-600 hover:border-malachite-300'}`}
                  onClick={() => setActiveTab(3)}
                >
                  Reports
                </button>
              </nav>
            </div>
            
            {/* User avatar dropdown - restored without showing the name */}
            <div className="relative user-menu-container">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center focus:outline-none"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <div className="h-9 w-9 rounded-full bg-malachite-100 flex items-center justify-center">
                  <span className="text-pigmentgreen-600 font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </button>
              
              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-30 border border-malachite-200">
                  <div className="px-4 py-3 border-b border-malachite-100 text-center">
                    <p className="text-lg font-medium text-jet-500">{user?.name}</p>
                    <p className="text-sm text-blackolive-500 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={goToProfile} 
                    className="block w-full text-left px-4 py-2.5 text-sm text-blackolive-500 hover:bg-malachite-50"
                  >
                    Your Profile
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2.5 text-sm text-blackolive-500 hover:bg-malachite-50"
                  >
                    Settings
                  </button>
                  <div className="border-t border-malachite-100"></div>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2.5 text-sm text-blackolive-500 hover:bg-malachite-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
        {/* Main content area - removed max-width and padding constraints */}
      <main className="w-full">        {/* Tab Content */}        {activeTab === 0 && (
          <div>            {/* Section 1: Welcome + Stats - Full screen height section with top-bottom layout */}
            <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white to-blue-50 py-16">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex flex-col gap-12">
                  {/* Welcome Message - Left aligned */}
                  <div className="w-full">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-left">
                      Welcome to Excel Analytics Platform
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed text-left max-w-3xl">
                      Transform your Excel data into powerful insights with our analytics tools.
                    </p>
                    <div className="bg-blue-100 rounded-lg p-6 flex items-start border-l-4 border-blue-500 shadow-md max-w-3xl">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-4 text-md text-blue-800 font-medium text-left">
                        Your first step is to upload an Excel file to start analyzing your data.
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats Grid - Now below the welcome message with improved spacing */}
                  <div className="w-full mt-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">Your Analytics Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {metrics.map((metric, index) => (
                        <div 
                          key={index} 
                          className="rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition border border-gray-100"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg 
                                className={`h-12 w-12 ${metric.color}`} 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                              </svg>
                            </div>
                            <div className="ml-4 text-left">
                              <h3 className="text-lg font-medium text-gray-500">
                                {metric.label}
                              </h3>
                              <div className="mt-1 text-3xl font-bold text-gray-900">
                                {metric.value}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
              {/* Section 2: Feature Cards - Full screen height section */}
            <section className="min-h-screen py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-left text-gray-800 mb-3">Powerful Features at Your Fingertips</h2>
                  <p className="text-lg text-gray-600 text-left">Access these tools to transform your Excel data into valuable insights</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {dashboardCards.map((card) => (
                    <div 
                      key={card.title} 
                      className="rounded-2xl shadow-lg p-8 bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer border border-gray-100 flex flex-col"
                    >
                      <div className="flex items-start">
                        <div className={`rounded-full p-4 ${card.color}`}>
                          <svg 
                            className="h-8 w-8 text-white" 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
                          <p className="text-base text-gray-500 mb-6">{card.description}</p>
                        </div>
                      </div>
                      <div className="mt-auto">                        <button
                          disabled={card.soon}
                          onClick={card.onClick}
                          className={`
                            w-full inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium
                            transition-all duration-300
                            ${card.soon 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-200' 
                              : card.color === 'bg-blue-500' 
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : card.color === 'bg-green-500'
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : card.color === 'bg-purple-500'
                                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-orange-600 text-white hover:bg-orange-700'
                            }
                          `}
                        >
                          {card.action}
                          {card.soon && <span className="ml-2 text-xs">(Coming Soon)</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer Section */}
            <footer className="bg-white border-t border-gray-200 py-12">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-lg font-bold text-blue-600">Excel Analytics Platform</h2>
                    <p className="text-sm text-gray-500 mt-2">Transform your data into actionable insights</p>
                  </div>
                  
                  <div className="flex space-x-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Resources</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Documentation</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Tutorials</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">API</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Connect</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Contact</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Support</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Feedback</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-500">© 2025 Excel Analytics Platform. All rights reserved.</p>
                  <div className="mt-4 md:mt-0 flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-blue-600">
                      <span className="sr-only">Privacy Policy</span>
                      Privacy Policy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600">
                      <span className="sr-only">Terms of Service</span>
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}        {activeTab === 1 && (
          <div>
            <div className="min-h-[calc(100vh-4rem-6rem)] py-10">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Excel Files
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Upload and manage your Excel spreadsheets
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-4">
                        <button
                          type="button"
                          disabled
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Upload New File (Coming Soon)
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty state */}
                  <div className="bg-white px-4 py-24 sm:px-6 text-center border-t border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No files</h3>
                    <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">
                      Get started by uploading an Excel file to begin analyzing your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Section */}
            <footer className="bg-white border-t border-gray-200 py-12">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-lg font-bold text-blue-600">Excel Analytics Platform</h2>
                    <p className="text-sm text-gray-500 mt-2">Transform your data into actionable insights</p>
                  </div>
                  
                  <div className="flex space-x-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Resources</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Documentation</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Tutorials</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Connect</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Support</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Feedback</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-500">© 2025 Excel Analytics Platform. All rights reserved.</p>
                  <div className="mt-4 md:mt-0 flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-blue-600">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-blue-600">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}        {activeTab === 2 && (
          <div>
            <div className="min-h-[calc(100vh-4rem-6rem)] py-10">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Data Analytics
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Visualize and analyze your Excel data
                      </p>
                    </div>
                  </div>
                  
                  {/* Empty state */}
                  <div className="bg-white px-4 py-24 sm:px-6 text-center border-t border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No analytics available</h3>
                    <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">
                      Upload an Excel file to begin analyzing your data and unlock powerful visualizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Section */}
            <footer className="bg-white border-t border-gray-200 py-12">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-lg font-bold text-blue-600">Excel Analytics Platform</h2>
                    <p className="text-sm text-gray-500 mt-2">Transform your data into actionable insights</p>
                  </div>
                  
                  <div className="flex space-x-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Resources</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Documentation</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Tutorials</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Connect</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Support</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Feedback</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-500">© 2025 Excel Analytics Platform. All rights reserved.</p>
                  <div className="mt-4 md:mt-0 flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-blue-600">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-blue-600">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <div className="min-h-[calc(100vh-4rem-6rem)] py-10">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Reports
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Generate and share reports from your data
                      </p>
                    </div>
                  </div>
                  
                  {/* Empty state */}
                  <div className="bg-white px-4 py-24 sm:px-6 text-center border-t border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No reports yet</h3>
                    <p className="mt-2 text-md text-gray-500 max-w-md mx-auto">
                      Start by analyzing your data to generate professional and shareable reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Section */}
            <footer className="bg-white border-t border-gray-200 py-12">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <h2 className="text-lg font-bold text-blue-600">Excel Analytics Platform</h2>
                    <p className="text-sm text-gray-500 mt-2">Transform your data into actionable insights</p>
                  </div>
                  
                  <div className="flex space-x-8">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Resources</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Documentation</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Tutorials</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Connect</h3>
                      <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Support</a></li>
                        <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600">Feedback</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-500">© 2025 Excel Analytics Platform. All rights reserved.</p>
                  <div className="mt-4 md:mt-0 flex space-x-6">
                    <a href="#" className="text-gray-400 hover:text-blue-600">Privacy Policy</a>
                    <a href="#" className="text-gray-400 hover:text-blue-600">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
