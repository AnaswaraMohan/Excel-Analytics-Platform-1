const express = require('express');
const router = express.Router();
const { updateProfile, deleteProfile } = require('../controllers/usersController');
const { protect } = require('../middleware/authMiddleware');

// Update user profile
router.patch('/profile', protect, updateProfile);

// Delete user profile
router.delete('/profile', protect, deleteProfile);

module.exports = router; 