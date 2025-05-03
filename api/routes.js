const express = require('express');
const Device = require('../models/Device');
const Notification = require('../models/Notification');

const router = express.Router();

router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find({})
      .sort({ lastSaved: -1 })
      .limit(10);
    const response = devices.map(device => ({
      serialNumber: device.serialNumber,
      checkpoints: device.checkpoints,
      lastSaved: device.lastSaved.time.toISOString().split('T')[1].split('.')[0],
    }));

    res.json(response);
  } catch (err) {
    console.error('❌ Error fetching devices:', err.message);
    res.status(500).json({ message: 'Error fetching devices' });
  }
});


router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({})
      .sort({ timestamp: -1 })
      .limit(10);

    const response = notifications.map(notification => ({
      deviceId: notification.deviceId,
      parameter: notification.parameter,
      value: notification.value,
      timestamp: notification.timestamp.toISOString().split('T')[1].split('.')[0], 
    }));

    res.json(response);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err.message);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router;
