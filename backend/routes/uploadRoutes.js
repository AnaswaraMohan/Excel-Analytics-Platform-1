const express = require('express');
const router = express.Router();
const { 
  uploadExcel, 
  getUserUploads, 
  getUploadById, 
  deleteUpload, 
  retryAnalysis 
} = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMulter');

// Upload Excel file with error handling
router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 10MB.'
        });
      } else if (err.message.includes('Only Excel files')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only Excel files (.xls, .xlsx) are allowed.'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload error'
        });
      }
    }
    next();
  });
}, uploadExcel);

// Get user's uploads
router.get('/', protect, getUserUploads);

// Get specific upload by ID
router.get('/:id', protect, getUploadById);

// Delete upload
router.delete('/:id', protect, deleteUpload);

// Retry analysis for failed uploads
router.post('/:id/analyze', protect, retryAnalysis);

module.exports = router;
