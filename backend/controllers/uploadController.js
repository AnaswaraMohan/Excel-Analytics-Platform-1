const asyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Upload = require('../models/Upload');
const analyticsService = require('../services/analyticsService');

// @desc    Upload and parse Excel file with auto-analysis
// @route   POST /api/upload
// @access  Private
const uploadExcel = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const filename = req.file.filename;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    
    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];
    
    // Convert the first sheet to JSON
    const worksheet = workbook.Sheets[sheetName];
    let parsedData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    // Sanitize headers and data
    parsedData = parsedData.map(row => {
      const sanitizedRow = {};
      Object.keys(row).forEach(key => {
        // Trim and sanitize header names
        const sanitizedKey = key.toString().trim().replace(/[^\w\s-]/g, '');
        sanitizedRow[sanitizedKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
      });
      return sanitizedRow;
    });

    // Save to database with new schema
    const upload = await Upload.create({
      user: req.user.id,
      filename: filename,
      originalName: originalName,
      parsedData: parsedData, // Keep for backward compatibility
      jsonData: parsedData, // New structured field
      fileSize: fileSize,
      mimeType: mimeType,
      analysisStatus: 'pending'
    });

    // Delete the uploaded file after processing (keep database permanently)
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Start automatic analysis in background
    setImmediate(async () => {
      try {
        await performAutoAnalysis(upload._id, parsedData);
      } catch (error) {
        console.error('Auto-analysis failed:', error);
        await Upload.findByIdAndUpdate(upload._id, {
          analysisStatus: 'failed',
          analysisResults: { error: error.message }
        });
      }
    });

    // Send response with preview data (first 10 rows)
    const previewData = parsedData.slice(0, 10);
    
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully. Analysis started in background.',
      data: {
        uploadId: upload._id,
        originalName: originalName,
        totalRows: parsedData.length,
        previewData: previewData,
        columns: parsedData.length > 0 ? Object.keys(parsedData[0]) : [],
        fileSize: fileSize,
        analysisStatus: 'pending'
      }
    });

  } catch (error) {
    // Clean up file if error occurs
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file after error:', err);
      });
    }
    
    res.status(500);
    throw new Error(error.message || 'Error processing Excel file');
  }
});

// Perform automatic analysis
const performAutoAnalysis = async (uploadId, jsonData) => {
  try {
    // Update status to processing
    await Upload.findByIdAndUpdate(uploadId, {
      analysisStatus: 'processing'
    });

    // Perform comprehensive analysis
    const analysisResults = await analyticsService.analyzeData(jsonData, {
      uploadId: uploadId
    });

    // Generate AI insights
    const aiInsights = await analyticsService.generateInsights(analysisResults, {
      uploadId: uploadId,
      rowCount: jsonData.length,
      columnCount: Object.keys(jsonData[0] || {}).length
    });

    // Update upload record with analysis results
    await Upload.findByIdAndUpdate(uploadId, {
      analysisStatus: 'completed',
      isAnalyzed: true,
      analysisResults: analysisResults,
      aiInsights: aiInsights,
      lastAnalyzedAt: new Date()
    });

    console.log(`Auto-analysis completed for upload ${uploadId}`);
  } catch (error) {
    console.error(`Auto-analysis failed for upload ${uploadId}:`, error);
    await Upload.findByIdAndUpdate(uploadId, {
      analysisStatus: 'failed',
      analysisResults: { error: error.message, failedAt: new Date() }
    });
  }
};

// @desc    Get user's uploaded files
// @route   GET /api/upload
// @access  Private
const getUserUploads = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ user: req.user.id })
    .select('originalName uploadedAt jsonData fileSize analysisStatus isAnalyzed lastAnalyzedAt createdAt')
    .sort({ uploadedAt: -1 });

  const uploadsWithStats = uploads.map(upload => ({
    _id: upload._id,
    originalName: upload.originalName,
    uploadedAt: upload.uploadedAt,
    createdAt: upload.createdAt,
    totalRows: upload.jsonData ? upload.jsonData.length : 0,
    columns: upload.jsonData && upload.jsonData.length > 0 ? Object.keys(upload.jsonData[0]) : [],
    fileSize: upload.fileSize,
    analysisStatus: upload.analysisStatus,
    isAnalyzed: upload.isAnalyzed,
    lastAnalyzedAt: upload.lastAnalyzedAt
  }));

  res.json({
    success: true,
    data: uploadsWithStats
  });
});

// @desc    Get specific upload data with analysis results
// @route   GET /api/upload/:id
// @access  Private
const getUploadById = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  res.json({
    success: true,
    data: {
      _id: upload._id,
      originalName: upload.originalName,
      uploadedAt: upload.uploadedAt,
      createdAt: upload.createdAt,
      totalRows: upload.jsonData ? upload.jsonData.length : 0,
      columns: upload.jsonData && upload.jsonData.length > 0 ? Object.keys(upload.jsonData[0]) : [],
      jsonData: upload.jsonData,
      fileSize: upload.fileSize,
      mimeType: upload.mimeType,
      analysisStatus: upload.analysisStatus,
      isAnalyzed: upload.isAnalyzed,
      analysisResults: upload.analysisResults,
      aiInsights: upload.aiInsights,
      lastAnalyzedAt: upload.lastAnalyzedAt,
      reports: upload.reports || []
    }
  });
});

// @desc    Delete upload and all associated data
// @route   DELETE /api/upload/:id
// @access  Private
const deleteUpload = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  await Upload.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Upload deleted successfully'
  });
});

// @desc    Retry analysis for failed uploads
// @route   POST /api/upload/:id/analyze
// @access  Private
const retryAnalysis = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  if (!upload.jsonData || upload.jsonData.length === 0) {
    res.status(400);
    throw new Error('No data available for analysis');
  }

  // Start analysis in background
  setImmediate(async () => {
    try {
      await performAutoAnalysis(upload._id, upload.jsonData);
    } catch (error) {
      console.error('Retry analysis failed:', error);
    }
  });

  res.json({
    success: true,
    message: 'Analysis restarted successfully',
    data: {
      uploadId: upload._id,
      analysisStatus: 'pending'
    }
  });
});

module.exports = {
  uploadExcel,
  getUserUploads,
  getUploadById,
  deleteUpload,
  retryAnalysis
};
