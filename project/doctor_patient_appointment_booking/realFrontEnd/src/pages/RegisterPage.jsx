import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
} from "@mui/material";

const RegisterPage = () => {
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    specialty: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      role: role === "doctor" ? "doctor" : "patient",
    };

    try {
      const res = await fetch(`http://localhost:5500/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const out = await res.json();
      alert(out.msg);
      if (out.msg === "Successfully register") {
        window.location.href = "/login";
      }
    } catch (err) {
      alert("Error while registering");
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Register As
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant={role === "doctor" ? "contained" : "outlined"}
          onClick={() => setRole("doctor")}
        >
          Doctor
        </Button>
        <Button
          variant={role === "patient" ? "contained" : "outlined"}
          onClick={() => setRole("patient")}
          sx={{ ml: 2 }}
        >
          Patient
        </Button>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        {role === "doctor" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Specialty</InputLabel>
            <Select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
            >
              <MenuItem value="">--Select Speciality--</MenuItem>
              <MenuItem value="Pediatrician">Pediatrician</MenuItem>
              <MenuItem value="Obstetricians">Gynecologist</MenuItem>
              <MenuItem value="Cardiologist">Cardiologist</MenuItem>
              <MenuItem value="Oncologist">Oncologist</MenuItem>
              <MenuItem value="Gastroenterologist">Gastroenterologist</MenuItem>
              <MenuItem value="Pulmonologist">Pulmonologist</MenuItem>
              <MenuItem value="Infectious disease">Infectious disease</MenuItem>
              <MenuItem value="Nephrologist">Nephrologist</MenuItem>
              <MenuItem value="Endocrinologist">Endocrinologist</MenuItem>
              <MenuItem value="Ophthalmologist">Ophthalmologist</MenuItem>
              <MenuItem value="Otolaryngologist">Otolaryngologist</MenuItem>
              <MenuItem value="Dermatologist">Dermatologist</MenuItem>
              <MenuItem value="Psychiatrist">Psychiatrist</MenuItem>
              <MenuItem value="Neurologist">Neurologist</MenuItem>
              <MenuItem value="Radiologist">Radiologist</MenuItem>
              <MenuItem value="Anesthesiologist">Anesthesiologist</MenuItem>
              <MenuItem value="Surgeon">Surgeon</MenuItem>
              <MenuItem value="Physician">Physician</MenuItem>

              {/* Add more specialties as needed */}
            </Select>
          </FormControl>
        )}
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage;
