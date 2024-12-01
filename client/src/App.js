import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Doctor from "./pages/doctor";
import Appointments from "./pages/appointments";
import Login from "./pages/login";
import Signup from "./pages/signup";
import "./index.css";
import NavBar from "./components/navbar";
import Pwreset from "./pages/pwreset";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch data from the backend
    axios
      .get("http://localhost:5000/test")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Router>
      <NavBar></NavBar>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/passwordreset" element={<Pwreset />} />
      </Routes>
    </Router>
  );
};

export default App;
