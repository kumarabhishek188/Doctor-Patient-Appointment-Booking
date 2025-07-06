import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

const baseUrl = `http://localhost:4000`;

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const obj = { email, password };
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      const res = await axios.post(`/user/login`, obj, {
        headers: { "Content-Type": "application/json" },
      });
      const { token, role, name, msg } = res.data;
      if (msg === "Login Success") {
        setSuccess("Login successful! Redirecting...");
        setEmail("");
        setPassword("");
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("name", name);
        // Extract userId from JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        sessionStorage.setItem("userId", payload.userId);
        setTimeout(() => {
          if (role === "doctor") {
            navigate("/doctors");
          } else {
            navigate("/appointments");
          }
        }, 1200);
      } else {
        setError(msg || "Login failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred while logging in."
      );
      console.error("Error during login:", err.response || err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('login.title')}
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
