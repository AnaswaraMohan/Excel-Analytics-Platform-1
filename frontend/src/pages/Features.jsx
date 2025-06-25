import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import uploadExcelImage from '../assets/uploadExcel.png';
import interactiveChartsImage from '../assets/InteractiveCharts.png';
import insightsImage from '../assets/Insights.jpg';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const featuresRef = useRef([]);
  const heroRef = useRef(null);
  const statsRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    // GSAP performance optimizations
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current, 
        { 
          opacity: 0, 
          y: 50 
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out"
        }
      );
    }

    // Feature cards animation
    featuresRef.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref,
          {
            opacity: 0,
            y: 80,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              fastScrollEnd: true
            },
            delay: index * 0.15
          }
        );
      }
    });

    // Stats counter animation
    statsRef.current.forEach((ref, index) => {
      if (ref) {
        const countElement = ref.querySelector('.count-number');
        const targetValue = parseInt(countElement.textContent);
        
        gsap.fromTo(ref,
          { 
            opacity: 0, 
            y: 30 
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 90%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );

        // Counter animation
        gsap.fromTo(countElement,
          { textContent: 0 },
          {
            textContent: targetValue,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: ref,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            delay: 0.5
          }
        );
      }
    });

    // CTA section animation
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        {
          opacity: 0,
          y: 40
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addFeatureRef = (el) => {
    if (el && !featuresRef.current.includes(el)) {
      featuresRef.current.push(el);
    }
  };

  const addStatRef = (el) => {
    if (el && !statsRef.current.includes(el)) {
      statsRef.current.push(el);
    }
  };

  const features = [
    {
      id: 1,
      title: "Excel File Upload & Processing",
      description: "Seamlessly upload and process your Excel files with our secure, lightning-fast processing engine. Support for both .xls and .xlsx formats with advanced parsing capabilities.",
      image: uploadExcelImage,
      capabilities: [
        "Drag & drop interface",
        "Batch file processing",
        "Real-time validation",
        "Secure cloud storage"
      ],
      bgGradient: "from-malachite-50 to-limegreen-50"
    },
    {
      id: 2,
      title: "Interactive Data Visualization",
      description: "Transform your raw data into stunning, interactive visualizations. Create professional charts, graphs, and dashboards that tell your data's story.",
      image: interactiveChartsImage,
      capabilities: [
        "Multiple chart types",
        "Real-time updates",
        "Export capabilities",
        "Mobile responsive"
      ],
      bgGradient: "from-pigmentgreen-50 to-malachite-50"
    },
    {
      id: 3,
      title: "AI-Powered Insights",
      description: "Leverage artificial intelligence to automatically detect patterns, generate insights, and provide intelligent recommendations from your data.",
      image: insightsImage,
      capabilities: [
        "Pattern recognition",
        "Automated insights",
        "Predictive analytics",
        "Smart recommendations"
      ],
      bgGradient: "from-blackolive-50 to-jet-50"
    }
  ];

  const stats = [
    { number: "500", label: "Files Processed", suffix: "K+" },
    { number: "98", label: "Accuracy Rate", suffix: "%" },
    { number: "24", label: "Processing Speed", suffix: "/7" },
    { number: "15", label: "Chart Types", suffix: "+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-malachite-50 to-limegreen-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-malachite-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-jet-600">Excel Analytics</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-blackolive-600 hover:text-pigmentgreen-600 font-medium transition-colors">Home</Link>
              <Link to="/features" className="text-pigmentgreen-600 font-medium">Features</Link>
              <Link to="/dashboard" className="text-blackolive-600 hover:text-pigmentgreen-600 font-medium transition-colors">Dashboard</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-blackolive-600 hover:text-pigmentgreen-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-malachite-100/30 to-limegreen-100/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div ref={heroRef} className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-jet-600 mb-6">
              Powerful
              <span className="bg-gradient-to-r from-pigmentgreen-600 to-malachite-600 bg-clip-text text-transparent"> Features</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blackolive-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive suite of tools designed to transform your Excel data into actionable insights with unparalleled ease and precision.
            </p>
            
            {/* Feature Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} ref={addStatRef} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-pigmentgreen-600 mb-2">
                    <span className="count-number">{stat.number}</span>{stat.suffix}
                  </div>
                  <div className="text-sm lg:text-base text-blackolive-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                ref={addFeatureRef}
                className={`feature-card bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 lg:p-16 shadow-xl border border-white/50`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={`space-y-8 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-jet-600 mb-6">
                        {feature.title}
                      </h3>
                      <p className="text-xl text-blackolive-600 leading-relaxed mb-8">
                        {feature.description}
                      </p>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-jet-600 mb-4">Key Capabilities:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {feature.capabilities.map((capability, capIndex) => (
                          <div key={capIndex} className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-500 rounded-full"></div>
                            <span className="text-blackolive-600 font-medium">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <Link
                        to="/register"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        Try This Feature
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pigmentgreen-500/20 to-malachite-500/20 rounded-2xl transform rotate-3"></div>
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-jet-600 to-blackolive-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-jet-600/90 to-blackolive-600/90"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div ref={ctaRef}>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Join thousands of professionals who trust our platform to turn their Excel files into powerful insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start Free Trial
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-jet-50 border-t border-jet-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-jet-600">Excel Analytics Platform</span>
              </div>
              <p className="text-blackolive-600 mb-4 max-w-md">
                Transform your Excel data into actionable insights with our powerful analytics platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-jet-600 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-blackolive-600 hover:text-pigmentgreen-600 transition-colors">Features</Link></li>
                <li><Link to="/dashboard" className="text-blackolive-600 hover:text-pigmentgreen-600 transition-colors">Dashboard</Link></li>
                <li><Link to="/upload" className="text-blackolive-600 hover:text-pigmentgreen-600 transition-colors">Upload</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-jet-600 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-blackolive-600 hover:text-pigmentgreen-600 transition-colors">About</a></li>
                <li><a href="#" className="text-blackolive-600 hover:text-pigmentgreen-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-blackolive-600 hover:text-pigmentgreen-600 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-jet-200 mt-8 pt-8 text-center">
            <p className="text-blackolive-500 text-sm">
              © {new Date().getFullYear()} Excel Analytics Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
