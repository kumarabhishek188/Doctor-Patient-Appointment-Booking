import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

const baseUrl = `http://localhost:5500`;

const AppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert("Login First to Come to this Page");
      navigate("/login");
      return;
    }

    const role = sessionStorage.getItem("role");
    const name = sessionStorage.getItem("name");
    setUserRole(role);
    setUserName(name);

    fetchAppointments();
  }, [token, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${baseUrl}/booking/paticularUser`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
      });
      setAppointments(response.data.Data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/booking/remove/${id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.data.msg === `booking id of ${id} is deleted succesfully`) {
        alert("Your Booking Successfully Cancelled");
        fetchAppointments();
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error.message);
      alert("Something Went Wrong!!");
    }
  };

  const handleVideoCall = (id) => {
    window.open(`http://localhost:5000/${id}`, "_blank");
  };

  const formatTimeSlot = (slot) => {
    switch (slot) {
      case "8-9":
        return "8 AM to 9 AM";
      case "9-10":
        return "9 AM to 10 AM";
      case "4-5":
        return "4 PM to 5 PM";
      default:
        return "7 PM to 8 PM";
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Doctor Patient Appointment Booking
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        All Bookings of {userRole} {userName}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SI NO.</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Cancel Appointment</TableCell>
              <TableCell>Video Call</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={appointment._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{appointment.userEmail}</TableCell>
                <TableCell>{appointment.bookingDate}</TableCell>
                <TableCell>{formatTimeSlot(appointment.bookingSlot)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => cancelAppointment(appointment._id)}
                  >
                    Cancel Appointment
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

export default AppointmentPage;
