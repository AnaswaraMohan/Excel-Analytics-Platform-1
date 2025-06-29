import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaShare, FaCog } from 'react-icons/fa';
import DataColumnSelector from '../components/DataColumnSelector';
import ChartRenderer from '../components/ChartRenderer';
import { getUploadById } from '../services/uploadService';
import { toast } from 'react-toastify';

const DataVisualization = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [uploadData, setUploadData] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chart configuration state
  const [chartConfig, setChartConfig] = useState({
    xAxisKey: '',
    yAxisKey: '',
    chartType: 'line'
  });

  useEffect(() => {
    const fetchUploadData = async () => {
      try {
        setLoading(true);
        const data = await getUploadById(id);
        setUploadData(data);
        
        // Parse the JSON data if it's stored as a string
        if (data.jsonData) {
          const parsedData = typeof data.jsonData === 'string' 
            ? JSON.parse(data.jsonData) 
            : data.jsonData;
          setJsonData(parsedData);
        }
      } catch (err) {
        setError('Failed to load upload data');
        toast.error('Failed to load upload data');
        console.error('Error fetching upload data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUploadData();
    }
  }, [id]);

  const handleAxisChange = (axisConfig) => {
    setChartConfig(prev => ({
      ...prev,
      ...axisConfig
    }));
  };

  const handleChartTypeChange = (chartType) => {
    setChartConfig(prev => ({
      ...prev,
      chartType
    }));
  };

  const handleExportChart = () => {
    // TODO: Implement chart export functionality
    toast.info('Chart export feature coming soon!');
  };

  const handleShareChart = () => {
    // TODO: Implement chart sharing functionality
    toast.info('Chart sharing feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visualization data...</p>
        </div>
      </div>
    );
  }

  if (error || !uploadData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested upload data could not be found.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Data Visualization
                </h1>
                <p className="text-sm text-gray-500">
                  {uploadData.originalName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportChart}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
              <button
                onClick={handleShareChart}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaShare className="mr-2" />
                Share
              </button>
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <FaCog className="mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chart Configuration */}
          <div className="lg:col-span-1">
            <DataColumnSelector
              jsonData={jsonData}
              onAxisChange={handleAxisChange}
              onChartTypeChange={handleChartTypeChange}
            />
          </div>

          {/* Right Column - Chart Display */}
          <div className="lg:col-span-2">
            <ChartRenderer
              jsonData={jsonData}
              xAxisKey={chartConfig.xAxisKey}
              yAxisKey={chartConfig.yAxisKey}
              chartType={chartConfig.chartType}
            />
          </div>
        </div>

        {/* Data Summary */}
        {jsonData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{jsonData.length}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(jsonData[0] || {}).length}
                </div>
                <div className="text-sm text-gray-600">Total Columns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {uploadData.fileSize ? `${(uploadData.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">File Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {new Date(uploadData.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Upload Date</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataVisualization; 