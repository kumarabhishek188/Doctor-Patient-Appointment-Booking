// This script checks for upcoming appointments and creates in-app notifications for users
const { Bookingmodel } = require("./models/bookingModel");
const { NotificationModel } = require("./models/notificationModel");
const mongoose = require("mongoose");
require("dotenv").config();
const cron = require("node-cron");

// Connect to DB if not already connected
mongoose.connect(process.env.mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
  const inOneDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  // Find all future appointments
  const upcoming = await Bookingmodel.find({
    bookingDate: { $gte: now.toISOString().slice(0, 10) },
  });
  for (const appt of upcoming) {
    const apptDate = new Date(appt.bookingDate);
    // One hour before notification
    if (apptDate > now && apptDate <= inOneHour) {
      const exists = await NotificationModel.findOne({
        userId: appt.userId,
        message: { $regex: `scheduled on ${appt.bookingDate}` },
      });
      if (!exists) {
        await NotificationModel.create({
          userId: appt.userId,
          message: `Your upcoming appointment is scheduled on ${appt.bookingDate} at ${appt.bookingSlot}.`,
        });
      }
    }
    // One day before notification
    const diffMs = apptDate.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > 0.95 && diffDays < 1.05) {
      // within ~1 day
      const existsDay = await NotificationModel.findOne({
        userId: appt.userId,
        message: { $regex: `tomorrow` },
      });
      if (!existsDay) {
        await NotificationModel.create({
          userId: appt.userId,
          message: `Reminder: You have an appointment tomorrow (${appt.bookingDate}) at ${appt.bookingSlot}.`,
        });
      }
    }
  }
  console.log("Checked and created notifications for upcoming appointments.");
});
