import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const allergylist = [
    "Antibiotics",
    "NSAIDs",
    "Sulfa drugs",
    "Antiseizure medications",
    "pain medications",
    "ACE inhibitors",
    "contrast dyes",
    "chemotherapy drugs",
    "HIV drugs",
    "Insulin",
    "Herval medicines",
    "Moluscs",
    "Eggs",
    "Fish",
    "Lupin",
    "Soya",
    "Milk",
    "Peanuts",
    "Gluten",
    "Crustaceans",
    "Mustard",
    "Nuts",
    "Sesame",
    "Celery",
    "Sulphintes",
  ];
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    role: "patient",
    age: "",
    allergy: [],
    specialization: "",
    experience: "",
    password: "",
    reenterPassword: "",
  });

  const [expanded, setExpanded] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState("");
  const [passwordError, setPasswordError] = useState([]);
  const [passwordValid, setPasswordValid] = useState("");
  const [Allergies, setAllergies] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const navigate = useNavigate();
  const handleCheckboxChange = (option) => {
    setAllergies(
      (prevAllergies) =>
        prevAllergies.includes(option)
          ? prevAllergies.filter((value) => value !== option) // Remove if already selected
          : [...prevAllergies, option] // Add if not selected
    );
  };
  async function handleSubmit(event) {
    event.preventDefault();
    formData.allergy = Allergies;
    console.log(formData);
    await axios
      .post("http://localhost:5000/register", formData)
      .then(function (response) {
        if (response.status === 200) {
          navigate("/login");
        } else {
          console.log("Signup failed.");
        }
      })
      .catch((err) => console.log(err));
  }

  const roleSelect = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const showCheckboxes = () => {
    setExpanded(!expanded);
  };

  const emailCheck = () => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("Invalid email address.");
      setEmailValid("");
    } else {
      setEmailError("");
      setEmailValid("Valid email");
    }
  };

  const passwordCheck = () => {
    const errors = [];
    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(formData.password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(formData.password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/\d/.test(formData.password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[@$!%*?&]/.test(formData.password)) {
      errors.push(
        "Password must contain at least one special character (e.g., @$!%*?&)."
      );
    }

    setPasswordError(errors);

    if (errors.length === 0) {
      setPasswordValid("Strong password");
    } else {
      setPasswordValid("");
    }
  };

  return (
    <div className="login">
      <form className="login-form" id="signupForm" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <label>
          Username:
          <br />
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Email:
          <br />
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleInputChange}
            onBlur={emailCheck}
          />
          {emailError && <span className="error">{emailError}</span>}
          {emailValid && <span className="success">{emailValid}</span>}
        </label>
        <br />
        <br />
        <label>
          Name:
          <br />
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Role:
          <br />
          <div className="custom-select">
            <select
              name="role"
              id="roles"
              value={formData.role}
              onChange={roleSelect}
            >
              <option value="patient">patient</option>
              <option value="doctor">doctor</option>
            </select>
          </div>
        </label>
        <br />
        {formData.role === "patient" && (
          <div id="patient">
            <label>
              Age:
              <br />
              <input
                type="text"
                name="age"
                placeholder="Your age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              <div className="max-w-md mx-auto mt-10 p-4 bg-gray-50 rounded shadow-md">
                <button
                  onClick={showCheckboxes}
                  className="w-full px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-100 text-start"
                >
                  <strong>Allergies:</strong>{" "}
                </button>
                <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
                  <span className="text-gray-700">
                    {Allergies.join(", ") || "None"}
                  </span>
                </div>
                {expanded && (
                  <div className="mt-4 p-4 border rounded bg-white">
                    {allergylist.map((option) => (
                      <label key={option} className="block mb-2">
                        <input
                          type="checkbox"
                          value={formData.allergies}
                          checked={Allergies.includes(option)}
                          onChange={() => handleCheckboxChange(option)}
                          className="mr-2 rounded focus:ring-blue-500"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </label>
            <br />
          </div>
        )}
        {formData.role === "doctor" && (
          <div id="doctor">
            <label>
              Specialization:
              <br />
              <input
                type="text"
                name="specialization"
                placeholder="Your area of specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <br />
            <label>
              Experience:
              <br />
              <input
                type="text"
                name="experience"
                placeholder="Years of experience you have"
                value={formData.experience}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <br />
          </div>
        )}
        <label>
          Password:
          <br />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleInputChange}
            onBlur={passwordCheck}
          />
          {passwordError.length > 0 && (
            <ul className="error">
              {passwordError.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          {passwordValid && <span className="success">{passwordValid}</span>}
        </label>
        <br />
        <br />
        <label>
          Re-enter Password:
          <br />
          <input
            type="password"
            name="reenterPassword"
            placeholder="Re enter Password"
            required
            value={formData.reenterPassword}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <input type="submit" value="Sign up" />
      </form>
    </div>
  );
};

export default Signup;
