import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const name = sessionStorage.getItem("name");
  const baseUrl = "http://localhost:5173";

  useEffect(() => {
    if (!token) {
      alert("Login First to Come to this Page");
      window.location.href = "./login.html";
    } else {
      fetchAppointments();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${baseUrl}/booking/paticularUser`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAppointments(data.Data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const res = await fetch(`${baseUrl}/booking/remove/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.msg.includes("deleted succesfully")) {
        fetchAppointments();
        alert("Your Booking Successfully Cancelled");
      } else {
        alert(result.msg);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error.message);
      alert("Something Went Wrong!!");
    }
  };

  const handleVideoCall = (id) => {
    window.open(`http://localhost:5000/${id}`, "_blank");
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        All Bookings of {role} {name}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SI NO.</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Cancel Appointments</TableCell>
              <TableCell>Video Call</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={appointment._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{appointment.userEmail}</TableCell>
                <TableCell>{appointment.bookingDate}</TableCell>
                <TableCell>
                  {appointment.bookingSlot === "8-9"
                    ? "8 AM to 9 AM"
                    : appointment.bookingSlot === "9-10"
                    ? "9 AM to 10 AM"
                    : appointment.bookingSlot === "4-5"
                    ? "4 PM to 5 PM"
                    : "7 PM to 8 PM"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancelAppointment(appointment._id)}
                  >
                    Cancel
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleVideoCall(appointment._id)}
                  >
                    Video Call
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Appointment;
