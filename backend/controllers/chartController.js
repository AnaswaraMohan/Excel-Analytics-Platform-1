const asyncHandler = require('express-async-handler');
const Chart = require('../models/Chart');
const Upload = require('../models/Upload');

// @desc    Save chart metadata
// @route   POST /api/charts
// @access  Private
const saveChart = asyncHandler(async (req, res) => {
  const { uploadId, chartType, xAxisKey, yAxisKey, chartConfig } = req.body;

  // Validate required fields
  if (!uploadId || !chartType || !xAxisKey || !yAxisKey) {
    res.status(400);
    throw new Error('Missing required chart data');
  }

  // Verify upload belongs to user
  const upload = await Upload.findOne({
    _id: uploadId,
    user: req.user.id
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  // Create chart record
  const chart = await Chart.create({
    user: req.user.id,
    upload: uploadId,
    chartType,
    xAxisKey,
    yAxisKey,
    chartConfig: chartConfig || {}
  });

  res.status(201).json({
    success: true,
    data: chart,
    message: 'Chart metadata saved successfully'
  });
});

// @desc    Update chart export timestamp
// @route   PUT /api/charts/:id/export
// @access  Private
const markChartExported = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!chart) {
    res.status(404);
    throw new Error('Chart not found');
  }

  chart.exportedAt = new Date();
  await chart.save();

  res.json({
    success: true,
    data: chart,
    message: 'Chart export recorded'
  });
});

// @desc    Get user's charts
// @route   GET /api/charts
// @access  Private
const getUserCharts = asyncHandler(async (req, res) => {
  const charts = await Chart.find({ user: req.user.id })
    .populate('upload', 'originalName uploadedAt')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: charts
  });
});

// @desc    Get chart by ID
// @route   GET /api/charts/:id
// @access  Private
const getChartById = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('upload', 'originalName uploadedAt parsedData');

  if (!chart) {
    res.status(404);
    throw new Error('Chart not found');
  }

  res.json({
    success: true,
    data: chart
  });
});

// @desc    Delete chart
// @route   DELETE /api/charts/:id
// @access  Private
const deleteChart = asyncHandler(async (req, res) => {
  const chart = await Chart.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!chart) {
    res.status(404);
    throw new Error('Chart not found');
  }

  await Chart.deleteOne({ _id: req.params.id });

  res.json({
    success: true,
    message: 'Chart deleted successfully'
  });
});

module.exports = {
  saveChart,
  markChartExported,
  getUserCharts,
  getChartById,
  deleteChart
};
