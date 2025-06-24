import { Link } from 'react-router-dom';
import uploadExcelImage from '../assets/uploadExcel.png';
import interactiveChartsImage from '../assets/InteractiveCharts.png';
import insightsImage from '../assets/Insights.jpg';
import allStackImage from '../assets/AllStack.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">      {/* Floating Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 h-20">
        <div className="flex justify-between items-center gap-4 h-full">
          {/* Left Capsule - Brand & Navigation */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/20 rounded-full shadow-lg h-16">
            <div className="flex items-center h-full px-6 space-x-6">              <div className="flex items-center">
                <span className="text-xl font-semibold text-jet-500">Excelify</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-jet-500 font-medium hover:text-pigmentgreen-500 transition-colors duration-200">Home</Link>
                <a href="#features" className="text-jet-500 font-medium hover:text-pigmentgreen-500 transition-colors duration-200">Features</a>
              </div>
            </div>
          </div>
          
          {/* Right Capsule - Authentication */}
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/20 rounded-full shadow-lg h-16">
            <div className="flex items-center h-full px-6 space-x-4">              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-jet-500 font-medium hover:text-pigmentgreen-500 transition-colors duration-200">Login</Link>
                <Link to="/register" className="bg-jet-500 hover:bg-pigmentgreen-500 text-white px-4 py-2 rounded-full transition duration-300 font-semibold">Sign Up</Link>
              </div>
              <div className="md:hidden flex items-center">
                <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-full p-1">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>      <main className="flex-grow">        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-32 pb-16 bg-gradient-hero">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              {/* Text Content */}              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left order-2 lg:order-1">
                <div className="max-w-4xl">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-jet-500">
                    Turn Excel files into Insights
                  </h1>
                </div>
                <p className="text-lg text-blackolive-500 mt-4 max-w-xl">
                  Upload. Analyze. Visualize.
                </p>                <div className="mt-6 flex gap-4 flex-col sm:flex-row justify-center lg:justify-start">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold text-white shadow-sm transition duration-200 bg-jet-500 hover:bg-pigmentgreen-500"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-medium shadow-sm transition duration-200 text-jet-500 border border-jet-300 hover:bg-jet-50"
                  >
                    Login
                  </Link>
                </div>
              </div>
              
              {/* AllStack Image */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                <img 
                  src={allStackImage} 
                  alt="Excel Analytics Platform Stack" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 space-y-24">            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-jet-500">Powerful Features</h2>
              <p className="mt-4 text-xl lg:text-2xl text-blackolive-500">Everything you need to analyze Excel data effectively</p>
            </div>{/* Feature 1 - Image Left, Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={uploadExcelImage} 
                  alt="Upload Excel Files" 
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                />
              </div>              <div className="text-center md:text-left">
                <h3 className="text-4xl lg:text-3xl font-bold text-jet-500">Upload Excel Files</h3>
                <p className="text-xl lg:text-xl text-blackolive-500 mt-2">
                  Seamlessly upload and process your Excel files with our secure, fast processing engine. Support for both .xls and .xlsx formats.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center mt-6 text-white px-6 py-3 rounded-md font-semibold transition duration-200 bg-jet-500 hover:bg-pigmentgreen-500"
                >
                  Explore Feature
                </Link>
              </div>
            </div>            {/* Feature 2 - Text Left, Image Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">              <div className="text-center md:text-left order-2 md:order-1">
                <h3 className="text-4xl lg:text-3xl font-bold text-jet-500">Interactive Charts</h3>
                <p className="text-xl lg:text-xl text-blackolive-500 mt-2">
                  Transform your data into stunning visualizations with our advanced charting tools. Create 2D and 3D graphs with real-time interactivity.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center mt-6 text-white px-6 py-3 rounded-md font-semibold transition duration-200 bg-jet-500 hover:bg-pigmentgreen-500"
                >
                  Explore Feature
                </Link>
              </div><div className="flex justify-center md:justify-end order-1 md:order-2">
                <img 
                  src={interactiveChartsImage} 
                  alt="Interactive Charts" 
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>            {/* Feature 3 - Image Left, Text Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={insightsImage} 
                  alt="AI Insights" 
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                />
              </div>              <div className="text-center md:text-left">
                <h3 className="text-4xl lg:text-3xl font-bold text-jet-500">AI Insights</h3>
                <p className="text-xl lg:text-xl text-blackolive-500 mt-2">
                  Leverage artificial intelligence to automatically generate insights, detect patterns, and provide intelligent recommendations from your data.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center mt-6 text-white px-6 py-3 rounded-md font-semibold transition duration-200 bg-jet-500 hover:bg-pigmentgreen-500"
                >
                  Explore Feature
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>      <footer className="bg-jet-50 border-t border-jet-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-jet-500 text-sm">
            &copy; {new Date().getFullYear()} Excel Analytics Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
