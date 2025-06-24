import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import uploadExcelImage from '../assets/uploadExcel.png';
import interactiveChartsImage from '../assets/InteractiveCharts.png';
import insightsImage from '../assets/Insights.jpg';
import japaneasyImage from '../assets/Japaneasy.jpg';
import fractalImage from '../assets/Fractal.jpg';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const featureRefs = useRef([]);
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Enable GSAP performance optimizations
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });

    // Set initial state for feature cards with hardware acceleration
    gsap.set(featureRefs.current, { 
      y: 100, 
      opacity: 0,
      force3D: true,
      willChange: "transform, opacity"
    });

    // Create ScrollTrigger animations for each feature card
    featureRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.to(ref, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: ref,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            // Refresh on resize for responsive behavior
            refreshPriority: 1,
            // Optimize for mobile performance
            fastScrollEnd: true,
            preventOverlaps: true
          },
          delay: index * 0.2, // Stagger effect
          onComplete: () => {
            // Remove will-change after animation completes for better performance
            gsap.set(ref, { willChange: "auto" });
          }
        });
      }
    });

    // Add parallax effect to background images on desktop (performance conscious)
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    if (mediaQuery.matches) {
      sectionRefs.current.forEach((ref) => {
        if (ref) {
          gsap.to(ref, {
            backgroundPosition: "50% 20%",
            ease: "none",
            scrollTrigger: {
              trigger: ref,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          });
        }
      });
    }

    // Refresh ScrollTrigger on window resize for responsive design
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addFeatureRef = (el) => {
    if (el && !featureRefs.current.includes(el)) {
      featureRefs.current.push(el);
    }
  };

  const addSectionRef = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">      {/* Floating Navigation Bar */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4 h-20">
        <div className="flex justify-between items-center gap-4 h-full">
          {/* Left Capsule - Brand & Navigation */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl h-16 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center h-full px-6 space-x-6">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-white">Excelify</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-white/90 font-medium hover:text-white transition-colors duration-200">Home</Link>
                <a href="#features" className="text-white/90 font-medium hover:text-white transition-colors duration-200">Features</a>
              </div>
            </div>
          </div>
          
          {/* Right Capsule - Authentication */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl h-16 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center h-full px-6 space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-white/90 font-medium hover:text-white transition-colors duration-200">Login</Link>
                <Link to="/register" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition duration-300 font-semibold backdrop-blur-md border border-white/30">Sign Up</Link>
              </div>
              <div className="md:hidden flex items-center">
                <button type="button" className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 rounded-full p-1">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav><main className="flex-grow">        {/* Hero Section */}
        <section 
          ref={addSectionRef}
          className="parallax-bg min-h-screen flex items-center justify-center pt-32 pb-16 relative"
          style={{
            backgroundImage: `url(${fractalImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
          {/* Black gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
          
          <div className="max-w-6xl mx-auto px-4 w-full relative z-10">
            <div className="text-center">
              {/* Text Content */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-7xl lg:text-8xl font-bold leading-tight text-white mb-6">
                    Turn Excel files into Insights
                  </h1>
                </div>
                <p className="text-2xl lg:text-3xl text-white mt-4 max-w-2xl mx-auto">
                  Upload. Analyze. Visualize.
                </p>
                <div className="mt-8 flex gap-4 flex-col sm:flex-row justify-center">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-semibold text-white shadow-sm transition duration-200 bg-jet-500 hover:bg-pigmentgreen-500"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center rounded-md bg-white/20 backdrop-blur-md px-8 py-4 text-lg font-medium shadow-sm transition duration-200 text-white border border-white/30 hover:bg-white/30"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Features Section */}
        <section 
          ref={addSectionRef}
          id="features" 
          className="parallax-bg py-16 relative"
          style={{
            backgroundImage: `url(${japaneasyImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          {/* Black gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
          
          <div className="max-w-6xl mx-auto px-4 space-y-24 relative z-10">
            <div className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-white">Powerful Features</h2>
              <p className="mt-4 text-xl lg:text-2xl text-white/90">Everything you need to analyze Excel data effectively</p>
            </div>            {/* Feature 1 - Image Left, Text Right */}
            <div ref={addFeatureRef} className="feature-card grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={uploadExcelImage} 
                  alt="Upload Excel Files" 
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>              <div className="text-center md:text-left">
                <h3 className="text-4xl lg:text-3xl font-bold text-white">Upload Excel Files</h3>
                <p className="text-xl lg:text-xl text-white/90 mt-2">
                  Seamlessly upload and process your Excel files with our secure, fast processing engine. Support for both .xls and .xlsx formats.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center mt-6 text-white px-6 py-3 rounded-md font-semibold transition duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transform hover:scale-105"
                >
                  Explore Feature
                </Link>
              </div>
            </div>            {/* Feature 2 - Text Left, Image Right */}
            <div ref={addFeatureRef} className="feature-card grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">              <div className="text-center md:text-left order-2 md:order-1">
                <h3 className="text-4xl lg:text-3xl font-bold text-white">Interactive Charts</h3>
                <p className="text-xl lg:text-xl text-white/90 mt-2">
                  Transform your data into stunning visualizations with our advanced charting tools. Create 2D and 3D graphs with real-time interactivity.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center mt-6 text-white px-6 py-3 rounded-md font-semibold transition duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transform hover:scale-105"
                >
                  Explore Feature
                </Link>
              </div><div className="flex justify-center md:justify-end order-1 md:order-2">
                <img 
                  src={interactiveChartsImage} 
                  alt="Interactive Charts" 
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>            {/* Feature 3 - Image Left, Text Right */}
            <div ref={addFeatureRef} className="feature-card grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="flex justify-center md:justify-start">
                <img 
                  src={insightsImage} 
                  alt="AI Insights" 
                  className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </div>              <div className="text-center md:text-left">
                <h3 className="text-4xl lg:text-3xl font-bold text-white">AI Insights</h3>
                <p className="text-xl lg:text-xl text-white/90 mt-2">
                  Leverage artificial intelligence to automatically generate insights, detect patterns, and provide intelligent recommendations from your data.
                </p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center mt-6 text-white px-6 py-3 rounded-md font-semibold transition duration-200 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 transform hover:scale-105"
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
