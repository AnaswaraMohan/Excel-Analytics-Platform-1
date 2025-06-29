const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  // Legacy field for compatibility
  parsedData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // New structured data storage
  jsonData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // File metadata
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  // Analysis status and results
  isAnalyzed: {
    type: Boolean,
    default: false
  },
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  analysisResults: {
    descriptiveStats: mongoose.Schema.Types.Mixed,
    correlationMatrix: mongoose.Schema.Types.Mixed,
    dataQuality: mongoose.Schema.Types.Mixed,
    outliers: mongoose.Schema.Types.Mixed,
    trends: mongoose.Schema.Types.Mixed,
    generatedAt: Date
  },
  // AI-generated insights
  aiInsights: {
    insights: [mongoose.Schema.Types.Mixed],
    fullResponse: String,
    generatedAt: Date,
    model: String
  },
  // Generated reports
  reports: [{
    id: String,
    title: String,
    template: String,
    content: String,
    sections: [mongoose.Schema.Types.Mixed],
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Timestamps
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastAnalyzedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Upload', uploadSchema);
