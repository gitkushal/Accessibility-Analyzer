const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  results: {
    issueCount: {
      type: Number,
      default: 0
    },
    violations: [{
      id: String,
      impact: String,
      description: String,
      help: String,
      helpUrl: String,
      nodes: [{
        html: String,
        target: [String]
      }]
    }],
    passes: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
})

module.exports = mongoose.model('Scan', ScanSchema);