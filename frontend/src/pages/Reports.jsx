import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import reportsService from '../services/reportsService';
import { analyticsService } from '../services/analyticsService';
import { getUserUploads } from '../services/uploadService';
import { 
  FiFileText, FiDownload, FiShare2, FiTrash2, FiArrowLeft, FiEye, 
  FiStar, FiZap, FiClock, FiPlus, FiLoader, FiAlertTriangle, 
  FiRefreshCw, FiCheck, FiDatabase 
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

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('detailed');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const reportsRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const uploadId = urlParams.get('uploadId');
    
    loadData();
    
    if (uploadId) {
      loadAnalysisForUpload(uploadId);
    }
  }, [location]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const uploadsData = await getUserUploads();
      // Only show analyzed uploads
      const analyzedUploads = uploadsData.filter(upload => upload.isAnalyzed);
      setUploads(analyzedUploads);

      // Load templates
      try {
        const templatesData = await reportsService.getTemplates();
        setTemplates(templatesData || []);
      } catch (templatesError) {
        console.log('Templates not available:', templatesError);
        setTemplates([
          { id: 'detailed', name: 'Detailed Analysis', description: 'Comprehensive analysis with all insights' },
          { id: 'summary', name: 'Executive Summary', description: 'High-level overview for stakeholders' },
          { id: 'technical', name: 'Technical Report', description: 'In-depth technical analysis and statistics' }
        ]);
      }

      // Load existing reports
      try {
        const reportsData = await reportsService.getReports();
        setReports(reportsData || []);
      } catch (reportsError) {
        console.log('No reports found:', reportsError);
        setReports([]);
      }
    } catch (error) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalysisForUpload = async (uploadId) => {
    try {
      const upload = uploads.find(u => u._id === uploadId);
      if (upload) {
        setSelectedUpload(upload);
        
        // Try to get existing analysis
        const analysis = await analyticsService.getAnalytics(uploadId);
        setAnalysisData(analysis);
      }
    } catch (error) {
      console.log('No analysis found for upload:', uploadId);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedUpload || !analysisData) {
      console.error('Please select a file with analysis data first');
      return;
    }

    try {
      setIsGenerating(true);
      console.log('Generating report...');

      const reportData = {
        uploadId: selectedUpload._id,
        analysisId: analysisData._id,
        templateId: selectedTemplate,
        customPrompt: customPrompt.trim() || undefined,
        title: `${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Report - ${selectedUpload.originalName}`,
        uploadName: selectedUpload.originalName
      };

      const response = await reportsService.generateReport(reportData);
      
      if (response.success) {
        console.log("Operation completed");
        await loadData(); // Refresh reports list
        setSelectedReport(response.data);
      } else {
        throw new Error(response.message || 'Report generation failed');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate report';
      console.log("Operation completed");
      
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        console.log("Operation completed");
        setTimeout(() => handleGenerateReport(), 2000);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      await reportsService.deleteReport(reportId);
      console.log("Operation completed");
      await loadData(); // Refresh reports list
      
      if (selectedReport?._id === reportId) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.log("Operation completed");
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      console.log("Operation completed");
      await reportsService.downloadReport(reportId);
      console.log("Operation completed");
    } catch (error) {
      console.log("Operation completed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pigmentgreen-500" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div ref={reportsRef} className="min-h-screen bg-black">
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
            <h1 className="text-4xl font-bold text-white mb-3">Generate Reports</h1>
            <p className="text-white/70 text-lg">
              Create professional, shareable reports with automated insights and recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Generation Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FiZap className="mr-3 w-6 h-6 text-pigmentgreen-400" />
              Create New Report
            </h2>
            
            {uploads.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiDatabase className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No analyzed files</h3>
                <p className="text-white/60 mb-6">
                  Upload and analyze a file first to start generating reports
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200"
                >
                  Upload File
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Select Data File
                  </label>
                  <div className="space-y-3">
                    {uploads.map((upload) => {
                      const dataPoints = upload.jsonData ? 
                        (typeof upload.jsonData === 'string' ? JSON.parse(upload.jsonData) : upload.jsonData).length : 0;
                      
                      return (
                        <SpotlightCard
                          key={upload._id}
                          className={`bg-white/5 backdrop-blur-sm rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                            selectedUpload?._id === upload._id 
                              ? 'border-pigmentgreen-500/50 bg-pigmentgreen-500/10' 
                              : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                          }`}
                          onClick={() => {
                            setSelectedUpload(upload);
                            loadAnalysisForUpload(upload._id);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-base mb-1 truncate">
                                {upload.originalName}
                              </h4>
                              <p className="text-white/60 text-sm">
                                {dataPoints.toLocaleString()} rows • {new Date(upload.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="ml-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                <FiCheck className="w-3 h-3 mr-1" />
                                Ready
                              </span>
                            </div>
                          </div>
                        </SpotlightCard>
                      );
                    })}
                  </div>
                </div>

                {/* Template Selection */}
                {selectedUpload && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Report Template
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {templates.map((template) => (
                        <label
                          key={template.id}
                          className={`relative flex cursor-pointer rounded-xl p-4 border transition-all duration-200 ${
                            selectedTemplate === template.id
                              ? 'border-pigmentgreen-500/50 bg-pigmentgreen-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm">{template.name}</h4>
                            <p className="text-white/60 text-xs mt-1">{template.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                              selectedTemplate === template.id
                                ? 'border-pigmentgreen-500 bg-pigmentgreen-500'
                                : 'border-white/30'
                            }`}>
                              {selectedTemplate === template.id && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Instructions */}
                {selectedUpload && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Custom Instructions (Optional)
                    </label>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add specific requirements or focus areas for your report..."
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pigmentgreen-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                )}

                {/* Generate Button */}
                {selectedUpload && (
                  <div className="pt-2">
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGenerating || !analysisData}
                      className="w-full bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Generating Report...
                        </>
                      ) : !analysisData ? (
                        <>
                          <FiLoader className="mr-3 w-5 h-5" />
                          Loading Analysis...
                        </>
                      ) : (
                        <>
                          <FiFileText className="mr-3 w-5 h-5" />
                          Generate Report
                        </>
                      )}
                    </button>
                    
                    {isGenerating && (
                      <div className="mt-4 p-4 bg-pigmentgreen-500/10 border border-pigmentgreen-500/20 rounded-xl">
                        <div className="flex items-center text-pigmentgreen-400 text-sm">
                          <div className="animate-pulse w-2 h-2 bg-pigmentgreen-400 rounded-full mr-2"></div>
                          Creating your professional report... This may take a few moments.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reports List Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FiFileText className="mr-3 w-6 h-6 text-pigmentgreen-400" />
              Generated Reports
            </h2>
            
            {reports.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiFileText className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No reports yet</h3>
                <p className="text-white/60">
                  Generate your first report from analyzed data to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <SpotlightCard
                    key={report._id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-lg mb-2 truncate">
                          {report.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <span>
                            <FiClock className="inline w-4 h-4 mr-1" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : report.status === 'failed'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {report.status === 'completed' && (
                        <>
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                          >
                            <FiEye className="mr-2 w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadReport(report._id)}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                          >
                            <FiDownload className="mr-2 w-4 h-4" />
                            Download
                          </button>
                        </>
                      )}
                      {report.status === 'failed' && (
                        <button
                          onClick={() => handleGenerateReport()}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          <FiRefreshCw className="mr-2 w-4 h-4" />
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="p-2 text-white/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete Report"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
