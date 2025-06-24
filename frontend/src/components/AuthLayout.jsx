import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (    <div className="min-h-screen bg-gradient-to-br from-malachite-50 via-white to-limegreen-100">
      <div className="min-h-screen flex">
        {/* Desktop Layout - Grid 2 columns */}
        <div className="hidden lg:grid lg:grid-cols-2 w-full">
          {/* Left Panel - Welcome Section with Animation */}
          <div className="flex items-center justify-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-malachite-100/50 to-limegreen-100/50"></div>
            <div className="relative z-10 text-center animate-fade-in">
              <div className="mx-auto h-24 w-24 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-jet-500 mb-6 bg-gradient-to-r from-pigmentgreen-600 to-malachite-600 bg-clip-text text-transparent">
                Welcome to Exelify
              </h1>
              <p className="text-xl text-blackolive-500 max-w-md mx-auto leading-relaxed">
                Transform your data into insights with our powerful analytics platform
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <div className="h-2 w-2 bg-malachite-400 rounded-full animate-pulse"></div>
                <div className="h-2 w-2 bg-limegreen-400 rounded-full animate-pulse delay-100"></div>
                <div className="h-2 w-2 bg-pigmentgreen-400 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form Section */}
          <div className="flex items-center justify-center p-12">
            <div className="w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-slide-up">                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-pigmentgreen-600 to-malachite-600 bg-clip-text text-transparent mb-2">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-blackolive-500">
                      {subtitle}
                    </p>
                  )}
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full py-12 px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-jet-500 mb-2">Welcome to Exelify</h1>
              <p className="text-blackolive-500">Transform your data into insights</p>
            </div>

            {/* Mobile Form Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-slide-up">              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pigmentgreen-600 to-malachite-600 bg-clip-text text-transparent mb-2">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-blackolive-500 text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
              {children}
            </div>

            {/* Mobile Footer */}
            <div className="text-center mt-8 animate-fade-in">
              <p className="text-sm text-blackolive-400">
                © 2025 Excel Analytics Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
