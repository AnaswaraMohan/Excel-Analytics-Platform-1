const express = require('express');
const router = express.Router();
const {
  saveChart,
  markChartExported,
  getUserCharts,
  getChartById,
  deleteChart
} = require('../controllers/chartController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Chart metadata routes
router.route('/')
  .post(saveChart)
  .get(getUserCharts);

router.route('/:id')
  .get(getChartById)
  .delete(deleteChart);

router.put('/:id/export', markChartExported);

module.exports = router;
