const asyncHandler = require('express-async-handler');
const Upload = require('../models/Upload');
const GeminiService = require('../services/geminiService');
const { v4: uuidv4 } = require('uuid');

const geminiService = new GeminiService();

// @desc    Generate a new report for an upload
// @route   POST /api/reports/:uploadId
// @access  Private
const generateReport = asyncHandler(async (req, res) => {
  const { template = 'detailed', customPrompt } = req.body;
  
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  if (!upload.isAnalyzed || !upload.analysisResults) {
    res.status(400);
    throw new Error('Upload must be analyzed before generating reports');
  }

  try {
    // Generate report using Gemini
    const reportData = await geminiService.generateBusinessReport(
      upload.analysisResults,
      {
        originalName: upload.originalName,
        rowCount: upload.jsonData ? upload.jsonData.length : 0,
        columnCount: upload.jsonData && upload.jsonData.length > 0 ? Object.keys(upload.jsonData[0]).length : 0,
        fileSize: upload.fileSize,
        uploadedAt: upload.uploadedAt,
        customPrompt
      },
      template
    );

    // Create report object
    const report = {
      id: uuidv4(),
      title: reportData.title,
      template,
      content: reportData.fullContent,
      sections: reportData.sections,
      metadata: {
        ...reportData.metadata,
        generatedFor: upload._id,
        generatedBy: req.user.id
      },
      createdAt: new Date()
    };

    // Add report to upload
    await Upload.findByIdAndUpdate(upload._id, {
      $push: { reports: report }
    });

    res.status(201).json({
      success: true,
      message: 'Report generated successfully',
      data: report
    });

  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500);
    throw new Error(`Failed to generate report: ${error.message}`);
  }
});

// @desc    Get all reports for an upload
// @route   GET /api/reports/:uploadId
// @access  Private
const getReports = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  }).select('originalName reports');

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  res.json({
    success: true,
    data: {
      uploadId: upload._id,
      originalName: upload.originalName,
      reports: upload.reports || []
    }
  });
});

// @desc    Get a specific report
// @route   GET /api/reports/:uploadId/:reportId
// @access  Private
const getReport = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  }).select('originalName reports');

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  const report = upload.reports?.find(r => r.id === req.params.reportId);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  res.json({
    success: true,
    data: {
      uploadId: upload._id,
      originalName: upload.originalName,
      report
    }
  });
});

// @desc    Update a report (for editing)
// @route   PUT /api/reports/:uploadId/:reportId
// @access  Private
const updateReport = asyncHandler(async (req, res) => {
  const { title, content, sections } = req.body;
  
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  const reportIndex = upload.reports?.findIndex(r => r.id === req.params.reportId);
  
  if (reportIndex === -1) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Update report
  const updatedReport = {
    ...upload.reports[reportIndex],
    title: title || upload.reports[reportIndex].title,
    content: content || upload.reports[reportIndex].content,
    sections: sections || upload.reports[reportIndex].sections,
    metadata: {
      ...upload.reports[reportIndex].metadata,
      lastEditedAt: new Date(),
      editedBy: req.user.id
    }
  };

  upload.reports[reportIndex] = updatedReport;
  await upload.save();

  res.json({
    success: true,
    message: 'Report updated successfully',
    data: updatedReport
  });
});

// @desc    Delete a report
// @route   DELETE /api/reports/:uploadId/:reportId
// @access  Private
const deleteReport = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  });

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  const reportIndex = upload.reports?.findIndex(r => r.id === req.params.reportId);
  
  if (reportIndex === -1) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Remove report
  upload.reports.splice(reportIndex, 1);
  await upload.save();

  res.json({
    success: true,
    message: 'Report deleted successfully'
  });
});

// @desc    Export report as text
// @route   GET /api/reports/:uploadId/:reportId/export/txt
// @access  Private
const exportReportTxt = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  }).select('originalName reports');

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  const report = upload.reports?.find(r => r.id === req.params.reportId);
  
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  // Set headers for file download
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/[^a-z0-9]/gi, '_')}.txt"`);
  
  // Format content for text export
  let textContent = `${report.title}\n`;
  textContent += `Generated on: ${new Date(report.createdAt).toLocaleDateString()}\n`;
  textContent += `Data source: ${upload.originalName}\n`;
  textContent += '='.repeat(60) + '\n\n';
  textContent += report.content;

  res.send(textContent);
});

// @desc    Export report as PDF
// @route   GET /api/reports/:uploadId/:reportId/export/pdf
// @access  Private
const exportReportPdf = asyncHandler(async (req, res) => {
  const upload = await Upload.findOne({
    _id: req.params.uploadId,
    user: req.user.id
  }).populate('user', 'name email');

  if (!upload) {
    res.status(404);
    throw new Error('Upload not found');
  }

  const report = upload.reports?.find(r => r.id === req.params.reportId);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  try {
    // For now, return plain text as PDF export functionality would require additional PDF libraries
    // In a production environment, you would use libraries like jsPDF, Puppeteer, or similar
    const content = `${report.title}\n\n${report.content}`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title}.pdf"`);
    
    // This is a simplified implementation - in production, convert to actual PDF
    res.send(Buffer.from(content, 'utf-8'));
  } catch (error) {
    console.error('Export PDF error:', error);
    res.status(500);
    throw new Error('Failed to export report as PDF');
  }
});

// @desc    Get user's report overview
// @route   GET /api/reports/overview
// @access  Private
const getReportsOverview = asyncHandler(async (req, res) => {
  const uploads = await Upload.find({ 
    user: req.user.id,
    reports: { $exists: true, $ne: [] }
  }).select('originalName reports uploadedAt');

  const allReports = [];
  uploads.forEach(upload => {
    if (upload.reports && upload.reports.length > 0) {
      upload.reports.forEach(report => {
        allReports.push({
          ...report,
          uploadId: upload._id,
          uploadName: upload.originalName,
          uploadDate: upload.uploadedAt
        });
      });
    }
  });

  // Sort by creation date (newest first)
  allReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const templateCounts = allReports.reduce((acc, report) => {
    acc[report.template] = (acc[report.template] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      totalReports: allReports.length,
      totalUploadsWithReports: uploads.length,
      templateBreakdown: templateCounts,
      recentReports: allReports.slice(0, 10), // Last 10 reports
      reports: allReports
    }
  });
});

// @desc    Generate report templates preview
// @route   GET /api/reports/templates
// @access  Private
const getReportTemplates = asyncHandler(async (req, res) => {
  const templates = {
    executive: {
      name: 'Executive Summary',
      description: 'High-level strategic insights for senior management',
      audience: 'C-level executives and senior management',
      sections: ['Executive Summary', 'Key Performance Indicators', 'Strategic Recommendations', 'Risk Assessment'],
      estimatedLength: '2-3 pages',
      tone: 'Professional, concise, strategic'
    },
    detailed: {
      name: 'Detailed Analysis',
      description: 'Comprehensive analysis with technical details',
      audience: 'Data analysts, managers, and technical stakeholders',
      sections: ['Executive Summary', 'Methodology', 'Detailed Findings', 'Statistical Analysis', 'Recommendations', 'Appendices'],
      estimatedLength: '5-8 pages',
      tone: 'Technical, thorough, analytical'
    },
    operational: {
      name: 'Operational Report',
      description: 'Process improvements and efficiency metrics',
      audience: 'Operations teams and middle management',
      sections: ['Operational Overview', 'Process Analysis', 'Efficiency Metrics', 'Improvement Opportunities'],
      estimatedLength: '3-5 pages',
      tone: 'Practical, action-oriented, clear'
    },
    financial: {
      name: 'Financial Analysis',
      description: 'Cost analysis and budget implications',
      audience: 'Finance teams and budget decision makers',
      sections: ['Financial Overview', 'Cost Analysis', 'Budget Impact', 'Financial Recommendations'],
      estimatedLength: '3-4 pages',
      tone: 'Precise, quantitative, business-focused'
    }
  };

  res.json({
    success: true,
    data: { templates }
  });
});

module.exports = {
  generateReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  exportReportTxt,
  exportReportPdf,
  getReportsOverview,
  getReportTemplates
};
