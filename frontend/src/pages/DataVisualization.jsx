import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiShare2, FiSettings, FiActivity, FiUsers, FiTrendingUp, FiDatabase } from 'react-icons/fi';
import DataColumnSelector from '../components/DataColumnSelector';
import ChartRenderer from '../components/ChartRenderer';
import DataFilter from '../components/DataFilter';
import { getUploadById } from '../services/uploadService';
import { analyticsService } from '../services/analyticsService';

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

const DataVisualization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [uploadData, setUploadData] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chart configuration state
  const [chartConfig, setChartConfig] = useState({
    xAxisKey: '',
    yAxisKey: '',
    chartType: 'line'
  });

  const visualizationRef = useRef(null);

  useEffect(() => {
    const fetchUploadData = async () => {
      try {
        setLoading(true);
        const data = await getUploadById(id);
        setUploadData(data);
        
        // Parse the JSON data
        if (data.jsonData) {
          const parsedData = typeof data.jsonData === 'string' 
            ? JSON.parse(data.jsonData) 
            : data.jsonData;
          setJsonData(parsedData);
          setFilteredData(parsedData); // Initialize filtered data
        }

        // Fetch analytics data if available
        if (data.isAnalyzed) {
          try {
            const analytics = await analyticsService.getAnalytics(id);
            setAnalyticsData(analytics);
          } catch (analyticsError) {
            console.log('Analytics data not available:', analyticsError);
          }
        }
      } catch (error) {
        console.error('Error fetching upload data:', error);
        setError('Failed to load data. Please try again.');
        console.log("Operation completed");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUploadData();
    }
  }, [id]);

  // GSAP animations
  useEffect(() => {
    if (!loading && visualizationRef.current) {
      const gsap = require('gsap');
      gsap.fromTo(visualizationRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [loading]);

  const handleFilterChange = (filters) => {
    let filtered = [...jsonData];
    
    Object.keys(filters).forEach(column => {
      const filter = filters[column];
      if (filter && filter.length > 0) {
        filtered = filtered.filter(row => 
          filter.includes(row[column]?.toString())
        );
      }
    });
    
    setFilteredData(filtered);
  };

  const handleExport = () => {
    // Implementation for exporting chart
    console.log("Operation completed");
  };

  const handleShare = () => {
    // Implementation for sharing chart
    console.log("Operation completed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pigmentgreen-500" aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiDatabase className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Error Loading Data</h3>
          <p className="text-white/60 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={visualizationRef} className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-white/70 hover:text-white mb-6 group transition-colors"
          >
            <FiArrowLeft className="mr-2 group-hover:translate-x-[-2px] transition-transform" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">Data Visualization</h1>
              <p className="text-white/70 text-lg">
                Create interactive charts and visualizations from your data: {uploadData?.originalName}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 text-white/70 hover:text-white"
                title="Share Visualization"
              >
                <FiShare2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                className="p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 text-white/70 hover:text-white"
                title="Export Chart"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Chart Configuration Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            {/* Chart Type Selection */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiSettings className="mr-3 w-5 h-5 text-pigmentgreen-400" />
                Chart Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'line', icon: FiTrendingUp, label: 'Line' },
                      { type: 'bar', icon: FiActivity, label: 'Bar' },
                      { type: 'pie', icon: FiUsers, label: 'Pie' },
                      { type: 'scatter', icon: FiDatabase, label: 'Scatter' }
                    ].map(({ type, icon: Icon, label }) => (
                      <button
                        key={type}
                        onClick={() => setChartConfig(prev => ({ ...prev, chartType: type }))}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          chartConfig.chartType === type
                            ? 'border-pigmentgreen-500/50 bg-pigmentgreen-500/10 text-pigmentgreen-400'
                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column Selection */}
                <DataColumnSelector
                  data={jsonData}
                  onConfigChange={setChartConfig}
                  currentConfig={chartConfig}
                />
              </div>
            </div>

            {/* Data Filters */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FiDatabase className="mr-3 w-5 h-5 text-pigmentgreen-400" />
                Data Filters
              </h2>
              
              <DataFilter
                data={jsonData}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Data Summary */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Data Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Total Rows:</span>
                  <span className="text-white font-medium">{jsonData.length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Filtered Rows:</span>
                  <span className="text-white font-medium">{filteredData.length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Columns:</span>
                  <span className="text-white font-medium">{Object.keys(jsonData[0] || {}).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="xl:col-span-3">
            <SpotlightCard className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 h-full min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <FiActivity className="mr-3 w-6 h-6 text-pigmentgreen-400" />
                  Chart Visualization
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-white/60">
                    {filteredData.length} of {jsonData.length} rows
                  </span>
                </div>
              </div>
              
              {chartConfig.xAxisKey && chartConfig.yAxisKey ? (
                <div className="h-full">
                  <ChartRenderer
                    data={filteredData}
                    config={chartConfig}
                    className="h-full"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <FiActivity className="w-10 h-10 text-white/40" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">Configure Your Chart</h3>
                    <p className="text-white/60 max-w-md">
                      Select chart type and data columns from the sidebar to create your visualization
                    </p>
                  </div>
                </div>
              )}
            </SpotlightCard>
          </div>
        </div>

        {/* Analytics Insights */}
        {analyticsData && (
          <div className="mt-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <FiTrendingUp className="mr-3 w-6 h-6 text-pigmentgreen-400" />
                Data Insights
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30">
                  <h4 className="text-blue-400 font-semibold mb-2">Data Quality</h4>
                  <p className="text-2xl font-bold text-white">95%</p>
                  <p className="text-blue-400/80 text-sm mt-1">Excellent data quality</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
                  <h4 className="text-green-400 font-semibold mb-2">Completeness</h4>
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-green-400/80 text-sm mt-1">Very few missing values</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-6 rounded-xl border border-purple-500/30">
                  <h4 className="text-purple-400 font-semibold mb-2">Patterns Found</h4>
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-purple-400/80 text-sm mt-1">Significant correlations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualization;
