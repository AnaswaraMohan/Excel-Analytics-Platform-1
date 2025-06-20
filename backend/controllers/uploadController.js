const asyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Upload = require('../models/Upload');

// @desc    Upload and parse Excel file
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

    // Save to database
    const upload = await Upload.create({
      user: req.user.id,
      filename: filename,
      originalName: originalName,
      parsedData: parsedData
    });

    // Delete the uploaded file after processing (optional)
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Send response with preview data (first 10 rows)
    const previewData = parsedData.slice(0, 10);
    
    res.status(201).json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        uploadId: upload._id,
        originalName: originalName,
        totalRows: parsedData.length,
        previewData: previewData,
        columns: parsedData.length > 0 ? Object.keys(parsedData[0]) : []
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

// @desc    Get user's uploaded files
// @route   GET /api/upload
// @access  Private
const getUserUploads = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ user: req.user.id })
    .select('originalName uploadedAt parsedData')
    .sort({ uploadedAt: -1 });

  const uploadsWithStats = uploads.map(upload => ({
    _id: upload._id,
    originalName: upload.originalName,
    uploadedAt: upload.uploadedAt,
    totalRows: upload.parsedData.length,
    columns: upload.parsedData.length > 0 ? Object.keys(upload.parsedData[0]) : []
  }));

  res.json({
    success: true,
    data: uploadsWithStats
  });
});

// @desc    Get specific upload data
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
      totalRows: upload.parsedData.length,
      columns: upload.parsedData.length > 0 ? Object.keys(upload.parsedData[0]) : [],
      parsedData: upload.parsedData
    }
  });
});

module.exports = {
  uploadExcel,
  getUserUploads,
  getUploadById
};
