import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Doctor from "./pages/doctorpage";
import Appointments from "./pages/appointments";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import "./index.css";
import NavBar from "./components/navbar";
import Pwreset from "./pages/pwreset";
import { AuthProvider } from "./components/AuthContext";
import AdminDashboard from "./pages/admin";
import DoctorDashboard from "./pages/doctor";
import VideoCall from "./components/videocall";
import Chatbox from "./components/chatbox";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar></NavBar>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/passwordreset" element={<Pwreset />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/doctordashboard" element={<DoctorDashboard />} />
          <Route path="/videocall" element={<VideoCall />} />
        </Routes>
      </Router>
      <Chatbox />
    </AuthProvider>
  );
};

export default App;
