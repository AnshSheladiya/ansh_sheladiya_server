// models/CronLog.js

const mongoose = require('mongoose');

const cronLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  message: String,
});

const CronLog = mongoose.models.CronLog || mongoose.model('CronLog', cronLogSchema);

module.exports = CronLog;
