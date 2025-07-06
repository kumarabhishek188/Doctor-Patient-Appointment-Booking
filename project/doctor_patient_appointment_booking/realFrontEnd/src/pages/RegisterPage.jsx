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
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    password: "",
    specialty: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const data = {
      ...formData,
      role: role === "doctor" ? "doctor" : "patient",
    };

    // Basic validation
    if (
      !data.name ||
      !data.email ||
      !data.location ||
      !data.password ||
      (role === "doctor" && !data.specialty)
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch(`/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let out = {};
      try {
        out = await res.json();
      } catch (jsonErr) {
        setError("Server error: Invalid response from backend.");
        console.error("Invalid JSON from backend", jsonErr);
        return;
      }
      if (out.msg === "Successfully register") {
        setSuccess("Registration successful! Redirecting to login...");
        setFormData({
          name: "",
          email: "",
          location: "",
          password: "",
          specialty: "",
        });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(out.msg || "Registration failed.");
      }
    } catch (err) {
      setError("Error while registering");
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t("register.title")}
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
              <MenuItem value="Gynecologist">Gynecologist</MenuItem>
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
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
};

export default RegisterPage;
