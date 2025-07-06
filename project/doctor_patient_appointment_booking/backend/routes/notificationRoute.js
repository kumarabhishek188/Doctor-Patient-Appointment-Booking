const express = require('express');
const { NotificationModel } = require('../models/notificationModel');
const { authentication } = require('../middlewares/authenticationMiddleware');
const notificationRoute = express.Router();

// Get all notifications for the logged-in user
notificationRoute.get('/', authentication, async (req, res) => {
  try {
    const userId = req.body.userId;
    const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Error fetching notifications', error: error.message });
  }
});

// Mark a notification as read
notificationRoute.patch('/:id/read', authentication, async (req, res) => {
  try {
    const notificationId = req.params.id;
    await NotificationModel.findByIdAndUpdate(notificationId, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Error updating notification', error: error.message });
  }
});

module.exports = { notificationRoute };
