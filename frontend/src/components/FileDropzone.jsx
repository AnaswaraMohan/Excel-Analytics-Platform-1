import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

const FileDropzone = ({ onFileSelect, selectedFile, onRemoveFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Check file type
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedExtensions = ['.xls', '.xlsx'];
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      console.log('Please select only Excel files (.xls or .xlsx)');
      return;
    }
    
    // Check file size (10MB limit - increased from 5MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log("Operation completed");
      return;
    }
    
    console.log("Operation completed");
    onFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
            ${isDragging 
              ? 'border-pigmentgreen-500 bg-pigmentgreen-500/10 scale-[1.02]' 
              : 'border-white/20 hover:border-pigmentgreen-400 hover:bg-white/5'
            }
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging ? 'bg-pigmentgreen-500' : 'bg-gradient-to-br from-pigmentgreen-500 to-malachite-500'
          }`}>
            <FiUpload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            Drop your Excel file here
          </h3>
          <p className="text-white/70 mb-4 text-base">
            or click to browse files
          </p>
          <p className="text-white/50 text-sm">
            Supports .xls and .xlsx files up to 10MB
          </p>
        </div>
      ) : (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <FiFile className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-lg">{selectedFile.name}</p>
                <p className="text-white/60 text-sm">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={onRemoveFile}
              className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
              title="Remove file"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
