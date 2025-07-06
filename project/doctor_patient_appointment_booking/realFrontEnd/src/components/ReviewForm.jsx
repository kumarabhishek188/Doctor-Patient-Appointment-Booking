import React, { useState } from "react";
import { Box, Button, Typography, TextField, Rating, Alert } from "@mui/material";
import axios from "axios";

const ReviewForm = ({ doctorId, bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    try {
      await axios.post(
        "/reviews",
        { doctorId, rating, review, bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Review submitted!");
      setRating(0);
      setReview("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.msg || "Error submitting review. You may have already reviewed this doctor."
      );
    }
  };

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="subtitle1">Rate & Review Doctor</Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Rating
          name="doctor-rating"
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
        />
        <TextField
          label="Write a review (optional)"
          multiline
          minRows={2}
          fullWidth
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ my: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </form>
    </Box>
  );
};

export default ReviewForm;
