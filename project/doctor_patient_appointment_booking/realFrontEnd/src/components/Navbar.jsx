import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="inherit">Home</Button>
        <Button component={Link} to="/register" color="inherit">Register</Button>
        <Button component={Link} to="/login" color="inherit">Login</Button>
        <Button component={Link} to="/doctors" color="inherit">Doctors</Button>
        <Button component={Link} to="/appointments" color="inherit">Appointments</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
