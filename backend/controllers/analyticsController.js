const asyncHandler = require('express-async-handler');
const Upload = require('../models/Upload');
const analyticsService = require('../services/analyticsService');

// @desc    Get analytics data for a specific upload
// @route   GET /api/analytics/:uploadId
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  // Check if analysis is completed
  if (!upload.isAnalyzed || upload.analysisStatus !== 'completed') {
    return res.json({
      success: true,
      data: {
        uploadId: upload._id,
        originalName: upload.originalName,
        analysisStatus: upload.analysisStatus,
        isAnalyzed: upload.isAnalyzed,
        message: upload.analysisStatus === 'processing' 
          ? 'Analysis in progress' 
          : upload.analysisStatus === 'failed'
          ? 'Analysis failed - please retry'
          : 'Analysis pending'
      }
    });
  }

  res.json({
    success: true,
    data: {
      uploadId: upload._id,
      originalName: upload.originalName,
      analysisStatus: upload.analysisStatus,
      isAnalyzed: upload.isAnalyzed,
      lastAnalyzedAt: upload.lastAnalyzedAt,
      analysisResults: upload.analysisResults,
      aiInsights: upload.aiInsights,
      metadata: {
        totalRows: upload.jsonData ? upload.jsonData.length : 0,
        totalColumns: upload.jsonData && upload.jsonData.length > 0 ? Object.keys(upload.jsonData[0]).length : 0,
        fileSize: upload.fileSize,
        uploadedAt: upload.uploadedAt
      }
    }
  });
});

// @desc    Get analytics overview for all user uploads
// @route   GET /api/analytics/overview
// @access  Private
const getAnalyticsOverview = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ 
    user: req.user.id,
    isAnalyzed: true 
  }).select('originalName analysisResults uploadedAt fileSize jsonData');

  if (uploads.length === 0) {
    return res.json({
      success: true,
      data: {
        totalAnalyzedFiles: 0,
        totalDataPoints: 0,
        averageDataQuality: 0,
        uploads: [],
        summary: 'No analyzed files found'
      }
    });
  }

  // Calculate overview statistics
  const totalDataPoints = uploads.reduce((total, upload) => {
    return total + (upload.jsonData ? upload.jsonData.length : 0);
  }, 0);

  const dataQualityScores = uploads
    .map(upload => upload.analysisResults?.dataQuality?.overall_score)
    .filter(score => score !== undefined);

  const averageDataQuality = dataQualityScores.length > 0 
    ? dataQualityScores.reduce((sum, score) => sum + score, 0) / dataQualityScores.length 
    : 0;

  const uploadSummaries = uploads.map(upload => ({
    uploadId: upload._id,
    originalName: upload.originalName,
    uploadedAt: upload.uploadedAt,
    dataQuality: upload.analysisResults?.dataQuality?.overall_score || 0,
    rowCount: upload.jsonData ? upload.jsonData.length : 0,
    columnCount: upload.jsonData && upload.jsonData.length > 0 ? Object.keys(upload.jsonData[0]).length : 0,
    fileSize: upload.fileSize,
    insights: upload.aiInsights?.insights?.length || 0
  }));

  res.json({
    success: true,
    data: {
      totalAnalyzedFiles: uploads.length,
      totalDataPoints,
      averageDataQuality: Math.round(averageDataQuality * 100) / 100,
      uploads: uploadSummaries,
      summary: `${uploads.length} files analyzed with ${totalDataPoints} total data points`
    }
  });
});

// @desc    Get specific analysis insights
// @route   GET /api/analytics/:uploadId/insights
// @access  Private
const getInsights = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  }).select('originalName aiInsights analysisStatus isAnalyzed');

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  if (!upload.isAnalyzed || !upload.aiInsights) {
    return res.json({
      success: true,
      data: {
        uploadId: upload._id,
        originalName: upload.originalName,
        analysisStatus: upload.analysisStatus,
        insights: [],
        message: 'AI insights not available yet'
      }
    });
  }

  res.json({
    success: true,
    data: {
      uploadId: upload._id,
      originalName: upload.originalName,
      insights: upload.aiInsights.insights || [],
      fullResponse: upload.aiInsights.fullResponse,
      generatedAt: upload.aiInsights.generatedAt,
      model: upload.aiInsights.model
    }
  });
});

// @desc    Regenerate analysis for an upload
// @route   POST /api/analytics/:uploadId/regenerate
// @access  Private
const regenerateAnalysis = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
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

  // Update status to processing
  await Upload.findByIdAndUpdate(upload._id, {
    analysisStatus: 'processing',
    isAnalyzed: false
  });

  // Start analysis in background
  setImmediate(async () => {
    try {
      const analysisResults = await analyticsService.analyzeData(upload.jsonData, {
        uploadId: upload._id
      });

      const aiInsights = await analyticsService.generateInsights(analysisResults, {
        uploadId: upload._id,
        rowCount: upload.jsonData.length,
        columnCount: Object.keys(upload.jsonData[0] || {}).length
      });

      await Upload.findByIdAndUpdate(upload._id, {
        analysisStatus: 'completed',
        isAnalyzed: true,
        analysisResults: analysisResults,
        aiInsights: aiInsights,
        lastAnalyzedAt: new Date()
      });

      console.log(`Analysis regenerated for upload ${upload._id}`);
    } catch (error) {
      console.error(`Analysis regeneration failed for upload ${upload._id}:`, error);
      await Upload.findByIdAndUpdate(upload._id, {
        analysisStatus: 'failed',
        analysisResults: { error: error.message, failedAt: new Date() }
      });
    }
  });

  res.json({
    success: true,
    message: 'Analysis regeneration started',
    data: {
      uploadId: upload._id,
      analysisStatus: 'processing'
    }
  });
});

// @desc    Get data quality metrics
// @route   GET /api/analytics/:uploadId/quality
// @access  Private
const getDataQuality = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  }).select('originalName analysisResults isAnalyzed');

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  if (!upload.isAnalyzed || !upload.analysisResults?.dataQuality) {
    return res.json({
      success: true,
      data: {
        uploadId: upload._id,
        originalName: upload.originalName,
        dataQuality: null,
        message: 'Data quality analysis not available yet'
      }
    });
  }

  res.json({
    success: true,
    data: {
      uploadId: upload._id,
      originalName: upload.originalName,
      dataQuality: upload.analysisResults.dataQuality
    }
  });
});

module.exports = {
  getAnalytics,
  getAnalyticsOverview,
  getInsights,
  regenerateAnalysis,
  getDataQuality
};
