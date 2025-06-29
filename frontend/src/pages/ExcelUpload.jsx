import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiEye, FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi';
import FileDropzone from '../components/FileDropzone';
import { uploadExcelFile } from '../services/uploadService';

const ExcelUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("Operation completed");
      navigate('/login');
      return;
    }
    console.log('Auth token found:', token ? 'Yes' : 'No');
  }, [navigate]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadResult(null); // Clear previous results
    setError(null); // Clear previous errors
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log("Operation completed");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      console.log('Starting upload for file:', selectedFile.name);
      const result = await uploadExcelFile(selectedFile);
      console.log('Upload successful:', result);
      
      setUploadResult(result.data);
      console.log("Operation completed");
    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMessage = 'Error uploading file';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your connection and try again';
      } else {
        // Other error
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      console.log("Operation completed");
    } finally {
      setUploading(false);
    }
  };

  const handleProceedToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black">
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
            <h1 className="text-4xl font-bold text-white mb-3">Upload Excel File</h1>
            <p className="text-white/70 text-lg">
              Upload your Excel file to analyze and visualize your data with AI-powered insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FiUpload className="mr-3 w-6 h-6 text-pigmentgreen-400" />
              Select File
            </h2>
            
            <FileDropzone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
            />

            {error && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <div className="flex items-center">
                  <FiAlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <h4 className="text-red-400 font-medium">Upload Failed</h4>
                    <p className="text-red-400/80 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedFile && (
              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-pigmentgreen-500 to-malachite-500 text-white py-4 px-6 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing File...
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-3 w-5 h-5" />
                      Upload & Process
                    </>
                  )}
                </button>
                
                {uploading && (
                  <div className="mt-4 p-4 bg-pigmentgreen-500/10 border border-pigmentgreen-500/20 rounded-xl">
                    <div className="flex items-center text-pigmentgreen-400 text-sm">
                      <div className="animate-pulse w-2 h-2 bg-pigmentgreen-400 rounded-full mr-2"></div>
                      Processing your file... This may take a few moments.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FiEye className="mr-3 w-6 h-6 text-pigmentgreen-400" />
              Data Preview
            </h2>
            
            {!uploadResult ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FiEye className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Ready for Upload</h3>
                <p className="text-white/60">
                  Upload a file to see preview and analysis results
                </p>
              </div>
            ) : (
              <div>
                {/* Success Message */}
                <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/50 rounded-xl p-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mr-4">
                      <FiCheck className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-emerald-400 font-semibold text-lg">
                        File processed successfully!
                      </h4>
                      <p className="text-emerald-400/80 text-sm mt-1">
                        {uploadResult.totalRows} rows imported from "{uploadResult.originalName}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30">
                    <p className="text-blue-400 font-medium text-sm mb-2">Total Rows</p>
                    <p className="text-3xl font-bold text-white">
                      {uploadResult.totalRows.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
                    <p className="text-green-400 font-medium text-sm mb-2">Columns</p>
                    <p className="text-3xl font-bold text-white">
                      {uploadResult.columns.length}
                    </p>
                  </div>
                </div>

                {/* Column Names */}
                <div className="mb-8">
                  <h3 className="font-semibold text-white mb-4 text-lg">Columns Detected:</h3>
                  <div className="flex flex-wrap gap-3">
                    {uploadResult.columns.map((column, index) => (
                      <span
                        key={index}
                        className="bg-white/10 px-4 py-2 rounded-xl text-sm text-white/80 border border-white/20 backdrop-blur-sm"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Preview Table */}
                {uploadResult.previewData.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-white mb-4 text-lg">
                      Data Preview (First {uploadResult.previewData.length} rows):
                    </h3>
                    <div className="overflow-x-auto border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm">
                      <table className="min-w-full">
                        <thead className="bg-white/10">
                          <tr>
                            {uploadResult.columns.map((column, index) => (
                              <th
                                key={index}
                                className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider border-b border-white/10"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {uploadResult.previewData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                              {uploadResult.columns.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="px-6 py-4 text-sm text-white/70"
                                >
                                  {row[column] || '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-8">
                  <button
                    onClick={handleProceedToDashboard}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 px-6 rounded-xl hover:shadow-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center"
                  >
                    <FiCheck className="mr-3 w-5 h-5" />
                    Proceed to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;
