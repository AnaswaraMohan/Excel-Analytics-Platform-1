const express = require('express');
const router = express.Router();
const {
  generateReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  exportReportTxt,
  exportReportPdf,
  getReportsOverview,
  getReportTemplates
} = require('../controllers/reportsController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (auth required)
router.use(protect);

// Template and overview routes (must come before specific routes)
router.get('/templates', getReportTemplates);         // Get available templates
router.get('/overview', getReportsOverview);          // Get user's reports overview

// Upload-specific report routes
router.post('/:uploadId', generateReport);            // Generate new report for upload
router.get('/:uploadId', getReports);                 // Get all reports for upload
router.get('/:uploadId/:reportId', getReport);        // Get specific report
router.put('/:uploadId/:reportId', updateReport);     // Update report
router.delete('/:uploadId/:reportId', deleteReport);  // Delete report

// Export routes
router.get('/:uploadId/:reportId/export/txt', exportReportTxt);  // Export as text
router.get('/:uploadId/:reportId/export/pdf', exportReportPdf);  // Export as PDF

module.exports = router;
