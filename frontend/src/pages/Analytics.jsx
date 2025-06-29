import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { getUserUploads } from '../services/uploadService';
import { gsap } from 'gsap';
import { 
  FiActivity, FiUsers, FiTrendingUp, FiDownload, FiRefreshCw, 
  FiArrowLeft, FiZap, FiEye, FiClock, FiCheck, FiDatabase 
} from 'react-icons/fi';

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

const Analytics = () => {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const analyticsRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    if (!isLoading && analyticsRef.current) {
      gsap.config({
        force3D: true,
        nullTargetWarn: false
      });

      gsap.fromTo(analyticsRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [isLoading, analysisData]);

  // Check if uploadId was passed from dashboard
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const uploadId = urlParams.get('uploadId');
    
    if (uploadId) {
      checkExistingAnalysis(uploadId);
    }
    
    loadUploads();
  }, [location]);

  const loadUploads = async () => {
    try {
      setIsLoading(true);
      const response = await getUserUploads();
      setUploads(response.filter(upload => upload.isAnalyzed));
    } catch (error) {
      console.error('Failed to load uploads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingAnalysis = async (uploadId) => {
    try {
      const response = await analyticsService.getAnalysis(uploadId);
      if (response.success && response.data.status === 'completed') {
        setAnalysisData(response.data);
        setSelectedUpload(uploads.find(upload => upload._id === uploadId));
      }
    } catch (error) {
      console.log('No existing analysis found');
    }
  };

  const handleAnalyzeData = async (uploadId) => {
    try {
      setIsAnalyzing(true);
      console.log('Starting data analysis...');

      const response = await analyticsService.analyzeData(uploadId, {
        analysisType: 'basic'
      });

      if (response.success) {
        setAnalysisData(response.data);
        setSelectedUpload(uploads.find(upload => upload._id === uploadId));
        console.log('Analysis completed successfully!');
      }
    } catch (error) {
      console.error('Analysis failed:', error.response?.data?.message || error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    if (!analysisData?._id) return;

    try {
      setIsAnalyzing(true);
      const response = await analyticsService.refreshAnalysis(analysisData._id);
      
      if (response.success) {
        setAnalysisData(response.data);
        console.log('Analysis refreshed successfully!');
      }
    } catch (error) {
      console.error('Failed to refresh analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatAnalysisResults = (data) => {
    if (!data || !data.results) return null;
    return analyticsService.formatAnalysisResults(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pigmentgreen-500" aria-label="Loading" />
      </div>
    );
  }

  const formatted = analysisData ? formatAnalysisResults(analysisData) : null;

  return (
    <div ref={analyticsRef} className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white/70 hover:text-white mb-6 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:translate-x-[-2px] transition-transform" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Data Analytics</h1>
            <p className="text-white/70 text-lg">
              Analyze your Excel data with AI-powered insights and intelligent recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Selection Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FiDatabase className="mr-3 w-6 h-6 text-pigmentgreen-400" />
              Select Data File
            </h2>
            
            {uploads.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiDatabase className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No analyzed files</h3>
                <p className="text-white/60 mb-6">
                  Upload and analyze a file first to start generating insights
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200"
                >
                  Upload File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {uploads.map((upload) => {
                  const dataPoints = upload.jsonData ? 
                    (typeof upload.jsonData === 'string' ? JSON.parse(upload.jsonData) : upload.jsonData).length : 0;
                  
                  return (
                    <SpotlightCard
                      key={upload._id}
                      className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 cursor-pointer ${
                        selectedUpload?._id === upload._id 
                          ? 'border-pigmentgreen-500/50 bg-pigmentgreen-500/10' 
                          : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedUpload(upload)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-lg mb-2 truncate">
                            {upload.originalName}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                            <div>
                              <span className="text-white/50">Rows:</span>
                              <span className="ml-2 font-medium">{dataPoints.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-white/50">Uploaded:</span>
                              <span className="ml-2 font-medium">
                                {new Date(upload.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                            <FiCheck className="w-3 h-3 mr-1" />
                            Analyzed
                          </span>
                        </div>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            )}

            {selectedUpload && (
              <div className="mt-6">
                <button
                  onClick={() => handleAnalyzeData(selectedUpload._id)}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Analyzing Data...
                    </>
                  ) : (
                    <>
                      <FiZap className="mr-3 w-5 h-5" />
                      Generate Analytics
                    </>
                  )}
                </button>
                
                {isAnalyzing && (
                  <div className="mt-4 p-4 bg-pigmentgreen-500/10 border border-pigmentgreen-500/20 rounded-xl">
                    <div className="flex items-center text-pigmentgreen-400 text-sm">
                      <div className="animate-pulse w-2 h-2 bg-pigmentgreen-400 rounded-full mr-2"></div>
                      Processing your data with AI... This may take a few moments.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Analytics Results Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FiTrendingUp className="mr-3 w-6 h-6 text-pigmentgreen-400" />
              Analytics Results
            </h2>
            
            {!analysisData ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiTrendingUp className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Ready for Analysis</h3>
                <p className="text-white/60">
                  Select a file and click "Generate Analytics" to see AI-powered insights
                </p>
              </div>
            ) : formatted ? (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/30">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                        <FiDatabase className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-blue-400 font-medium text-sm">Total Rows</p>
                        <p className="text-xl font-bold text-white">{formatted.summary.totalRows.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                        <FiActivity className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-green-400 font-medium text-sm">Columns</p>
                        <p className="text-xl font-bold text-white">{formatted.summary.totalColumns}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Quality Score */}
                <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-6 rounded-xl border border-yellow-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-yellow-400 font-semibold">Data Quality Score</h4>
                    <span className="text-2xl font-bold text-white">{formatted.summary.dataQualityScore}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${formatted.summary.dataQualityScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* AI Insights */}
                {formatted.insights && formatted.insights.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <FiZap className="mr-2 w-5 h-5 text-pigmentgreen-400" />
                      AI Insights
                    </h4>
                    {formatted.insights.slice(0, 3).map((insight, index) => (
                      <div key={index} className="bg-gradient-to-r from-pigmentgreen-500/10 to-malachite-500/10 p-4 rounded-xl border border-pigmentgreen-500/30">
                        <div className="flex items-start justify-between mb-2">
                          <span className="px-2 py-1 bg-pigmentgreen-500/20 text-pigmentgreen-400 text-xs font-medium rounded-full border border-pigmentgreen-500/30">
                            {insight.category.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{insight.finding}</p>
                        {insight.recommendation && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/70 text-xs">
                              <span className="text-pigmentgreen-400 font-medium">Recommendation:</span> {insight.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <button
                    onClick={handleRefreshAnalysis}
                    disabled={isAnalyzing}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-malachite-500 to-pigmentgreen-500 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
                  >
                    <FiRefreshCw className="mr-2 w-4 h-4" />
                    Refresh Analysis
                  </button>
                  <button
                    onClick={() => navigate(`/visualize/${selectedUpload._id}`)}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <FiUsers className="mr-2 w-4 h-4" />
                    Create Visualizations
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiTrendingUp className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Analysis Failed</h3>
                <p className="text-white/60 mb-6">
                  Unable to process the analysis data. Please try again.
                </p>
                <button
                  onClick={handleRefreshAnalysis}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200"
                >
                  <FiRefreshCw className="mr-2 w-4 h-4" />
                  Retry Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
