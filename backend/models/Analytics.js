const mongoose = require('mongoose');
const { Schema } = mongoose;

const analyticsSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  upload: { 
    type: Schema.Types.ObjectId, 
    ref: 'Upload', 
    required: true 
  },
  analysisType: {
    type: String,
    enum: ['basic', 'advanced', 'ml_enhanced'],
    required: true,
    default: 'basic'
  },
  results: {
    descriptiveStats: {
      columns: [{
        name: String,
        type: String,
        mean: Number,
        median: Number,
        mode: Schema.Types.Mixed,
        standardDeviation: Number,
        variance: Number,
        quartiles: [Number],
        outliers: [Schema.Types.Mixed],
        min: Number,
        max: Number,
        count: Number,
        nullCount: Number,
        uniqueCount: Number
      }]
    },
    correlationMatrix: Schema.Types.Mixed,
    dataQuality: {
      completeness: Number,
      uniqueness: Number,
      validity: Number,
      consistency: Number,
      overall_score: Number
    },
    patterns: [{
      type: String,
      description: String,
      confidence: Number,
      significance: String
    }],
    insights: [{
      category: String,
      finding: String,
      impact: String,
      recommendation: String,
      confidence: Number
    }],
    trends: [{
      column: String,
      direction: String, // 'increasing', 'decreasing', 'stable'
      strength: Number,
      significance: Number
    }],
    outliers: [{
      column: String,
      values: [Schema.Types.Mixed],
      method: String, // 'iqr', 'zscore', 'isolation_forest'
      count: Number
    }]
  },
  metadata: {
    rowCount: Number,
    columnCount: Number,
    processingTime: Number,
    algorithms_used: [String],
    version: String
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed', 'archived'],
    default: 'processing'
  },
  error: {
    message: String,
    stack: String,
    timestamp: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
analyticsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
analyticsSchema.index({ user: 1, upload: 1 });
analyticsSchema.index({ createdAt: -1 });
analyticsSchema.index({ status: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
