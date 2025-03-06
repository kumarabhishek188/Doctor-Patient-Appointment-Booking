import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Doctor from "./pages/Doctor";
import AppointmentPage from "./pages/AppointmentPage";
import BookAppointment from "./pages/BookAppointment"; // new component

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
};

export default App;
