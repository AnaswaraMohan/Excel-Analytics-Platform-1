const mongoose = require('mongoose');

const chartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  upload: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Upload'
  },
  chartType: {
    type: String,
    required: true,
    enum: ['line', 'bar', 'pie', 'scatter']
  },
  xAxisKey: {
    type: String,
    required: true
  },
  yAxisKey: {
    type: String,
    required: true
  },
  chartConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  exportedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chart', chartSchema);
