import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Doctor from "./pages/Doctor";
import AppointmentPage from "./pages/AppointmentPage";
import BookAppointment from "./pages/BookAppointment"; // new component

const HomePage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <>
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: isDark
            ? "linear-gradient(135deg, #23272a 0%, #181a1b 100%)"
            : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
          padding: "40px 10px",
        }}
      >
        <h1
          style={{
            color: isDark ? "#fff" : "#2d3a4b",
            fontSize: "2.8rem",
            marginBottom: 10,
          }}
        >
          {t('home.welcome')}
        </h1>
        <p
          style={{
            color: isDark ? "#ccc" : "#444",
            fontSize: "1.2rem",
            maxWidth: 600,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          {t('home.book_now')}
        </p>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <a
            href="/register"
            className="cta-btn register-btn"
          >
            Register
          </a>
          <a
            href="/login"
            className="cta-btn login-btn"
          >
            Login
          </a>
        </div>
        <div className="feature-grid">
          <FeatureCard
            title="Book Appointments"
            icon="📅"
            desc="Easily schedule appointments with your preferred doctors."
          />
          <FeatureCard
            title="Video Consultation"
            icon="🎥"
            desc="Join secure, high-quality video calls for remote checkups."
          />
          <FeatureCard
            title="Real-time Chat"
            icon="💬"
            desc="Chat instantly with your doctor during your appointment."
          />
          <FeatureCard
            title="Doctor Directory"
            icon="👨‍⚕️"
            desc="Browse and search for doctors by specialty and location."
          />
        </div>
        <style>{`
          .cta-btn {
            background: #3498db;
            color: #fff;
            padding: 12px 28px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px #b3c6e0;
            border: none;
            transition: background 0.2s, color 0.2s, box-shadow 0.2s;
            display: inline-block;
          }
          .cta-btn.login-btn {
            background: #fff;
            color: #3498db;
            border: 2px solid #3498db;
          }
          .cta-btn:hover {
            background: #217dbb;
            color: #fff;
            box-shadow: 0 4px 16px #b3c6e0;
          }
          .cta-btn.login-btn:hover {
            background: #3498db;
            color: #fff;
          }
          .feature-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(220px, 1fr));
            gap: 32px;
            max-width: 700px;
            width: 100%;
            margin: 0 auto;
          }
          .feature-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 12px #e0eafc;
            padding: 28px 18px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 180px;
            transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
            border: 2px solid #e0eafc;
            cursor: pointer;
          }
          .feature-card:hover {
            box-shadow: 0 6px 24px #b3c6e0;
            border: 2px solid #3498db;
            transform: translateY(-4px) scale(1.03);
          }
        `}</style>
      </div>
      <footer style={{
        width: '100%',
        background: 'linear-gradient(90deg, #f8fafc 0%, #e0eafc 100%)',
        color: '#2d3a4b',
        textAlign: 'center',
        padding: '22px 0 16px 0',
        fontSize: '1.08rem',
        letterSpacing: '0.5px',
        marginTop: 48,
        borderTop: '1.5px solid #dbeafe',
        fontWeight: 600,
        boxShadow: '0 -2px 16px #e0eafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{fontSize: '1.15rem', fontWeight: 700, letterSpacing: '1px', color: '#217dbb', marginBottom: 2}}>
          &copy; {new Date().getFullYear()} Abhishek Kumar
        </div>
        <div style={{fontSize: '0.98rem', color: '#555', marginBottom: 2}}>
          Doctor-Patient Appointment Portal. All rights reserved.
        </div>
        <div style={{marginTop: 4, display: 'flex', gap: 18, alignItems: 'center'}}>
          <a href="mailto:abhishekkumarada12@gmail.com" style={{color:'#3498db',textDecoration:'none',fontSize:'1.2rem',display:'flex',alignItems:'center'}} title="Email">
            <span role="img" aria-label="email" style={{marginRight:6}}>✉️</span> abhishekkumarada12@gmail.com
          </a>
          <a href="https://www.linkedin.com/in/abhishek-kumar-92157823a/" target="_blank" rel="noopener noreferrer" style={{color:'#3498db',textDecoration:'none',fontSize:'1.2rem',display:'flex',alignItems:'center'}} title="LinkedIn">
            <span role="img" aria-label="linkedin" style={{marginRight:6}}>🔗</span> LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
};

const FeatureCard = ({ title, icon, desc }) => (
  <div className="feature-card">
    <div style={{ fontSize: 38, marginBottom: 12 }}>{icon}</div>
    <div
      style={{
        fontWeight: 700,
        color: "#2d3a4b",
        fontSize: "1.2rem",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    <div
      style={{
        color: "#555",
        textAlign: "center",
        fontSize: "1rem",
      }}
    >
      {desc}
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<Doctor />} />
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
};

export default App;
