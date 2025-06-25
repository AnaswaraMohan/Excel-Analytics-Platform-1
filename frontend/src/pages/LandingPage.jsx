import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import uploadExcelImage from '../assets/uploadExcel.png';
import interactiveChartsImage from '../assets/InteractiveCharts.png';
import insightsImage from '../assets/Insights.jpg';
import moonImage from '../assets/Moon.png';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const featureRefs = useRef([]);
  const sectionRefs = useRef([]);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef([]);

  useEffect(() => {
    // Enable GSAP performance optimizations
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
          duration: 1.5,
          ease: "power3.out",
          delay: 0.3
        }
      );
    }

    // Stats counter animation
    statsRef.current.forEach((ref, index) => {
      if (ref) {
        const countElement = ref.querySelector('.count-number');
        if (countElement) {
          const targetText = countElement.textContent;
          const targetValue = parseInt(targetText.replace(/[^\d]/g, ''));
          
          gsap.fromTo(ref,
            { 
              opacity: 0, 
              y: 30,
              scale: 0.9
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: 1 + (index * 0.1)
            }
          );

          // Counter animation
          if (targetValue > 0) {
            gsap.fromTo(countElement,
              { textContent: 0 },
              {
                textContent: targetValue,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                delay: 1.2,
                onUpdate: function() {
                  const current = Math.round(this.targets()[0].textContent);
                  if (targetText.includes('K+')) {
                    countElement.textContent = current + 'K+';
                  } else if (targetText.includes('%')) {
                    countElement.textContent = current + '%';
                  } else if (targetText.includes('/')) {
                    countElement.textContent = current + '/7';
                  } else if (targetText.includes('+')) {
                    countElement.textContent = current + '+';
                  } else {
                    countElement.textContent = current;
                  }
                }
              }
            );
          }
        }
      }
    });

    // Set initial state for feature cards with hardware acceleration
    gsap.set(featureRefs.current, { 
      y: 100, 
      opacity: 0,
      scale: 0.95,
      force3D: true,
      willChange: "transform, opacity"
    });

    // Create enhanced ScrollTrigger animations for each feature card
    featureRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.fromTo(ref, 
          {
            y: 80,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              refreshPriority: 1,
              fastScrollEnd: true,
              preventOverlaps: true
            },
            delay: index * 0.2, // Stagger effect
            onComplete: () => {
              // Remove will-change after animation completes for better performance
              gsap.set(ref, { willChange: "auto" });
            }
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

    // Add smooth scroll-triggered animations for images
    const images = document.querySelectorAll('.feature-card img');
    images.forEach((img, index) => {
      gsap.fromTo(img, 
        {
          scale: 1.1,
          opacity: 0.8
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play none none reverse",
            scrub: false
          },
          delay: index * 0.1
        }
      );
    });

    // Add hover animations for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });

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

  const addStatRef = (el) => {
    if (el && !statsRef.current.includes(el)) {
      statsRef.current.push(el);
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
                <Link to="/features" className="text-white/90 font-medium hover:text-white transition-colors duration-200">Features</Link>
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
          className="parallax-bg min-h-screen flex items-center justify-center pt-32 pb-20 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${moonImage})`
          }}
        >
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          {/* Black gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
          
          <div ref={heroRef} className="max-w-7xl mx-auto px-4 w-full relative z-10">
            <div className="text-center space-y-16">
              {/* Text Content */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="max-w-5xl mx-auto">
                  <h1 className="text-7xl lg:text-8xl font-bold leading-tight text-white mb-6">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      Turn <span className="font-bold italic">Excel</span>
                      <div className="w-20 h-12 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <div className="w-16 h-8 bg-white/10 rounded-full"></div>
                      </div>
                      <span className="font-bold italic">files</span>
                    </div>
                    <div className="mt-2">
                      <span className="bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent">into Insights.</span>
                    </div>
                  </h1>
                </div>
                <p className="text-2xl lg:text-3xl font-medium text-white mt-4 max-w-2xl mx-auto">
                  Upload. Analyze. Visualize.
                </p>
                <div className="mt-8 flex gap-4 flex-col sm:flex-row justify-center">
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-white shadow-sm transition duration-200 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md px-8 py-4 text-lg font-semibold shadow-sm transition duration-200 text-white border border-white/30 hover:bg-white/30"
                  >
                    Login
                  </Link>
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div ref={addStatRef} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      <span className="count-number bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent">500</span>
                    </div>
                    <div className="text-sm lg:text-base text-white/90 font-medium">Files Processed</div>
                  </div>
                  <div ref={addStatRef} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      <span className="count-number bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent">98</span>
                    </div>
                    <div className="text-sm lg:text-base text-white/90 font-medium">Accuracy Rate</div>
                  </div>
                  <div ref={addStatRef} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      <span className="count-number bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent">24</span>
                    </div>
                    <div className="text-sm lg:text-base text-white/90 font-medium">Processing Speed</div>
                  </div>
                  <div ref={addStatRef} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      <span className="count-number bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent">15</span>
                    </div>
                    <div className="text-sm lg:text-base text-white/90 font-medium">Chart Types</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>        {/* Features Section */}
        <section 
          ref={addSectionRef}
          id="features" 
          className="parallax-bg py-20 relative bg-gradient-to-b from-jet-900 to-blackolive-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-5xl lg:text-7xl font-bold text-white mb-6">
                Powerful
                <span className="bg-gradient-to-r from-pigmentgreen-400 to-malachite-400 bg-clip-text text-transparent"> Features</span>
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Discover the comprehensive suite of tools designed to transform your Excel data into actionable insights with unparalleled ease and precision.
              </p>
            </div>

            <div className="space-y-32">
              {/* Feature 1 - Excel File Upload & Processing */}
              <div
                ref={addFeatureRef}
                className="feature-card bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-xl border border-white/20"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Excel File Upload & Processing
                      </h3>
                      <p className="text-xl text-white/90 leading-relaxed mb-8">
                        Seamlessly upload and process your Excel files with our secure, lightning-fast processing engine. Support for both .xls and .xlsx formats with advanced parsing capabilities.
                      </p>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Key Capabilities:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Drag & drop interface</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Batch file processing</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Real-time validation</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Secure cloud storage</span>
                        </div>
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
                  <div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pigmentgreen-500/20 to-malachite-500/20 rounded-2xl transform rotate-3"></div>
                      <img
                        src={uploadExcelImage}
                        alt="Excel File Upload & Processing"
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Interactive Data Visualization */}
              <div
                ref={addFeatureRef}
                className="feature-card bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-xl border border-white/20"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:grid-flow-col-dense">
                  {/* Content */}
                  <div className="space-y-8 lg:col-start-2">
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Interactive Data Visualization
                      </h3>
                      <p className="text-xl text-white/90 leading-relaxed mb-8">
                        Transform your raw data into stunning, interactive visualizations. Create professional charts, graphs, and dashboards that tell your data's story.
                      </p>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Key Capabilities:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Multiple chart types</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Real-time updates</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Export capabilities</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Mobile responsive</span>
                        </div>
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
                  <div className="lg:col-start-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pigmentgreen-500/20 to-malachite-500/20 rounded-2xl transform rotate-3"></div>
                      <img
                        src={interactiveChartsImage}
                        alt="Interactive Data Visualization"
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 - AI-Powered Insights */}
              <div
                ref={addFeatureRef}
                className="feature-card bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-8 lg:p-16 shadow-xl border border-white/20"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        AI-Powered Insights
                      </h3>
                      <p className="text-xl text-white/90 leading-relaxed mb-8">
                        Leverage artificial intelligence to automatically detect patterns, generate insights, and provide intelligent recommendations from your data.
                      </p>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white mb-4">Key Capabilities:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Pattern recognition</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Automated insights</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Predictive analytics</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-pigmentgreen-400 rounded-full"></div>
                          <span className="text-white/90 font-medium">Smart recommendations</span>
                        </div>
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
                  <div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pigmentgreen-500/20 to-malachite-500/20 rounded-2xl transform rotate-3"></div>
                      <img
                        src={insightsImage}
                        alt="AI-Powered Insights"
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>      {/* CTA Section */}
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
