const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAnalyticsOverview,
  getInsights,
  regenerateAnalysis,
  getDataQuality
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Analytics overview route (must come before specific routes)
router.get('/overview', getAnalyticsOverview);

// Main analytics routes
router.get('/:uploadId', getAnalytics);                       // Get analysis results
router.get('/:uploadId/insights', getInsights);              // Get AI insights
router.get('/:uploadId/quality', getDataQuality);            // Get data quality metrics
router.post('/:uploadId/regenerate', regenerateAnalysis);    // Regenerate analysis

module.exports = router;
