import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Container,
  AppBar,
  Toolbar,
  Link,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from "react-router-dom";

const baseUrl = "http://localhost:5173";

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await fetch(`${baseUrl}/user/doctors`);
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchDoctorsByLocation = async (location) => {
    try {
      const res = await fetch(`${baseUrl}/user/doctors/${location}`);
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error("Error fetching doctors by location:", error);
    }
  };

  const fetchDoctorsBySpecialty = async (specialty) => {
    try {
      const res = await fetch(`${baseUrl}/user/doctors/specialty/${specialty}`);
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (error) {
      console.error("Error fetching doctors by specialty:", error);
    }
  };

  const handleSearch = () => {
    if (location) {
      fetchDoctorsByLocation(location);
    }
  };

  const handleSpecialtyChange = (e) => {
    const selectedSpecialty = e.target.value;
    setSpecialty(selectedSpecialty);
    if (selectedSpecialty) {
      fetchDoctorsBySpecialty(selectedSpecialty);
    } else {
      fetchAllDoctors();
    }
  };

  const handleBookAppointment = (doctorId) => {
    sessionStorage.setItem("doctorId", doctorId);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Doctor Patient Appointment Booking
      </Typography>

      <Grid container spacing={2} alignItems="center" marginBottom={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Find doctors by location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Specialty</InputLabel>
            <Select value={specialty} onChange={handleSpecialtyChange}>
              <MenuItem value="">--Select Specialty--</MenuItem>
              <MenuItem value="Pediatrician">Pediatrician</MenuItem>
              <MenuItem value="Obstetricians">Gynecologist</MenuItem>
              <MenuItem value="Cardiologist">Cardiologist</MenuItem>
              <MenuItem value="Oncologist">Oncologist</MenuItem>
              <MenuItem value="Gastroenterologist">Gastroenterologist</MenuItem>
              <MenuItem value="Pulmonologist">Pulmonologist</MenuItem>
              <MenuItem value="Infectious disease">Infectious Disease</MenuItem>
              <MenuItem value="Nephrologist">Nephrologist</MenuItem>
              <MenuItem value="Endocrinologist">Endocrinologist</MenuItem>
              <MenuItem value="Ophthalmologist">Ophthalmologist</MenuItem>
              <MenuItem value="Dermatologist">Dermatologist</MenuItem>
              <MenuItem value="Psychiatrist">Psychiatrist</MenuItem>
              <MenuItem value="Neurologist">Neurologist</MenuItem>
              <MenuItem value="Radiologist">Radiologist</MenuItem>
              <MenuItem value="Surgeon">Surgeon</MenuItem>
              <MenuItem value="Physician">Physician</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Name: {doctor.name}</Typography>
                <Typography>Email: {doctor.email}</Typography>
                <Typography>Location: {doctor.location}</Typography>
                <Typography>Specialty: {doctor.specialty}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleBookAppointment(doctor._id)}
                  component={RouterLink}
                  to="/book-appointment"
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const BookAppointmentPage = () => {
  return (
    <Typography variant="h5" align="center">
      Book Appointment Page (Under Development)
    </Typography>
  );
};

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Link component={RouterLink} to="/" color="inherit" underline="none" marginRight={2}>
            Home
          </Link>
          <Link component={RouterLink} to="/doctors" color="inherit" underline="none" marginRight={2}>
            Doctors
          </Link>
          <Link component={RouterLink} to="/book-appointment" color="inherit" underline="none">
            Book Appointment
          </Link>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<DoctorsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/book-appointment" element={<BookAppointmentPage />} />
      </Routes>
    </Router>
  );
};

export default Doctor;
