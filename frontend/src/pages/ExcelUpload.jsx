import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUpload, FiEye, FiArrowLeft, FiCheck } from 'react-icons/fi';
import FileDropzone from '../components/FileDropzone';
import { uploadExcelFile } from '../services/uploadService';

const ExcelUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadResult(null); // Clear previous results
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadExcelFile(selectedFile);
      setUploadResult(result.data);
      toast.success('File uploaded and processed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Error uploading file';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleProceedToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Upload Excel File</h1>
          <p className="text-gray-600 mt-2">
            Upload your Excel file to analyze and visualize your data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Select File
            </h2>
            
            <FileDropzone
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onRemoveFile={handleRemoveFile}
            />

            {selectedFile && (
              <div className="mt-6">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2" />
                      Upload & Process
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Data Preview
            </h2>
            
            {!uploadResult ? (
              <div className="text-center py-12 text-gray-500">
                <FiEye className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Upload a file to see preview</p>
              </div>
            ) : (
              <div>
                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">
                      File processed successfully!
                    </span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    {uploadResult.totalRows} rows imported from "{uploadResult.originalName}"
                  </p>
                </div>

                {/* Data Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Rows</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {uploadResult.totalRows}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Columns</p>
                    <p className="text-2xl font-bold text-green-900">
                      {uploadResult.columns.length}
                    </p>
                  </div>
                </div>

                {/* Column Names */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Columns Detected:</h3>
                  <div className="flex flex-wrap gap-2">
                    {uploadResult.columns.map((column, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        {column}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Preview Table */}
                {uploadResult.previewData.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Data Preview (First {uploadResult.previewData.length} rows):
                    </h3>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {uploadResult.columns.map((column, index) => (
                              <th
                                key={index}
                                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {uploadResult.previewData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                              {uploadResult.columns.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="px-4 py-2 text-sm text-gray-900"
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
                <div className="mt-6">
                  <button
                    onClick={handleProceedToDashboard}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                  >
                    <FiCheck className="mr-2" />
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
