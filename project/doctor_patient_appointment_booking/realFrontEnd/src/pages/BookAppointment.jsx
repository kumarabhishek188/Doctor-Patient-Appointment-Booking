// src/pages/BookAppointment.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookAppointment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [minDate, setMinDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Set the minimum date (tomorrow)
  useEffect(() => {
    const dtToday = new Date();
    const tomorrow = new Date(dtToday);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const year = tomorrow.getFullYear();
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, "0");
    const day = tomorrow.getDate().toString().padStart(2, "0");
    setMinDate(`${year}-${month}-${day}`);
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = sessionStorage.getItem("token");
    const doctorId = sessionStorage.getItem("doctorId");

    if (!token) {
      alert("Please login first to book an appointment!!");
      navigate("/login");
      return;
    }

    if (!bookingDate || !bookingSlot) {
      setError("Please fill all the fields.");
      return;
    }

    const appointmentObj = {
      doctorId,
      bookingDate,
      bookingSlot,
    };

    try {
      const res = await axios.post(`/booking/create`, appointmentObj, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const out = res.data;
      if (out.success) {
        setSuccess(
          `Hi, your booking is confirmed on ${bookingDate} and a confirmation email has been sent to your registered email.`
        );
        setBookingDate("");
        setBookingSlot("");
        setTimeout(() => navigate("/appointments"), 1500);
      } else {
        setError(out.msg);
      }
    } catch (error) {
      setError("Something went wrong booking an appointment!");
      console.error("Error booking an appointment:", error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t("doctor.book_appointment")}
      </Typography>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleBooking}>
        <TextField
          label="Appointment Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: minDate }}
          fullWidth
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="slot-label">Select Slot</InputLabel>
          <Select
            labelId="slot-label"
            id="slotSelect"
            value={bookingSlot}
            label="Select Slot"
            onChange={(e) => setBookingSlot(e.target.value)}
          >
            <MenuItem value="">
              <em>--Please choose an slot option--</em>
            </MenuItem>
            <MenuItem value="8-9">8 AM to 9 AM</MenuItem>
            <MenuItem value="9-10">9 AM to 10 AM</MenuItem>
            <MenuItem value="4-5">4 PM to 5 PM</MenuItem>
            <MenuItem value="7-8">7 PM to 8 PM</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Book Appointment
        </Button>
      </form>
    </Box>
  );
};

export default BookAppointment;
