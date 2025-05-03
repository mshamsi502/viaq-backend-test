const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  parameter: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
