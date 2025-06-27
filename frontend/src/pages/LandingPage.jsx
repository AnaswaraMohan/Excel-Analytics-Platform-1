import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import uploadExcelImage from '../assets/uploadExcel.png';
import interactiveChartsImage from '../assets/InteractiveCharts.png';
import insightsImage from '../assets/Insights.jpg';
import moonImage from '../assets/Moon.png';
import spectralImage from '../assets/Spectral.jpg';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import Login from './Login';
import Register from './Register';
import Accordion from '../components/Accordion';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

const LandingPage = () => {
  const featureRefs = useRef([]);
  const sectionRefs = useRef([]);
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const securityCardsRef = useRef([]);
  const [activeModal, setActiveModal] = useState(null);

  const handleSwitchModal = (modal) => {
    setActiveModal(modal);
  };

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
          scale: 1.01,
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      const cards = securityCardsRef.current;
      cards.forEach((card) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const headings = document.querySelectorAll('.section-heading');
    
    headings.forEach(heading => {
      // Split text into words first
      const words = heading.textContent.split(' ');
      heading.textContent = '';
      
      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        // Split each word into characters
        const chars = word.split('');
        chars.forEach((char, charIndex) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'float-text';
          span.style.setProperty('--char-index', charIndex);
          span.style.setProperty('--word-index', wordIndex);
          wordSpan.appendChild(span);
        });
        
        heading.appendChild(wordSpan);
        // Add space after each word except the last one
        if (wordIndex < words.length - 1) {
          heading.appendChild(document.createTextNode(' '));
        }
      });

      gsap.set(heading.querySelectorAll('.float-text'), {
        opacity: 0,
        y: 20
      });

      ScrollTrigger.create({
        trigger: heading,
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.to(heading.querySelectorAll('.float-text'), {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
            stagger: {
              amount: 0.3,
              from: "start"
            }
          });
        }
      });
    });
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
                <button onClick={() => setActiveModal('login')} className="text-white/90 font-medium hover:text-white transition-colors duration-200">Login</button>
                <button onClick={() => setActiveModal('register')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full transition duration-300 font-semibold backdrop-blur-md border border-white/30">Sign Up</button>
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
          className="parallax-bg min-h-screen flex items-center justify-center pt-32 pb-16 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${moonImage})`
          }}
        >
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          {/* Black gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black"></div>
          
          <div ref={heroRef} className="max-w-6xl mx-auto px-4 w-full relative z-10">
            <div className="text-center">
              {/* Text Content */}
                      <div className="flex flex-col justify-center space-y-6">
                      <div className="max-w-5xl mx-auto">
                        <h1 className="text-7xl lg:text-8xl font-primary-medium leading-tight text-white mb-6">
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                          Turn <span className="font-cardo font-bold italic">Excel</span>
                          <a 
                            href="#features" 
                            className="w-24 h-16 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:bg-white/30 hover:border-white/50 cursor-pointer group"
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                          <img src={interactiveChartsImage} className="rounded-full w-20 h-14 object-cover transition-transform duration-300 group-hover:scale-105" />
                          </a>
                          <span className="font-cardo font-bold italic">files</span>
                        </div>
                        <div className="mt-2">
                          <span className="bg-gradient-text bg-clip-text text-transparent animate-gradient">into Insights.</span>
                        </div>
                        </h1>
                      </div>
                      <div className="space-y-6">
                        <p className="text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                        From raw spreadsheets to interactive dashboards, automated reports, and AI-powered recommendations — all in one powerful platform.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-white/70">
                        <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm">Real-time Analysis</span>
                        <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm">Smart Visualization</span>
                        <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm">AI Insights</span>
                        <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm">Automated Reports</span>
                        </div>
                      </div>
                      <div className="mt-8 flex gap-4 flex-col sm:flex-row justify-center">
                        <button 
                        onClick={() => setActiveModal('register')} 
                        className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-primary-medium text-white shadow-sm transition duration-200 bg-jet-500 hover:bg-pigmentgreen-500"
                        >
                        Get Started
                        </button>
                        <button 
                        onClick={() => setActiveModal('login')} 
                        className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md px-8 py-4 text-lg font-primary-medium shadow-sm transition duration-200 text-white border border-white/30 hover:bg-white/30"
                        >
                        Login
                        </button>
                      </div>
                      </div>
                    </div>
                    </div>
                  </section>        {/* Features Section */}
        <section ref={addSectionRef} id="features" className="py-20 relative bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-jet-900"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="section-heading text-5xl lg:text-7xl font-bold text-white mb-6">
                Powerful Features
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                Discover the comprehensive suite of tools designed to transform your Excel data into actionable insights with unparalleled ease and precision.
              </p>
            </div>

            <div className="space-y-20">
              {/* Feature 1 - Excel File Upload & Processing */}
              <SpotlightCard
                ref={addFeatureRef}
                className="feature-card bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-12 shadow-xl border border-white/20 max-w-[95%] mx-auto"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Upload & Processing
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
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200"
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
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-[1.015] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              {/* Feature 2 - Interactive Data Visualization */}
              <SpotlightCard
                ref={addFeatureRef}
                className="feature-card bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-12 shadow-xl border border-white/20 max-w-[95%] mx-auto"
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
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200"
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
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-[1.015] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              {/* Feature 3 - AI-Powered Insights */}
              <SpotlightCard
                ref={addFeatureRef}
                className="feature-card bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-12 shadow-xl border border-white/20 max-w-[95%] mx-auto"
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
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200"
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
                        className="relative w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-[1.015] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-b from-jet-900 via-jet-900 to-black">
          <div className="absolute inset-0 bg-grid-white/5 opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              <h2 className="section-heading text-5xl lg:text-7xl font-bold text-white mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Your data security is our top priority. We implement industry-leading security measures to protect your sensitive information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SpotlightCard
                ref={(el) => (securityCardsRef.current[0] = el)}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15), transparent 40%)",
                    }}
                  ></div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">End-to-End Encryption</h3>
                  <p className="text-white/70">Your data is encrypted in transit and at rest using industry-standard AES-256 encryption.</p>
                </div>
              </SpotlightCard>

              <SpotlightCard
                ref={(el) => (securityCardsRef.current[1] = el)}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15), transparent 40%)",
                    }}
                  ></div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">SOC 2 Compliance</h3>
                  <p className="text-white/70">We maintain SOC 2 Type II compliance, ensuring your data is handled with the highest security standards.</p>
                </div>
              </SpotlightCard>

              <SpotlightCard
                ref={(el) => (securityCardsRef.current[2] = el)}
                className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden"
              >
                <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 197, 94, 0.15), transparent 40%)",
                    }}
                  ></div>
                </div>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-pigmentgreen-500 to-malachite-500 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Regular Audits</h3>
                  <p className="text-white/70">We conduct regular security audits and penetration testing to ensure your data remains protected.</p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-black">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-heading text-5xl lg:text-7xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
              </p>
            </div>
            <SpotlightCard className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <Accordion title="What types of Excel files can I upload?">
                You can upload both .xls and .xlsx file formats. Our platform uses an advanced parsing engine to handle a wide variety of Excel structures, including multiple sheets, complex formulas, and large datasets.
              </Accordion>
              <Accordion title="How secure is my data?">
                Data security is our highest priority. We use end-to-end AES-256 encryption for data in transit and at rest. Our platform is SOC 2 compliant, and we conduct regular third-party security audits to ensure your data is always protected.
              </Accordion>
              <Accordion title="Can I customize the dashboards and visualizations?">
                Absolutely. Our platform offers a highly interactive and customizable experience. You can choose from various chart types, apply filters, change color schemes, and arrange your dashboards to best tell your data's story.
              </Accordion>
              <Accordion title="Is there a limit to the file size I can upload?">
                Our standard plans support Excel files up to 100MB. For enterprise clients with larger needs, we offer custom solutions with increased capacity and dedicated processing resources. Please contact our sales team for more information.
              </Accordion>
              <Accordion title="Do you offer a free trial?">
                Yes, we offer a 14-day free trial with full access to all our features. No credit card is required to get started. Sign up today to see how our platform can transform your data analytics workflow.
              </Accordion>
            </SpotlightCard>
          </div>
        </section>

        {/* Contact Section */}
        <section className="min-h-screen py-32 relative overflow-hidden bg-gradient-to-b from-black via-black to-jet-900">
          {/* Background Container with Spectral.jpg */}
          <div className="absolute inset-0">
            <img 
              src={spectralImage} 
              alt="Spectral Background" 
              className="w-full h-full object-cover opacity-30"
              style={{
                transform: 'scale(1.1)',
                transition: 'transform 0.5s ease-out'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-jet-900 opacity-90"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="section-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Let's Start a Conversation
              </h2>
              <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Have questions about our Excel Analytics Platform? We're here to help you transform your data into actionable insights.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <SpotlightCard className="bg-white/[0.02] backdrop-blur-sm rounded-3xl p-8 lg:p-10 border border-white/5 shadow-2xl">
                <form className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="relative group">
                      <input 
                        type="text" 
                        id="firstName"
                        className="peer w-full px-4 py-3 bg-transparent text-white placeholder-transparent focus:ring-0 focus:border-0 focus:outline-none transition-colors duration-300" 
                        placeholder="First Name"
                        required
                      />
                      <label 
                        htmlFor="firstName" 
                        className="absolute left-4 -top-2 text-xs text-white/50 transition-all duration-300 
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 
                          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pigmentgreen-500"
                      >
                        First Name
                      </label>
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pigmentgreen-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                    </div>

                    <div className="relative group">
                      <input 
                        type="text" 
                        id="lastName"
                        className="peer w-full px-4 py-3 bg-transparent text-white placeholder-transparent focus:ring-0 focus:border-0 focus:outline-none transition-colors duration-300" 
                        placeholder="Last Name"
                        required
                      />
                      <label 
                        htmlFor="lastName" 
                        className="absolute left-4 -top-2 text-xs text-white/50 transition-all duration-300 
                          peer-placeholder-shown:text-base peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 
                          peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pigmentgreen-500"
                      >
                        Last Name
                      </label>
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pigmentgreen-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                    </div>
                  </div>

                  <div className="relative group">
                    <input 
                      type="email" 
                      id="email"
                      className="peer w-full px-4 py-3 bg-transparent text-white placeholder-transparent focus:ring-0 focus:border-0 focus:outline-none transition-colors duration-300" 
                      placeholder="Email Address"
                      required
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-4 -top-2 text-xs text-white/50 transition-all duration-300 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pigmentgreen-500"
                    >
                      Email Address
                    </label>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pigmentgreen-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                  </div>

                  <div className="relative group">
                    <input 
                      type="text" 
                      id="subject"
                      className="peer w-full px-4 py-3 bg-transparent text-white placeholder-transparent focus:ring-0 focus:border-0 focus:outline-none transition-colors duration-300" 
                      placeholder="Subject"
                      required
                    />
                    <label 
                      htmlFor="subject" 
                      className="absolute left-4 -top-2 text-xs text-white/50 transition-all duration-300 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pigmentgreen-500"
                    >
                      Subject
                    </label>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pigmentgreen-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                  </div>

                  <div className="relative group">
                    <textarea 
                      id="message"
                      rows="4" 
                      className="peer w-full px-4 py-3 bg-transparent text-white placeholder-transparent focus:ring-0 focus:border-0 focus:outline-none transition-colors duration-300 resize-none" 
                      placeholder="Message"
                      required
                    ></textarea>
                    <label 
                      htmlFor="message" 
                      className="absolute left-4 -top-2 text-xs text-white/50 transition-all duration-300 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-3 
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pigmentgreen-500"
                    >
                      Message
                    </label>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pigmentgreen-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                  </div>

                  <div>
                    <button 
                      type="submit" 
                      className="w-full py-4 bg-gradient-to-r from-pigmentgreen-500/80 to-malachite-500/80 text-white font-semibold rounded-xl hover:from-pigmentgreen-500 hover:to-malachite-500 transform hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden"
                    >
                      <span className="relative z-10">Send Message</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-malachite-500 to-pigmentgreen-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </form>
              </SpotlightCard>
            </div>
          </div>
        </section>
        </main>
        <Footer variant="dark" />

      <Modal 
        isOpen={activeModal === 'login'} 
        onClose={() => setActiveModal(null)}
        title="Welcome Back"
        subtitle="Enter your credentials to access your account."
      >
        <Login isModal={true} onSwitchModal={() => handleSwitchModal('register')} />
      </Modal>

      <Modal 
        isOpen={activeModal === 'register'} 
        onClose={() => setActiveModal(null)}
        title="Create an Account"
        subtitle="Start your journey with our platform today."
      >
        <Register isModal={true} onSwitchModal={() => handleSwitchModal('login')} />
      </Modal>
      </div>
  );
};

export default LandingPage;
