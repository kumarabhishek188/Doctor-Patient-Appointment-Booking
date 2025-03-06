import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";

const baseUrl = `http://localhost:5500`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = { email, password };

    try {
      const res = await axios.post(`${baseUrl}/user/login`, obj, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, role, name, msg } = res.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("name", name);
      alert(msg);

      if (msg === "Login Success") {
        navigate("/appointment");
      }
    } catch (err) {
      console.error("Error during login:", err.response || err.message);
      setError(
        err.response?.data?.msg || "An error occurred while logging in."
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login Page
      </Typography>
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
