import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">Excel Analytics Platform</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</a>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300">Sign Up</Link>
            </div>
            <div className="md:hidden flex items-center">
              <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Transform Your Excel Files into Interactive Insights
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
                Upload. Analyze. Visualize. All in one secure platform.
              </p>
              <div className="mt-10 flex justify-center gap-x-6">
                <Link to="/register" className="rounded-md bg-blue-600 px-5 py-3 text-lg font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Get Started
                </Link>
                <Link to="/login" className="rounded-md bg-white px-5 py-3 text-lg font-medium text-blue-600 border border-blue-200 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
              <p className="mt-4 text-xl text-gray-600">Everything you need to analyze Excel data effectively</p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-2xl">
                    📤
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Upload Excel Files</h3>
                  <p className="mt-3 text-gray-600">
                    Upload and process <code>.xls</code> or <code>.xlsx</code> files easily.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 text-2xl">
                    📊
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">Interactive Charts</h3>
                  <p className="mt-3 text-gray-600">
                    Visualize your data with 2D & 3D graphs.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 text-2xl">
                    🤖
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-gray-900">AI Insights</h3>
                  <p className="mt-3 text-gray-600">
                    Automatically generate summaries and trends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Excel Analytics Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
