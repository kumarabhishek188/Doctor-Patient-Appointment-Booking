const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
  bookingId: { type: String, required: true },
});

const ReviewModel = mongoose.model('review', reviewSchema);

module.exports = { ReviewModel };
