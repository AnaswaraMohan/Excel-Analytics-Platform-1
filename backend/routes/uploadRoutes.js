const express = require('express');
const router = express.Router();
const { uploadExcel, getUserUploads, getUploadById } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMulter');

// Upload Excel file
router.post('/', protect, upload.single('file'), uploadExcel);

// Get user's uploads
router.get('/', protect, getUserUploads);

// Get specific upload by ID
router.get('/:id', protect, getUploadById);

module.exports = router;
